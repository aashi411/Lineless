
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', content: messageText, language };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messageText,
        config: {
          systemInstruction: `You are the LineLess Digital Public Infrastructure Assistant. 
          Your tone is formal, helpful, and governance-grade. 
          Current language mode: ${language === 'en' ? 'English' : 'Hindi'}. 
          Current view context: OPERATOR COMMAND CENTRE.`
        }
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text || "System synchronization error.",
        language
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'hi-IN';
    if (isListening) { recognition.stop(); setIsListening(false); }
    else {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (e: any) => { handleSend(e.results[0][0].transcript); setIsListening(false); };
      recognition.onerror = () => setIsListening(false);
    }
  };

  return (
    <div className={`fixed z-[100] transition-all duration-300 ${
      isOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'bottom-6 right-6'
    }`}>
      {isOpen ? (
        <div className={`
          bg-white shadow-2xl flex flex-col animate-fade-in overflow-hidden transition-all
          ${isOpen ? 'w-full h-full sm:w-[400px] sm:max-h-[min(650px,calc(100vh-80px))] sm:rounded-[2.5rem] border border-gray-100' : ''}
        `}>
          {/* Header - Fixed */}
          <header className="bg-primary-dark p-6 text-white flex justify-between items-center shadow-lg shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.2em]">DPI Assistant</span>
                <span className="text-[9px] opacity-40 font-black uppercase tracking-widest">Protocol V2.4</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')} className="text-[10px] font-black bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 uppercase tracking-widest">
                {language === 'en' ? 'हिन्दी' : 'EN'}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:text-accent p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </header>

          {/* Messages - Scrollable */}
          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 bg-gray-50/50 scroll-smooth">
            {messages.length === 0 && (
              <div className="text-center mt-12 px-8">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Command Interface</p>
                <p className="text-xs text-gray-300 mt-2 font-medium leading-relaxed italic">Operational assistance available for counter management and queue analytics.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                  m.role === 'user' ? 'bg-primary-dark text-white' : 'bg-white border-2 border-gray-100 text-primary-dark'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-[10px] text-gray-300 font-black uppercase tracking-widest ml-2">
                <div className="flex gap-1"><div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"></div><div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div><div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div></div>
                Syncing
              </div>
            )}
          </div>

          {/* Footer - Fixed */}
          <div className="p-6 border-t border-gray-100 bg-white shrink-0">
            <div className="flex gap-3">
              <button onClick={toggleVoice} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 text-white shadow-xl animate-pulse' : 'bg-gray-50 text-primary-dark hover:bg-accent border-2 border-gray-100'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 outline-none focus:border-accent text-sm font-bold text-primary-dark"
                  placeholder="Ask System..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={() => handleSend()} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-dark hover:text-accent">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-accent hover:bg-accent-bright rounded-2xl shadow-xl flex items-center justify-center text-primary-dark transition-all hover:scale-110">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
