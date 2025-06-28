import React, { useState, useEffect } from 'react';
import { Copy, Check, Bot, Code, Image, FileText, Lightbulb, Sparkles, Zap, Brain, CheckSquare } from 'lucide-react';
import { Message } from '../types/chat';

interface StreamingMessageProps {
  message: Message;
  darkMode?: boolean;
  isStreaming?: boolean;
}

export default function StreamingMessage({ message, darkMode = false, isStreaming = false }: StreamingMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isComplete, setIsComplete] = useState(!isStreaming);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(message.content);
      setIsComplete(true);
      return;
    }

    setDisplayedContent('');
    setIsComplete(false);
    
    let currentIndex = 0;
    const content = message.content;
    
    const streamInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(streamInterval);
      }
    }, 20); // Adjust speed here (lower = faster)

    return () => clearInterval(streamInterval);
  }, [message.content, isStreaming]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const isUser = message.role === 'user';

  // Enhanced message type detection
  const getMessageType = (content: string) => {
    if (content.includes('```') || content.includes('function') || content.includes('const ') || content.includes('import ') || content.includes('def ') || content.includes('class ')) {
      return 'code';
    }
    if (content.includes('analyze') || content.includes('research') || content.includes('data') || content.includes('statistics')) {
      return 'analysis';
    }
    if (content.includes('create') || content.includes('write') || content.includes('story') || content.includes('poem') || content.includes('creative')) {
      return 'creative';
    }
    if (content.includes('🚀') || content.includes('Welcome') || content.includes('capabilities')) {
      return 'welcome';
    }
    return 'general';
  };

  const messageType = getMessageType(message.content);

  const getTypeIcon = () => {
    switch (messageType) {
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'analysis':
        return <FileText className="w-4 h-4" />;
      case 'creative':
        return <Lightbulb className="w-4 h-4" />;
      case 'welcome':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (messageType) {
      case 'code':
        return 'from-green-500 to-emerald-500';
      case 'analysis':
        return 'from-blue-500 to-cyan-500';
      case 'creative':
        return 'from-purple-500 to-pink-500';
      case 'welcome':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-purple-500 to-blue-500';
    }
  };

  const formatContent = (content: string) => {
    // Enhanced formatting for code blocks
    if (content.includes('```')) {
      const parts = content.split('```');
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          const lines = part.split('\n');
          const language = lines[0] || 'text';
          const code = lines.slice(1).join('\n');
          return (
            <div key={index} className="my-4">
              <div className={`text-xs px-3 py-1 rounded-t-lg font-medium ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>
                {language}
              </div>
              <pre className={`${darkMode ? 'bg-gray-800 text-green-300' : 'bg-gray-900 text-green-400'} p-4 rounded-b-lg overflow-x-auto text-sm border-l-4 border-green-400`}>
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        return <span key={index}>{formatText(part)}</span>;
      });
    }

    return formatText(content);
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Main headers with emojis
      if (line.startsWith('🚀 **') && line.endsWith('**')) {
        return (
          <div key={index} className="mb-6">
            <h1 className={`text-2xl font-bold flex items-center gap-3 mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              🚀 {line.replace(/🚀 \*\*(.*)\*\*/, '$1')}
            </h1>
            <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4"></div>
          </div>
        );
      }

      // Section headers with emojis
      if (line.match(/^[🧠💻🎨📊🔬🎯⚡] \*\*(.*)\*\*/)) {
        const emoji = line.match(/^([🧠💻🎨📊🔬🎯⚡])/)?.[1];
        const title = line.replace(/^[🧠💻🎨📊🔬🎯⚡] \*\*(.*)\*\*.*/, '$1');
        const description = line.replace(/^[🧠💻🎨📊🔬🎯⚡] \*\*.*\*\* - (.*)/, '$1');
        
        return (
          <div key={index} className={`my-4 p-4 rounded-xl border-l-4 border-purple-500 ${
            darkMode 
              ? 'bg-gray-700/70 border-gray-600' 
              : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <h3 className={`font-bold text-lg mb-1 ${
                  darkMode ? 'text-purple-200' : 'text-purple-900'
                }`}>{title}</h3>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>{description}</p>
              </div>
            </div>
          </div>
        );
      }

      // Performance characteristics section
      if (line.startsWith('⚡ **Performance Characteristics**')) {
        return (
          <div key={index} className="my-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${
              darkMode ? 'text-yellow-200' : 'text-yellow-800'
            }`}>
              ⚡ Performance Characteristics
            </h2>
          </div>
        );
      }

      // Interaction style section
      if (line.startsWith('**INTERACTION STYLE:**') || line.startsWith('**Ready to explore')) {
        return (
          <div key={index} className={`my-6 p-4 rounded-xl border ${
            darkMode 
              ? 'bg-green-800/50 border-green-600' 
              : 'bg-green-50 border-green-200'
          }`}>
            <p className={`font-semibold text-center ${
              darkMode ? 'text-green-100' : 'text-green-900'
            }`}>
              {line.replace(/\*\*/g, '')}
            </p>
          </div>
        );
      }

      // Bullet points with enhanced styling
      if (line.startsWith('- ')) {
        const content = line.replace(/^- /, '');
        return (
          <div key={index} className="flex items-start gap-3 my-2 pl-2">
            <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2"></div>
            <span className={`flex-1 text-sm leading-relaxed ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>{content}</span>
          </div>
        );
      }

      // Checkmark items
      if (line.includes('✅')) {
        return (
          <div key={index} className={`flex items-center gap-3 my-2 p-2 rounded-lg ${
            darkMode ? 'bg-green-800/40' : 'bg-green-50'
          }`}>
            <CheckSquare className={`w-4 h-4 flex-shrink-0 ${
              darkMode ? 'text-green-200' : 'text-green-700'
            }`} />
            <span className={`text-sm ${
              darkMode ? 'text-green-100' : 'text-green-900'
            }`}>{line.replace('✅ ', '')}</span>
          </div>
        );
      }

      // Shield/security items
      if (line.includes('🛡️') || line.includes('🔒') || line.includes('🚫')) {
        return (
          <div key={index} className={`flex items-center gap-3 my-2 p-2 rounded-lg ${
            darkMode ? 'bg-blue-800/40' : 'bg-blue-50'
          }`}>
            <span className="text-lg">{line.match(/[🛡️🔒🚫]/)?.[0]}</span>
            <span className={`text-sm ${
              darkMode ? 'text-blue-100' : 'text-blue-900'
            }`}>{line.replace(/[🛡️🔒🚫] /, '')}</span>
          </div>
        );
      }

      // Bold text formatting
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <div key={index} className="my-2">
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? 
                <strong key={partIndex} className={`font-semibold ${
                  darkMode ? 'text-purple-200' : 'text-purple-800'
                }`}>{part}</strong> : 
                <span key={partIndex} className={darkMode ? 'text-gray-100' : 'text-gray-900'}>{part}</span>
            )}
          </div>
        );
      }

      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className={`my-2 text-sm leading-relaxed ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {line}
          </p>
        );
      }

      return <br key={index} />;
    });
  };

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Floating Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
          isUser 
            ? 'bg-gradient-to-r from-gray-500 to-gray-700' 
            : `bg-gradient-to-r ${getTypeColor()}`
        }`}>
          {isUser ? (
            <Bot className="w-5 h-5 text-white" />
          ) : (
            <div className="text-white">
              {getTypeIcon()}
            </div>
          )}
          {!isUser && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
      </div>
      
      {/* Floating Message Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`relative px-5 py-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl ${
            isUser
              ? `bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md`
              : `${darkMode ? 'bg-gray-800/95 border border-gray-700 text-gray-100' : 'bg-white border border-gray-200 text-gray-900'} backdrop-blur-sm rounded-bl-md`
          }`}
        >
          <div className="text-sm leading-relaxed">
            {formatContent(displayedContent)}
            {isStreaming && !isComplete && (
              <span className="inline-block w-2 h-5 bg-current animate-pulse ml-1">|</span>
            )}
          </div>
          
          {/* Floating Copy button for assistant messages */}
          {!isUser && isComplete && (
            <button
              onClick={handleCopy}
              className={`absolute -top-2 -right-2 w-7 h-7 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-gray-50 border-gray-300'} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md border transform hover:scale-110`}
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className={`w-3 h-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
              )}
            </button>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs mt-2 px-2 ${isUser ? 'text-right' : 'text-left'} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
    </div>
  );
}