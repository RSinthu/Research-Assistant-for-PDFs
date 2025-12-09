import { useState, useRef, useEffect } from 'react';
import PDFViewer from '../components/PDFViewer';
import SummaryPanel from '../components/SummaryPanel';
import ChatPanel from '../components/ChatPanel';
import LoadingOverlay from '../components/LoadingOverlay';
import { FileText, MessageCircle, FileDown } from 'lucide-react';

export default function HomePage({ file, summary, isProcessing }) {
  const [activeView, setActiveView] = useState('summary');

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "Hello! I'm ready to answer questions about the uploaded research paper. What would you like to know?"
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const currentBotMessageRef = useRef('');

  // Reset chat when a new PDF loads
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        role: 'bot',
        text: "Hello! I'm ready to answer questions about the uploaded research paper. What would you like to know?"
      }
    ]);
    setError(null);
    setIsStreaming(false);
    currentBotMessageRef.current = '';
  }, [file]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      {isProcessing && <LoadingOverlay />}

      {/* ========== MOBILE ========== */}
      <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <button
          onClick={() => setActiveView('pdf')}
          className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 text-sm font-medium relative ${
            activeView === 'pdf'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FileDown className="w-4 h-4" /> PDF
          {activeView === 'pdf' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>

        <button
          onClick={() => setActiveView('summary')}
          className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 text-sm font-medium relative ${
            activeView === 'summary'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FileText className="w-4 h-4" /> Summary
          {activeView === 'summary' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>

        <button
          onClick={() => setActiveView('chat')}
          className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 text-sm font-medium relative ${
            activeView === 'chat'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <MessageCircle className="w-4 h-4" /> Chat
          {activeView === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
      </div>

      {/* Mobile View Content */}
      <div className="flex-1 lg:hidden min-h-0 relative w-full">
        <div
          style={{ display: activeView === 'pdf' ? 'block' : 'none' }}
          className="absolute inset-0 w-full h-full"
        >
          <PDFViewer file={file} />
        </div>

        <div
          style={{ display: activeView === 'summary' ? 'block' : 'none' }}
          className="absolute inset-0 w-full h-full overflow-y-auto"
        >
          <SummaryPanel summary={summary} />
        </div>

        <div
          style={{ display: activeView === 'chat' ? 'flex' : 'none' }}
          className="absolute inset-0 w-full h-full"
        >
          <ChatPanel
            messages={messages}
            setMessages={setMessages}
            isStreaming={isStreaming}
            setIsStreaming={setIsStreaming}
            error={error}
            setError={setError}
            currentBotMessageRef={currentBotMessageRef}
          />
        </div>
      </div>

      {/* ========== DESKTOP ========== */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden w-full">
        {/* PDF Viewer */}
        <div className="w-5/12 xl:w-2/5 h-full border-r border-gray-200 dark:border-gray-800">
          <PDFViewer file={file} />
        </div>

        {/* Summary / Chat */}
        <div className="flex-1 flex flex-col min-h-0 w-full">
          {/* Tabs */}
          <div className="flex-shrink-0 w-full flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <button
              onClick={() => setActiveView('summary')}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium relative ${
                activeView === 'summary'
                  ? 'text-blue-600 dark:text-blue-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <FileText className="w-5 h-5" /> Summary
              {activeView === 'summary' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>

            <button
              onClick={() => setActiveView('chat')}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium relative ${
                activeView === 'chat'
                  ? 'text-blue-600 dark:text-blue-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <MessageCircle className="w-5 h-5" /> Chat
              {activeView === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 w-full relative">
            <div
              style={{ display: activeView === 'summary' ? 'block' : 'none' }}
              className="absolute inset-0 w-full h-full overflow-y-auto"
            >
              <SummaryPanel summary={summary} />
            </div>

            <div
              style={{ display: activeView === 'chat' ? 'flex' : 'none' }}
              className="absolute inset-0 w-full h-full"
            >
              <ChatPanel
                messages={messages}
                setMessages={setMessages}
                isStreaming={isStreaming}
                setIsStreaming={setIsStreaming}
                error={error}
                setError={setError}
                currentBotMessageRef={currentBotMessageRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
