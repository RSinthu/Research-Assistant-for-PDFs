import { useRef, useEffect, memo } from 'react';
import { AlertCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendChatMessage } from '../api';

// Memoize the message list to prevent re-renders when only isStreaming changes
const MessageList = memo(({ messages, error }) => {
  return (
    <>
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
              Error
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          role={message.role} 
          text={message.text}
          isStreaming={message.isStreaming}
        />
      ))}
    </>
  );
});

MessageList.displayName = 'MessageList';

export default function ChatPanel({ 
  messages, 
  setMessages, 
  isStreaming, 
  setIsStreaming, 
  error, 
  setError,
  currentBotMessageRef 
}) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = async (messageText) => {
    const userMessage = { 
      id: Date.now(), 
      role: 'user', 
      text: messageText
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);
    currentBotMessageRef.current = '';

    const botMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: botMessageId,
      role: 'bot',
      text: '',
      isStreaming: true
    }]);

    try {
      await sendChatMessage(
        userMessage.text,
        (chunk) => {
          currentBotMessageRef.current += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMessageId 
                ? { ...msg, text: currentBotMessageRef.current }
                : msg
            )
          );
        },
        () => {
          setIsStreaming(false);
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMessageId 
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
        },
        (error) => {
          setIsStreaming(false);
          setError(error.message || 'Failed to get response');
          setMessages(prev => 
            prev.filter(msg => msg.id !== botMessageId)
          );
        }
      );
    } catch (err) {
      setIsStreaming(false);
      setError(err.message || 'Failed to send message');
      setMessages(prev => 
        prev.filter(msg => msg.id !== botMessageId)
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 w-full px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
          Ask Questions
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Ask natural language questions about the research paper
        </p>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 w-full min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        <MessageList messages={messages} error={error} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Separate Component */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
      />
    </div>
  );
}