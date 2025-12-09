import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Upload PDF and get summary
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};


// Chat with streaming response using Server-Sent Events (SSE)
export const sendChatMessage = async (question, onChunk, onComplete, onError) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to send message');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Split by SSE newlines
      const parts = buffer.split(/\r?\n\r?\n/); // double newline = message boundary
      buffer = parts.pop() || '';

      for (const part of parts) {
        const lines = part.split(/\r?\n/);

        let dataPayload = '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            dataPayload += line.slice(5).trim() + '\n';
          }
        }

        dataPayload = dataPayload.trim();

        if (dataPayload === '[DONE]') {
          onComplete();
          return;
        }

        try {
          const json = JSON.parse(dataPayload);

          if (json.error) {
            onError(new Error(json.error));
            return;
          }

          if (json.content) {
            onChunk(json.content);
          }

        } catch (e) {
          console.error('JSON parse failed, skipping:', dataPayload);
        }
      }
    }

    // If stream closes normally
    onComplete();

  } catch (err) {
    onError(err);
  }
};