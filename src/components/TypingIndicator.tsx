import React from 'react';
import { Bot, Sparkles, Zap, Brain } from 'lucide-react';

interface TypingIndicatorProps {
  darkMode?: boolean;
}

export default function TypingIndicator({ darkMode = false }: TypingIndicatorProps) {
  return (
    <div className="flex gap-4 mb-8 group">
      <div className="flex-shrink-0 mt-1">
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-xl animate-pulse">
          <Brain className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800/90 border-gray-700 text-gray-100' : 'bg-white/90 border-gray-100 text-gray-800'} backdrop-blur-sm border rounded-3xl rounded-bl-lg px-6 py-4 shadow-xl max-w-[80%] group-hover:shadow-2xl transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500 animate-spin" />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              AI Chatbot is thinking...
            </span>
            <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          <div className={`h-1 w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Processing with advanced reasoning...
          </span>
        </div>
      </div>
    </div>
  );
}