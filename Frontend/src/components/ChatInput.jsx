import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, isStreaming }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-shrink-0 w-full p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="w-full flex gap-2 sm:gap-3 items-end">
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isStreaming ? "Waiting for response..." : "Ask a question about the paper..."}
            disabled={isStreaming}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows="1"
            style={{ maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          className="p-2.5 sm:p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors shadow-md hover:shadow-lg flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>
    </div>
  );
}