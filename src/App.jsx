import React, { useState, useRef, useEffect } from 'react';

// --- Helper Components & Icons ---

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconPaperclip = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const IconMic = ({ isRecording }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRecording ? "text-red-500 animate-pulse" : "text-gray-500"}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line>
  </svg>
);

const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const IconSun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-yellow-300">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const IconMoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-yellow-300">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);


// --- Main App Component ---

export default function App() {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([
    { role: 'assistant', content: [{ type: 'text', text: "Hello! I am Sentinel Helper. How can I assist you today with Sentinel Endpoint Defender?" }] }
  ]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);

  // --- API & MODEL CONFIGURATION ---
  // To use environment variables, create a .env file in your project's root directory.
  // Add your API key like this: REACT_APP_OPENAI_API_KEY=your_key_here
  // The REACT_APP_ prefix is required for Create React App projects.
  const OPENAI_API_KEY = "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";
  const MODEL = "gpt-4-turbo";

  // --- EFFECTS ---
  // Effect to scroll to the bottom of the chat on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effect to apply dark mode class to body and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
   // This function is the "cleanup" function.
   // It runs when the component unmounts (e.g., on page reload or close).
   return () => {
     if ('speechSynthesis' in window) {
       window.speechSynthesis.cancel();
     }
   };
 }, []);

  // --- HELPER FUNCTIONS ---
  // Function to convert a file to a base64 string
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  // --- CORE LOGIC ---

  // 1. Text-to-Speech (TTS) using Browser's built-in Speech Synthesis
 // 1. Text-to-Speech (TTS) using Browser's built-in Speech Synthesis
 const handleTextToSpeech = (text) => {
   if ('speechSynthesis' in window) {
     // --- ADD THIS LINE ---
     // This will stop any currently speaking utterance immediately.
     window.speechSynthesis.cancel();

     const utterance = new SpeechSynthesisUtterance(text);
     utterance.lang = 'en-US';
     window.speechSynthesis.speak(utterance);
   } else {
     console.error("Browser does not support Speech Synthesis.");
   }
 };

  // 2. Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // 3. Handle Audio Recording (Speech-to-Text)
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
          
          setIsTranscribing(true); // Start transcribing indicator

          // Call Whisper API for transcription
          try {
            const formData = new FormData();
            formData.append('file', audioFile);
            formData.append('model', 'whisper-1');

            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
              },
              body: formData,
            });
            const data = await response.json();
            
            if (data.text) {
              setInput(prev => prev ? `${prev} ${data.text}` : data.text);
            } else {
              console.error("Transcription failed:", data);
            }
          } catch (error) {
            console.error("Error transcribing audio:", error);
          } finally {
            setIsTranscribing(false); // Stop transcribing indicator
          }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        // Avoid using alert()
        const messageBox = document.createElement('div');
        messageBox.textContent = "Could not access microphone. Please check your browser permissions.";
        messageBox.style.cssText = 'position:fixed; top:10px; left:50%; transform:translateX(-50%); background:red; color:white; padding:10px; border-radius:5px; z-index:1000;';
        document.body.appendChild(messageBox);
        setTimeout(() => messageBox.remove(), 3000);
      }
    }
  };


  // 4. Handle Sending the Message (Main Function)
  const handleSendMessage = async () => {
    if ((!input.trim() && !imageFile) || isLoading) return;

    setIsLoading(true);
    const userMessageContent = [];

    // Prepare user message for display
    if (imagePreview) {
      userMessageContent.push({ type: 'image_url', image_url: { url: imagePreview } });
    }
    if (input.trim()) {
      userMessageContent.push({ type: 'text', text: input });
    }
    
    const newUserMessage = { role: 'user', content: userMessageContent };
    setMessages(prev => [...prev, newUserMessage]);

    // Prepare message for API
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content.map(part => part.type === 'text' ? { type: 'text', text: part.text } : { type: 'image_url', image_url: { url: part.image_url.url } }).flat()
    }));

    const apiUserMessageContent = [];
    if (input.trim()) {
      apiUserMessageContent.push({ type: 'text', text: input });
    }
    if (imageFile) {
      try {
        const base64Image = await toBase64(imageFile);
        apiUserMessageContent.push({ type: 'image_url', image_url: { url: base64Image } });
      } catch (error) {
        console.error("Error encoding image:", error);
        setIsLoading(false);
        return;
      }
    }
    
    apiMessages.push({ role: 'user', content: apiUserMessageContent });

    // Clear inputs
    setInput('');
    removeImage();

    // Define the system prompt
    const systemMessage = {
      role: 'system',
      content: 'You are Sentinel Helper, a specialized AI assistant for the "Sentinel Defender" product. Your primary function is to provide expert support and guidance on security. Be concise (100 words or less), professional, and helpful. If a user asks a question unrelated to Sentinel Defender, politely decline to answer and steer the conversation back to the product. Do not engage in casual conversation or answer questions about other topics.'
    };

    // Call OpenAI API
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          // Prepend the system message to the existing chat history
          messages: [systemMessage, ...apiMessages],
          max_tokens: 2048,
        }),
      });

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      setMessages(prev => [...prev, { role: 'assistant', content: [{ type: 'text', text: assistantResponse }] }]);
      handleTextToSpeech(assistantResponse);

    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: [{ type: 'text', text: "Sorry, I encountered an error. Please try again." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className={`flex flex-col h-screen bg-gray-100 font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-gray-800 p-4 flex items-center shadow-md dark:bg-gray-900">
        <div className="bg-blue-600 p-2 rounded-full">
          <IconShield />
        </div>
        <div className="ml-4">
          <h1 className="text-xl font-bold text-white">Sentinel Helper AI</h1>
          <p className="text-sm text-gray-300">Your AI support consultant</p>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="ml-auto p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? <IconSun /> : <IconMoon />}
        </button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-100 dark:bg-gray-800">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                <IconShield />
              </div>
            )}
            <div className={`max-w-xl w-full space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-white'}`}>
                {msg.content.map((part, partIndex) => {
                  if (part.type === 'text') {
                    return <p key={partIndex} className="whitespace-pre-wrap">{part.text}</p>;
                  }
                  if (part.type === 'image_url') {
                    return <img key={partIndex} src={part.image_url.url} alt="User upload" className="mt-2 rounded-lg max-w-xs" />;
                  }
                  return null;
                })}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="bg-gray-200 p-2 rounded-full flex-shrink-0 dark:bg-gray-600">
                <IconUser />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
              <IconShield />
            </div>
            <div className="p-4 rounded-2xl bg-white text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-white">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t p-4 dark:bg-gray-900 dark:border-gray-700">
        {imagePreview && (
          <div className="relative w-24 h-24 mb-2 p-1 border rounded-md dark:border-gray-600">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
            <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">&times;</button>
          </div>
        )}
        <div className="flex items-center bg-gray-100 rounded-full p-2 dark:bg-gray-800">
          <label htmlFor="file-upload" className="cursor-pointer p-2 hover:bg-gray-200 rounded-full dark:hover:bg-gray-700">
            <IconPaperclip />
          </label>
          <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          
          <button onClick={handleToggleRecording} className="p-2 hover:bg-gray-200 rounded-full dark:hover:bg-gray-700" disabled={isLoading || isTranscribing}>
            <IconMic isRecording={isRecording || isTranscribing} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isTranscribing ? "Processing your voice..." : "Describe your issue or record your voice..."}
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading || isTranscribing}
          />
          
          <button onClick={handleSendMessage} disabled={isLoading || isTranscribing || (!input.trim() && !imageFile)} className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
            <IconSend />
          </button>
        </div>
      </footer>
    </div>
  );
}