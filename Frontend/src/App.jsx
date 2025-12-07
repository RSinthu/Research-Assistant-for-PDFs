import { useState } from 'react';
import Header from './components/Header';
import UploadPage from './pages/UploadPage';
import HomePage from './pages/HomePage';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file) => {
    console.log('File uploaded:', file);
    setUploadedFile(file);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setSummary({
        title: 'Use Case Document: Research Assistant for PDFs',
        authors: 'Development Team',
        abstract: 'This document outlines the use case...',
        problem: 'Researchers struggle with...',
        methodology: 'Our approach uses AI-powered...',
        results: 'The system successfully extracts...',
        conclusion: 'This tool significantly improves...'
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleNewPaper = () => {
    setUploadedFile(null);
    setSummary(null);
  };

  if (!uploadedFile) {
    return (
      <div className="h-screen flex flex-col">
        <Header fileName={null} onNewPaper={null} />
        <UploadPage onFileUpload={handleFileUpload} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header fileName={uploadedFile?.name} onNewPaper={handleNewPaper} />
      <HomePage 
        file={uploadedFile} 
        summary={summary} 
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default App;