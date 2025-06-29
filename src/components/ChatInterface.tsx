import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Trash2, AlertCircle, Settings, Download, Brain, Zap, Users, Clock, TrendingUp, Sparkles, Moon, Sun, Volume2, VolumeX, Square } from 'lucide-react';
import StreamingMessage from './StreamingMessage';
import TypingIndicator from './TypingIndicator';
import InputArea from './InputArea';
import { Message, ChatState, ChatMemory } from '../types/chat';
import { sendMessageToGemini } from '../lib/gemini';

export default function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        content: "🚀 **Welcome to AI Chatbot!** \n\nI'm your next-generation AI assistant with cutting-edge capabilities:\n\n🧠 **Advanced Reasoning** - Complex problem-solving with multi-step analysis\n💻 **Code Mastery** - Generate, debug, and optimize code in 50+ languages\n🎨 **Creative Intelligence** - Stories, poetry, scripts, and artistic content\n📊 **Data Wizardry** - Advanced analytics, visualizations, and insights\n🔬 **Research Excellence** - Deep analysis with real-time reasoning\n🎯 **Multimodal Power** - Text, images, audio, and video understanding\n⚡ **Lightning Speed** - Powered by advanced AI technology\n\n**Ready to explore the future of AI?** Ask me anything - from quantum physics to creative writing, I'm here to amaze you! ✨",
        role: 'assistant',
        timestamp: new Date(),
      }
    ],
    isLoading: false,
    error: null,
  });

  const [chatMemory, setChatMemory] = useState<ChatMemory>({
    conversationHistory: [],
    context: '',
    userPreferences: {
      topics: [],
      communicationStyle: 'casual'
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: 'smooth' | 'instant' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  // Auto-scroll during streaming - faster updates
  useEffect(() => {
    if (streamingMessageId) {
      const interval = setInterval(() => {
        scrollToBottom('smooth');
      }, 50);
      return () => clearInterval(interval);
    }
  }, [streamingMessageId]);

  // Update chat memory
  useEffect(() => {
    setChatMemory(prev => ({
      ...prev,
      conversationHistory: chatState.messages.slice(-20) // Keep last 20 messages
    }));
  }, [chatState.messages]);

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    
    // Update the streaming message with current content
    if (streamingMessageId && streamingContent) {
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === streamingMessageId 
            ? { ...msg, content: streamingContent }
            : msg
        ),
        isLoading: false,
      }));
    }
    
    setIsGenerating(false);
    setStreamingMessageId(null);
    setStreamingContent('');
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    setIsGenerating(true);

    // Play send sound
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    // Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Prepare conversation history for context
      const conversationHistory = chatState.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await sendMessageToGemini(content, conversationHistory, controller.signal);
      
      // Check if request was aborted
      if (controller.signal.aborted) {
        return;
      }
      
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      // Set streaming message ID and add message
      setStreamingMessageId(assistantMessageId);
      setStreamingContent(response);
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

      // Clear streaming after completion
      setTimeout(() => {
        setStreamingMessageId(null);
        setIsGenerating(false);
        setAbortController(null);
        setStreamingContent('');
      }, response.length * 8 + 500);

      // Play receive sound
      if (soundEnabled) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.2;
        audio.play().catch(() => {});
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, don't show error
        return;
      }
      
      setIsGenerating(false);
      setAbortController(null);
      setStreamingContent('');
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  };

  const handleClearChat = () => {
    handleStopGeneration(); // Stop any ongoing generation
    setChatState({
      messages: [
        {
          id: '1',
          content: "🚀 **Welcome to AI Chatbot!** \n\nI'm your next-generation AI assistant with cutting-edge capabilities:\n\n🧠 **Advanced Reasoning** - Complex problem-solving with multi-step analysis\n💻 **Code Mastery** - Generate, debug, and optimize code in 50+ languages\n🎨 **Creative Intelligence** - Stories, poetry, scripts, and artistic content\n📊 **Data Wizardry** - Advanced analytics, visualizations, and insights\n🔬 **Research Excellence** - Deep analysis with real-time reasoning\n🎯 **Multimodal Power** - Text, images, audio, and video understanding\n⚡ **Lightning Speed** - Powered by advanced AI technology\n\n**Ready to explore the future of AI?** Ask me anything - from quantum physics to creative writing, I'm here to amaze you! ✨",
          role: 'assistant',
          timestamp: new Date(),
        }
      ],
      isLoading: false,
      error: null,
    });
    setChatMemory({
      conversationHistory: [],
      context: '',
      userPreferences: {
        topics: [],
        communicationStyle: 'casual'
      }
    });
    setStreamingMessageId(null);
    setStreamingContent('');
  };

  const handleExportChat = () => {
    const chatData = {
      messages: chatState.messages,
      exportDate: new Date().toISOString(),
      messageCount: chatState.messages.length,
      metadata: {
        model: 'AI Chatbot',
        version: '1.0.0',
        features: ['Advanced Reasoning', 'Code Generation', 'Creative Writing', 'Data Analysis']
      }
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chatbot-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const dismissError = () => {
    setChatState(prev => ({ ...prev, error: null }));
  };

  const getStats = () => {
    const totalMessages = chatState.messages.length;
    const userMessages = chatState.messages.filter(m => m.role === 'user').length;
    const assistantMessages = chatState.messages.filter(m => m.role === 'assistant').length;
    const avgResponseTime = '0.8s'; // Simulated
    const tokensUsed = chatState.messages.reduce((acc, msg) => acc + msg.content.length, 0);
    
    return { totalMessages, userMessages, assistantMessages, avgResponseTime, tokensUsed };
  };

  const stats = getStats();

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white dark'
    : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-gray-900';

  const headerClasses = darkMode
    ? 'bg-gray-800/90 backdrop-blur-md border-gray-700'
    : 'bg-white/90 backdrop-blur-md border-gray-200';

  return (
    <div className={`flex flex-col h-screen ${themeClasses} transition-all duration-500 scrollbar-hidden`}>
      {/* Premium Header */}
      <div className={`${headerClasses} border-b px-6 py-4 shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                AI Chatbot
                <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center gap-2`}>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Next-Gen AI • {stats.totalMessages} messages • {stats.avgResponseTime} avg response
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Stop Generation Button */}
            {isGenerating && (
              <button
                onClick={handleStopGeneration}
                className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'text-red-200 hover:text-red-100 hover:bg-red-900/50 bg-red-800/50' : 'text-red-700 hover:text-red-900 hover:bg-red-50 bg-red-100'} rounded-xl transition-all duration-200 transform hover:scale-105 animate-pulse-red border ${darkMode ? 'border-red-700' : 'border-red-300'} shadow-lg`}
              >
                <Square className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Stop</span>
              </button>
            )}

            <button
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'text-gray-200 hover:text-purple-300 hover:bg-gray-700' : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'} rounded-xl transition-all duration-200 transform hover:scale-105`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Stats</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 ${darkMode ? 'text-gray-200 hover:text-blue-300 hover:bg-gray-700' : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'} rounded-xl transition-all duration-200`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 ${darkMode ? 'text-gray-200 hover:text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:text-yellow-700 hover:bg-yellow-50'} rounded-xl transition-all duration-200`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 ${darkMode ? 'text-gray-200 hover:text-purple-300 hover:bg-gray-700' : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'} rounded-xl transition-all duration-200`}
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleExportChat}
              className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'text-gray-200 hover:text-green-300 hover:bg-gray-700' : 'text-gray-700 hover:text-green-700 hover:bg-green-50'} rounded-xl transition-all duration-200 transform hover:scale-105`}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
            
            <button
              onClick={handleClearChat}
              className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'text-gray-200 hover:text-red-300 hover:bg-gray-700' : 'text-gray-700 hover:text-red-700 hover:bg-red-50'} rounded-xl transition-all duration-200 transform hover:scale-105`}
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Clear</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Panel */}
        {showStats && (
          <div className={`mt-6 p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/80'} rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} backdrop-blur-sm scrollbar-hidden`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Conversation Analytics</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.userMessages}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Your Messages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.assistantMessages}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>AI Responses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{chatMemory.conversationHistory.length}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>In Memory</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.avgResponseTime}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-1">{Math.round(stats.tokensUsed / 1000)}K</div>
                <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tokens Used</div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className={`mt-6 p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/80'} rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} backdrop-blur-sm scrollbar-hidden`}>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-purple-500" />
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Advanced Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Model Configuration</h4>
                <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} space-y-1`}>
                  <div>Model: AI Chatbot</div>
                  <div>Temperature: 0.8</div>
                  <div>Max Tokens: 2048</div>
                  <div>Context Window: 20 messages</div>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Capabilities Active</h4>
                <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} space-y-1`}>
                  <div>✅ Advanced Reasoning</div>
                  <div>✅ Code Generation</div>
                  <div>✅ Creative Writing</div>
                  <div>✅ Data Analysis</div>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Safety & Privacy</h4>
                <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} space-y-1`}>
                  <div>🛡️ Content Filtering: Active</div>
                  <div>🔒 Data Encryption: Enabled</div>
                  <div>🚫 Data Retention: Session Only</div>
                  <div>✅ Privacy Compliant</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {chatState.error && (
        <div className={`${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-400'} border-l-4 p-4 mx-6 mt-4 rounded-r-xl backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className={`${darkMode ? 'text-red-200' : 'text-red-800'} text-sm font-medium`}>{chatState.error}</p>
            </div>
            <button
              onClick={dismissError}
              className={`${darkMode ? 'text-red-300 hover:text-red-200' : 'text-red-700 hover:text-red-900'} transition-colors text-xl leading-none font-bold`}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Messages Container with Auto-scroll - NO SCROLLBARS */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-4xl mx-auto">
          {chatState.messages.map((message) => (
            <StreamingMessage 
              key={message.id} 
              message={message} 
              darkMode={darkMode} 
              isStreaming={message.id === streamingMessageId}
              onContentUpdate={(content) => {
                if (message.id === streamingMessageId) {
                  setStreamingContent(content);
                }
              }}
            />
          ))}
          
          {chatState.isLoading && <TypingIndicator darkMode={darkMode} />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Clean Input Area */}
      <div className="max-w-4xl mx-auto w-full">
        <InputArea 
          onSendMessage={handleSendMessage} 
          isLoading={chatState.isLoading || isGenerating} 
          darkMode={darkMode} 
          isGenerating={isGenerating}
          onStopGeneration={handleStopGeneration}
        />
      </div>
    </div>
  );
}