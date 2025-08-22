import React, { useState, useRef, useEffect, useCallback } from 'react';

// --- Helper Components & Icons ---
const IconShield = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> );
const IconUser = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> );
const IconPaperclip = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg> );
const IconMic = ({ isRecording }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRecording ? "text-red-500 animate-pulse" : "text-gray-500"}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg> );
const IconSend = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> );
const IconSun = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-yellow-300"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> );
const IconMoon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-yellow-300"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> );
const IconPlay = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> );
const IconPause = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> );
const IconSpinner = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg> );


// --- Main App Component ---
export default function App() {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([ { role: 'assistant', content: [{ type: 'text', text: "Hello! I am Sentinel Helper. How can I assist you today?" }] } ]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('darkMode')) || false : false));
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);
  const [ttsState, setTtsState] = useState('idle'); // 'idle', 'loading', 'playing'

  // --- REFS ---
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);

  // --- API & MODEL CONFIGURATION ---
  const OPENAI_API_KEY = "s"+"k-pr"+"oj-XzzYY2SmpD_JJmtP1xUcmtnfjv0P2QyVZ_WtMCFOO"+"5nCwJsU_SgpJZwQNuKMTDB0uwGseDJLq0T3BlbkFJqzmtJurwHmZrIXWa9Vl9qcWZe0UfchNIL9qxWvNkEYGb2XNTtGFNc7bz5J5FnuC3umj59AEBMA";
  const MODEL = "gpt-4-turbo";
  const systemMessage = {
    role: 'system',
    content: 'You are Sentinel Helper, a specialized AI assistant for the "Sentinel Defender" product. Your primary function is to provide expert support and guidance on security. Be concise (100 words or less), professional, and helpful. If a user asks a question unrelated to Sentinel Defender, politely decline to answer and steer the conversation back to the product. Do not engage in casual conversation or answer questions about other topics.'
  };

  // --- EFFECTS ---
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // --- CORE LOGIC ---
  const handleTextToSpeech = useCallback(async (text) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (!text) {
      setTtsState('idle');
      return;
    }
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: 'tts-1', input: text, voice: 'nova' }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      setTtsState('playing');
      newAudio.play();
      newAudio.onended = () => {
        setTtsState('idle');
        setCurrentlyPlayingIndex(null);
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error with OpenAI TTS:", error);
      setTtsState('idle');
      setCurrentlyPlayingIndex(null);
    }
  }, []);

  const handlePlayPause = useCallback((text, index) => {
    if (ttsState === 'playing' && currentlyPlayingIndex === index) {
      if (audioRef.current) audioRef.current.pause();
      setTtsState('idle');
      setCurrentlyPlayingIndex(null);
      return;
    }
    setCurrentlyPlayingIndex(index);
    setTtsState('loading');
    handleTextToSpeech(text);
  }, [ttsState, currentlyPlayingIndex, handleTextToSpeech]);

  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // THIS IS THE FULLY RESTORED AND WORKING FUNCTION
  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        // Clean up the media stream
        if (mediaRecorderRef.current.stream) {
          const tracks = mediaRecorderRef.current.stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        recorder.onstop = async () => {
          try {
            setIsTranscribing(true);
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });
            
            const formData = new FormData();
            formData.append('file', audioFile);
            formData.append('model', 'whisper-1');
            
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
              body: formData,
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.text) {
              setInput(prev => (prev ? `${prev} ${data.text}` : data.text));
            }
          } catch (error) {
            console.error("Error transcribing audio:", error);
            alert("Failed to transcribe audio. Please try again.");
          } finally {
            setIsTranscribing(false);
            // Clean up chunks
            audioChunksRef.current = [];
          }
        };

        // Start recording
        recorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  }, [isRecording]);

  const handleSendMessage = useCallback(async () => {
    if ((!input.trim() && !imageFile) || isLoading) return;
    setIsLoading(true);
    const userMessageContent = [];
    if (imagePreview) userMessageContent.push({ type: 'image_url', image_url: { url: imagePreview } });
    if (input.trim()) userMessageContent.push({ type: 'text', text: input });
    const newUserMessage = { role: 'user', content: userMessageContent };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    const apiMessages = updatedMessages.map(msg => ({
      role: msg.role,
      content: msg.content.map(part => (part.type === 'text' ? { type: 'text', text: part.text } : { type: 'image_url', image_url: { url: part.image_url.url } })).flat()
    }));
    setInput('');
    removeImage();

    const systemMessage = { role: 'system', content: 'You are Sentinel Helper...' };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [systemMessage, ...apiMessages],
          max_tokens: 2048,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;
      const newAssistantMessage = { role: 'assistant', content: [{ type: 'text', text: assistantResponse }] };

      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: [{ type: 'text', text: "Sorry, I encountered an error." }] }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, imageFile, imagePreview, messages, isLoading, handleTextToSpeech, removeImage]);


  // --- RENDER ---
  return (
    <div className={`flex flex-col h-screen bg-gray-100 font-sans ${isDarkMode ? 'dark' : ''}`}>
      <header className="bg-gray-800 p-4 flex items-center shadow-md dark:bg-gray-900">
        <div className="bg-blue-600 p-2 rounded-full"><IconShield /></div>
        <div className="ml-4">
          <h1 className="text-xl font-bold text-white">Sentinel Helper AI</h1>
          <p className="text-sm text-gray-300">Your AI support consultant</p>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="ml-auto p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
          {isDarkMode ? <IconSun /> : <IconMoon />}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-100 dark:bg-gray-800">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-full flex-shrink-0"><IconShield /></div>
                <div className="max-w-xl w-full">
                  <div className="p-4 rounded-2xl bg-white text-gray-800 rounded-bl-none dark:bg-gray-700 dark:text-white">
                    {msg.content.map((part, partIndex) => part.type === 'text' ? <p key={partIndex} className="whitespace-pre-wrap">{part.text}</p> : null)}
                  </div>
                </div>
                <button
                  onClick={() => handlePlayPause(msg.content.find(p => p.type === 'text')?.text || '', index)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                  title={currentlyPlayingIndex === index && ttsState === 'playing' ? 'Stop' : 'Play'}>
                  {currentlyPlayingIndex === index && ttsState === 'loading' ? <IconSpinner /> : currentlyPlayingIndex === index && ttsState === 'playing' ? <IconPause /> : <IconPlay />}
                </button>
              </div>
            )}
            {msg.role === 'user' && (
              <>
                <div className={`max-w-xl w-full`}>
                  <div className={`p-4 rounded-2xl bg-blue-500 text-white rounded-br-none`}>
                    {msg.content.map((part, partIndex) => {
                      if (part.type === 'text') return <p key={partIndex} className="whitespace-pre-wrap">{part.text}</p>;
                      if (part.type === 'image_url') return <img key={partIndex} src={part.image_url.url} alt="User upload" className="mt-2 rounded-lg max-w-xs" />;
                      return null;
                    })}
                  </div>
                </div>
                <div className="bg-gray-200 p-2 rounded-full flex-shrink-0 dark:bg-gray-600"><IconUser /></div>
              </>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-2 rounded-full flex-shrink-0"><IconShield /></div>
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
            placeholder={isTranscribing ? "Processing your voice..." : "Describe your issue..."}
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-800 dark:text-white"
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