import { useState, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { transcribeAudio } from '../api';
import toast from 'react-hot-toast';

export default function ChatInput({ onSendMessage, isStreaming }) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Start microphone recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await handleTranscribe(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('🎤 Recording started');
    } catch (err) {
      console.error('Microphone error:', err);
      toast.error('Microphone permission needed');
    }
  };

  // Stop microphone recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  // Send the audio to backend and fill the textarea with transcript
  const handleTranscribe = async (audioBlob) => {
    setIsTranscribing(true);
    toast.loading('Transcribing...');
    try {
      const data = await transcribeAudio(audioBlob);
      setInput(data.text);
      toast.dismiss();
      toast.success('Transcription complete!');
    } catch (err) {
      console.error('Transcription failed:', err);
      toast.dismiss();
      toast.error('Transcription failed. Try again.')
    } finally {
      setIsTranscribing(false);
    }
  };

  // Send a chat message
  const handleSend = () => {
    if (!input.trim() || isStreaming){
        toast.error('Please enter a message');
        return;
    }
    onSendMessage(input.trim());
    setInput('');
  };

  // Allow Enter = send, Shift+Enter = newline
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-shrink-0 w-full p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="w-full flex gap-2 sm:gap-3 items-end">

        {/* Text input / Transcribed text */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isTranscribing
                ? "Transcribing..."
                : isStreaming
                ? "Waiting for response..."
                : "Ask a question or use voice input..."
            }
            disabled={isStreaming || isTranscribing}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows="1"
            style={{ maxHeight: '120px' }}
          />
        </div>

        {/* Mic button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isStreaming || isTranscribing}
          className={`p-2.5 sm:p-3 rounded-xl transition-colors shadow-md hover:shadow-lg flex-shrink-0 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
              : 'bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 dark:disabled:bg-gray-700'
          }`}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          ) : (
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          )}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming || isTranscribing}
          className="p-2.5 sm:p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors shadow-md hover:shadow-lg flex-shrink-0"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
