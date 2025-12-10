# Research Assistant Frontend

A modern, responsive React application for analyzing research papers with AI-powered summarization, intelligent Q&A chat, and voice input capabilities.

## 🚀 Features

### 📄 PDF Upload & Analysis
- Drag-and-drop or click-to-upload interface
- Real-time PDF preview with interactive viewer
- Support for PDF files up to 20MB
- Automatic structured extraction and summarization

### 📊 Smart Summarization
- AI-powered extraction of key paper sections:
  - **Title & Authors** - Paper identification
  - **Abstract** - Research overview
  - **Problem Statement** - Core research question
  - **Methodology** - Research approach and techniques
  - **Key Results** - Main findings and data
  - **Conclusion** - Summary and implications
- Expandable accordion interface for easy navigation
- Clean, organized presentation of extracted content

### 💬 Intelligent Chat Interface
- Context-aware Q&A based on uploaded paper
- Real-time streaming responses via SSE
- Markdown rendering for formatted responses
- Persistent chat context throughout session

### 🎤 Voice Input
- Speech-to-text functionality for hands-free interaction
- Real-time audio transcription
- Visual recording indicator
- Seamless integration with chat input

### 🎨 Modern UI/UX
- **Dual Theme Support**: Light and dark mode with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Split Panel Layout**: Simultaneous PDF viewing and chat interaction
- **Loading States**: Visual feedback for all operations
- **Error Handling**: User-friendly error messages
- **Animations**: Smooth transitions and micro-interactions

## 🛠️ Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **PDF Viewer**: @react-pdf-viewer/core & plugins
- **HTTP Client**: Axios
- **Markdown**: React-Markdown & GitHub Markdown CSS
- **State Management**: React Context API

## 📁 Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API integration
│   │   └── index.js           # Backend API calls
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   ├── ChatInput.jsx      # Message input with voice
│   │   ├── ChatMessage.jsx    # Individual chat message
│   │   ├── ChatPanel.jsx      # Chat interface container
│   │   ├── Header.jsx         # App header with theme toggle
│   │   ├── LoadingOverlay.jsx # Loading state indicator
│   │   ├── PDFViewer.jsx      # PDF display component
│   │   ├── SummaryAccordion.jsx # Collapsible summary sections
│   │   └── SummaryPanel.jsx   # Summary display container
│   ├── context/        # React Context
│   │   └── ThemeContext.jsx   # Theme state management
│   ├── hooks/          # Custom React hooks
│   │   └── useTheme.js        # Theme hook
│   ├── pages/          # Route pages
│   │   ├── HomePage.jsx       # Main application page
│   │   └── UploadPage.jsx     # PDF upload interface
│   ├── App.jsx         # Root component
│   ├── main.jsx        # Application entry point
│   ├── App.css         # Global styles
│   └── index.css       # Tailwind imports
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
└── Dockerfile          # Docker configuration
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend service running on `http://localhost:8000`

### Installation

1. **Navigate to frontend directory**
```bash
cd Frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the Frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build image
docker build -t research-assistant-frontend .

# Run container
docker run -p 5173:5173 research-assistant-frontend
```

### Using Docker Compose

From the root directory:
```bash
docker-compose up frontend
```

## 🎨 Component Overview

### Core Components

- **Header**: Application header with branding and theme toggle
- **PDFViewer**: Interactive PDF display with zoom and navigation
- **SummaryPanel**: Container for displaying extracted paper sections
- **SummaryAccordion**: Collapsible sections for each summary part
- **ChatPanel**: Chat interface with message history
- **ChatMessage**: Individual message bubble with formatting
- **ChatInput**: Input field with send button and voice recording
- **LoadingOverlay**: Full-screen loading indicator

### Pages

- **UploadPage**: Landing page with PDF upload interface
- **HomePage**: Main application page with split panel layout

### Context & Hooks

- **ThemeContext**: Global theme state (light/dark mode)
- **useTheme**: Custom hook for theme management

## 🔧 Configuration

### Vite Configuration (`vite.config.js`)
- React plugin enabled
- Server port: 5173
- Proxy configuration for API calls

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api` |

## 📦 Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "axios": "^1.7.9",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.468.0",
  "@react-pdf-viewer/core": "^3.12.0",
  "react-markdown": "^9.0.1",
  "pdfjs-dist": "^3.11.174"
}
```

## 🎯 Key Features Explained

### PDF Upload Flow
1. User uploads PDF via drag-and-drop or file picker
2. File is validated (size, format)
3. PDF is sent to backend for processing
4. Summary is extracted and displayed
5. PDF viewer loads the document
6. Chat interface becomes available

### Chat Interaction
1. User types question or uses voice input
2. Question is sent to backend with paper context
3. Response streams back in real-time via SSE
4. Messages are displayed with markdown formatting
5. Conversation history is maintained

### Theme System
- System preference detection
- Manual toggle between light/dark modes
- Persistent theme preference in localStorage
- Smooth transitions between themes

## 🎨 Styling

The application uses:
- **Tailwind CSS** for utility-first styling
- **Custom CSS** for animations and transitions
- **GitHub Markdown CSS** for chat message formatting
- **Responsive breakpoints** for mobile, tablet, and desktop

### Color Scheme

**Light Mode**:
- Background: White/Gray-50
- Primary: Indigo-600
- Text: Gray-900

**Dark Mode**:
- Background: Gray-900/Gray-800
- Primary: Indigo-500
- Text: Gray-100

## 🔐 Security Notes

- File size validation (20MB limit)
- File type validation (PDF only)
- API error handling
- XSS protection via React's built-in escaping
- CORS handling by backend

## 🐛 Troubleshooting

**Issue**: API calls failing
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Verify VITE_API_URL in .env
```

**Issue**: PDF not displaying
- Ensure pdf.worker.js is properly loaded
- Check browser console for errors
- Verify PDF file is not corrupted

**Issue**: Voice input not working
- Grant microphone permissions in browser
- Check browser compatibility (Chrome/Edge recommended)
- Verify audio recording API support

**Issue**: Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Performance Optimization

- **Code Splitting**: Lazy loading for routes
- **Asset Optimization**: Vite's built-in optimization
- **PDF Worker**: Separate thread for PDF rendering
- **Streaming**: SSE for real-time chat responses
- **Memoization**: React.memo for expensive components

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Integration with Backend

The frontend communicates with the backend via:
- **REST API**: PDF upload and transcription
- **Server-Sent Events**: Streaming chat responses
- **File Upload**: multipart/form-data for PDFs and audio

API endpoints configured in `src/api/index.js`

## 📄 License

This project is part of the Research Assistant application.

---

**Note**: This frontend requires the backend service to be running. Ensure the backend is started before using the application.