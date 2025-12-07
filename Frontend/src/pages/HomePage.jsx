import { useState } from 'react';
import PDFViewer from '../components/PDFViewer';
import SummaryPanel from '../components/SummaryPanel';
import ChatPanel from '../components/ChatPanel';
import LoadingOverlay from '../components/LoadingOverlay';
import { FileText, MessageCircle, FileDown } from 'lucide-react';

export default function HomePage({ file, summary, isProcessing }) {
  const [activeView, setActiveView] = useState('summary'); // 'pdf', 'summary', 'chat'

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      {isProcessing && <LoadingOverlay />}
      
      {/* Mobile: Tab Navigation */}
      <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <button
          onClick={() => setActiveView('pdf')}
          className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors relative ${
            activeView === 'pdf'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FileDown className="w-4 h-4" />
          PDF
          {activeView === 'pdf' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveView('summary')}
          className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors relative ${
            activeView === 'summary'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          Summary
          {activeView === 'summary' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveView('chat')}
          className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors relative ${
            activeView === 'chat'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Chat
          {activeView === 'chat' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Mobile: Single View */}
      <div className="flex-1 lg:hidden overflow-hidden">
        {activeView === 'pdf' && <PDFViewer file={file} />}
        {activeView === 'summary' && <SummaryPanel summary={summary} />}
        {activeView === 'chat' && <ChatPanel />}
      </div>

      {/* Desktop: Side-by-side Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left: PDF Viewer */}
        <div className="w-5/12 xl:w-2/5 border-r border-gray-200 dark:border-gray-800">
          <PDFViewer file={file} />
        </div>

        {/* Right: Summary/Chat */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <button
              onClick={() => setActiveView('summary')}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-colors relative ${
                activeView === 'summary'
                  ? 'text-blue-600 dark:text-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              Summary
              {activeView === 'summary' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            
            <button
              onClick={() => setActiveView('chat')}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-colors relative ${
                activeView === 'chat'
                  ? 'text-blue-600 dark:text-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Chat
              {activeView === 'chat' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'summary' ? (
              <SummaryPanel summary={summary} />
            ) : (
              <ChatPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}