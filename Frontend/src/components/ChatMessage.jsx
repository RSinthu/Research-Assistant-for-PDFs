import { Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { memo } from 'react'

function ChatMessage({ role, text, isStreaming = false }) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar - Only shown for bot messages */}
      {!isUser && (
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      {/* Message Bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
      }`}>
        {isUser ? (
          // User messages: Simple text display with line breaks preserved
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {text}
          </p>
        ) : (
          <>
            {/* Bot messages: Show loading state when streaming starts */}
            {isStreaming && !text ? (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            ) : (
              // Bot messages: Render Markdown content
              <div className="text-sm leading-relaxed break-words
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                [&_p]:my-3 [&_p]:leading-relaxed
                [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:my-3
                [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:my-3
                [&_h3]:text-base [&_h3]:font-semibold [&_h3]:my-3
                [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1
                [&_code]:text-xs [&_code]:bg-gray-200 dark:[&_code]:bg-gray-700 
                [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:break-words
                [&_pre]:my-3 [&_pre]:p-3 [&_pre]:overflow-x-auto
                [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-900
                [&_table]:text-xs [&_table]:my-3
                [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th]:bg-gray-100 dark:[&_th]:bg-gray-800
                [&_td]:border [&_td]:px-2 [&_td]:py-1
                [&_blockquote]:my-3 [&_blockquote]:border-l-4 
                [&_blockquote]:border-blue-500 [&_blockquote]:pl-4
                [&_img]:max-w-full [&_img]:h-auto
                [&_br]:block [&_br]:my-2
                text-gray-900 dark:text-gray-100">
                {/* ReactMarkdown: Parse and render Markdown content */}
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Custom table renderer with responsive container
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3 rounded border border-gray-200 dark:border-gray-700">
                        <table className="border-collapse w-full">
                          {children}
                        </table>
                      </div>
                    ),
                    // Custom code block renderer
                    pre: ({ children }) => (
                      <pre className="overflow-x-auto bg-gray-100 dark:bg-gray-900 rounded p-3 my-3">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {text}
                </ReactMarkdown>
                {/* Blinking cursor indicator while streaming */}
                {isStreaming && text && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-blue-600 dark:bg-blue-500 animate-pulse align-middle" />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* User Avatar - Only shown for user messages */}
      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}

export default memo(ChatMessage);