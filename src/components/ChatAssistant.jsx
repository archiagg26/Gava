import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { aiService } from '../services/aiService';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  HelpCircle,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

export default function ChatAssistant({ fullHeight = false }) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: language === 'hi'
        ? 'नमस्ते! मैं आपका **घरसेतु एआई सहायक** हूँ। आप मुझसे पीएमएवाई-ग्रामीण के नियम, खतौनी में नाम सुधार, आवश्यक दस्तावेज़ या ग्राम सभा अनुमोदन से जुड़ा कोई भी सवाल पूछ सकते हैं।'
        : 'Namaste! I am your **GharSetu AI Sahayak**. Ask me anything about PMAY-Gramin guidelines, resolving Khatauni name discrepancies, required papers, or Gram Sabha approval.',
      disclaimer: language === 'hi'
        ? 'मार्गदर्शन केवल सूचनात्मक है। आधिकारिक स्वीकृति ग्राम पंचायत एवं बीडीओ कार्यालय द्वारा दी जाती है।'
        : 'Informational guidance grounded in official housing rules. Sanction rests with local authorities.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    { text: t('quickPrompt1') },
    { text: t('quickPrompt2') },
    { text: t('quickPrompt3') },
    { text: t('quickPrompt4') }
  ];

  const handleSend = async (messageToSend) => {
    const query = (messageToSend || inputValue).trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageToSend) setInputValue('');
    setLoading(true);

    try {
      const response = await aiService.askAssistant(query, messages, language);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.text,
        source: response.source,
        disclaimer: response.disclaimer
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: language === 'hi'
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया दोबारा प्रयास करें।'
            : 'Sorry, there was an issue retrieving guidance. Please try again.',
          disclaimer: 'Connection error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: language === 'hi'
          ? 'वार्तालाप रीसेट कर दिया गया है। आप अपना नया प्रश्न पूछ सकते हैं।'
          : 'Conversation reset. Feel free to ask a fresh question.',
        disclaimer: t('aiDisclaimer')
      }
    ]);
  };

  return (
    <div className={`flex flex-col bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden ${
      fullHeight ? 'h-[750px]' : 'h-[550px]'
    }`}>
      {/* Header */}
      <div className="bg-[#8EA66B] text-[#FFF9D6] p-4 flex items-center justify-between border-b border-[#788f57]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF9D6] text-[#8EA66B] flex items-center justify-center border border-[#D8A2A2]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <span>{t('aiChatTitle')}</span>
              <span className="text-[10px] bg-[#FFF9D6] text-[#2c3a1e] px-1.5 py-0.2 rounded-xs font-bold">
                Bilingual AI
              </span>
            </h3>
            <p className="text-[11px] text-[#FFF9D6]/80">
              {language === 'hi' ? 'ग्रामीण आवास व खतौनी सलाहकार' : 'Rural Housing & Land Guidelines Advisor'}
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-1.5 text-[#FFF9D6]/80 hover:text-white hover:bg-black/10 rounded-lg transition"
          title={language === 'hi' ? 'वार्तालाप रीसेट करें' : 'Reset Conversation'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2.5 bg-[#FFF9D6]/70 border-b border-[#D8A2A2]/50 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-[#612f2f] shrink-0 flex items-center gap-1 pl-1">
          <Sparkles className="w-3 h-3 text-[#914d4d]" />
          {language === 'hi' ? 'त्वरित प्रश्न:' : 'Suggested:'}
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p.text)}
            className="px-2.5 py-1 bg-white hover:bg-[#FFDCDC] text-stone-700 hover:text-[#612f2f] rounded-full border border-[#D8A2A2] text-[11px] whitespace-nowrap transition shrink-0 cursor-pointer shadow-2xs font-medium"
          >
            {p.text}
          </button>
        ))}
      </div>

      {/* Messages stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF7EE]/50 text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#D8A2A2] text-[#612f2f]'
                    : 'bg-[#8EA66B] text-[#FFF9D6]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-2xs ${
                isUser
                  ? 'bg-[#8EA66B] text-[#FFF9D6] rounded-tr-none'
                  : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none space-y-2'
              }`}>
                <div className="whitespace-pre-line leading-relaxed font-medium">
                  {msg.text}
                </div>

                {/* Assistant Disclaimer & Source */}
                {!isUser && msg.disclaimer && (
                  <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-[#914d4d]" />
                      <span>{msg.disclaimer}</span>
                    </span>
                    {msg.source && (
                      <span className="px-1.5 py-0.5 bg-[#FFF9D6] text-[#2c3a1e] rounded text-[9px] font-bold border border-[#D8A2A2]">
                        {msg.source === 'gemini-live' ? 'Gemini 1.5' : 'Grounded Rules'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#8EA66B] text-[#FFF9D6] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none p-3 border border-stone-200 text-stone-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#8EA66B]" />
              <span>{t('thinkingText')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('askPlaceholder')}
            className="flex-1 px-4 py-2.5 text-xs bg-[#FAF7EE] border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8EA66B] focus:border-[#8EA66B] transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="px-4 py-2.5 bg-[#8EA66B] hover:bg-[#788f57] disabled:bg-stone-300 text-[#FFF9D6] rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs"
          >
            <span>{t('sendBtn')}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[10px] text-stone-400 text-center mt-1.5">
          {t('aiDisclaimer')}
        </p>
      </div>
    </div>
  );
}
