import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Loader2, Mic, Paperclip, Sparkles, Code, Lightbulb, BarChart3, FileText, Zap, Brain } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  darkMode?: boolean;
}

export default function InputArea({ onSendMessage, isLoading, darkMode = false }: InputAreaProps) {
  const [message, setMessage] = useState('');
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickPrompts = [
    {
      icon: <Code className="w-4 h-4" />,
      text: "Generate a Python web scraper",
      category: "Code",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "Write a sci-fi story about AI consciousness",
      category: "Creative",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      text: "Analyze market trends for renewable energy",
      category: "Analysis",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-4 h-4" />,
      text: "Explain quantum computing principles",
      category: "Research",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FileText className="w-4 h-4" />,
      text: "Create a business plan template",
      category: "Business",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      text: "Debug this JavaScript function",
      category: "Debug",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const handleQuickPrompt = (prompt: string) => {
    if (!isLoading) {
      onSendMessage(prompt);
      setShowQuickPrompts(false);
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [message]);

  return (
    <div className="transition-all duration-300">
      {/* Transparent Quick Prompts */}
      {showQuickPrompts && (
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AI-Powered Quick Prompts
              </span>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Click any prompt to experience AI Chatbot's capabilities
              </p>
            </div>
            <button
              onClick={() => setShowQuickPrompts(false)}
              className={`ml-auto text-xs ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
            >
              Hide
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt.text)}
                disabled={isLoading}
                className={`group relative p-4 text-left rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-gray-800/30 hover:bg-gray-700/40 border-gray-600/50 text-white' 
                    : 'bg-white/20 hover:bg-white/30 border-gray-200/50 text-gray-900'
                } hover:shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${prompt.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    {prompt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {prompt.category}
                    </div>
                    <div className="text-sm font-medium leading-tight">
                      {prompt.text}
                    </div>
                  </div>
                </div>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${prompt.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transparent Input Area */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... I can help with advanced coding, creative writing, data analysis, research, and much more! (Press Enter to send, Shift+Enter for new line)"
              className={`w-full px-6 py-4 pr-16 border rounded-3xl resize-none focus:outline-none transition-all duration-300 min-h-[60px] max-h-[120px] text-sm leading-relaxed backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/30 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/70 focus:bg-gray-800/50' 
                  : 'bg-white/20 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-purple-500/70 focus:bg-white/30'
              } focus:ring-4 focus:ring-purple-500/20`}
              disabled={isLoading}
              rows={1}
            />
            
            {/* Input Actions */}
            <div className="absolute right-4 bottom-4 flex items-center gap-2">
              <button
                type="button"
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-purple-300 hover:bg-gray-700/50' 
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
                title="Attach file (Coming soon)"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-purple-300 hover:bg-gray-700/50' 
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
                title="Voice input (Coming soon)"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Modern Triangular Send Button - ROTATED 180 DEGREES */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`w-12 h-12 flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-full shadow-lg hover:shadow-xl ${
                darkMode 
                  ? 'bg-slate-700 hover:bg-slate-600' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              style={{ marginBottom: '4px' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white ml-0.5"
                >
                  <path 
                    d="M21 12L3 20L11 12L3 4L21 12Z" 
                    fill="currentColor"
                    className="drop-shadow-sm"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className={`mt-4 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center gap-2`}>
          <Brain className="w-3 h-3" />
          <span>Powered by AI Chatbot • Advanced AI with multimodal capabilities</span>
          <Zap className="w-3 h-3 text-yellow-500" />
        </div>
      </div>
    </div>
  );
}