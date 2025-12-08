import { useState } from 'react';
import Header from './components/Header';
import UploadPage from './pages/UploadPage';
import HomePage from './pages/HomePage';
import { uploadPDF } from './api';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    console.log('File uploaded:', file);
    setUploadedFile(file);
    setIsProcessing(true);
    setError(null);
    
    try {
      // Call backend API
      const summaryData = await uploadPDF(file);
      
      // Map backend response to frontend format
      setSummary({
        title: summaryData.title_and_authors || 'No title available',
        abstract: summaryData.abstract || 'No abstract available',
        problem: summaryData.problem_statement || 'No problem statement available',
        methodology: summaryData.methodology || 'No methodology available',
        results: summaryData.key_results || 'No results available',
        conclusion: summaryData.conclusion || 'No conclusion available'
      });
      
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.detail || 'Failed to process PDF. Please try again.');
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewPaper = () => {
    setUploadedFile(null);
    setSummary(null);
    setError(null);
  };

  if (!uploadedFile) {
    return (
      <div className="h-screen flex flex-col">
        <Header fileName={null} onNewPaper={null} />
        <UploadPage onFileUpload={handleFileUpload} error={error} />
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