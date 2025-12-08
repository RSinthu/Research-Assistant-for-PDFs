import { useState } from 'react';
import { Upload, FileText, Brain, MessageCircle, BookOpen, AlertCircle } from 'lucide-react';

export default function UploadPage({ onFileUpload, error }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 py-8 md:py-12">
        {/* Logo Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 flex-shrink-0">
          <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 text-center px-4">
          Research Paper Assistant
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 md:mb-12 text-center max-w-md px-4">
          Upload your research paper to get structured summaries and ask questions
        </p>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-2xl mx-4 mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                Upload Failed
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-8 sm:p-10 md:p-12 text-center transition-all mx-4 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'
          }`}
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3 md:mb-4 flex-shrink-0">
              <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Drag & drop your research paper
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-5 md:mb-6">
              or click to browse • PDF files only
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-10 md:mt-16 max-w-4xl w-full px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-6 text-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4 flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1.5 md:mb-2">
              Upload PDF
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Single research paper
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-6 text-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-950/30 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4 flex-shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1.5 md:mb-2">
              AI Summary
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Structured extraction
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-950/30 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4 flex-shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1.5 md:mb-2">
              Ask Questions
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Natural language Q&A
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}