import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, User, Sparkles, 
  RotateCcw, ChevronDown, Check, Clock, Flame, 
  HelpCircle, ExternalLink 
} from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'n8n' | 'fallback';
}

const N8N_WEBHOOK_URL = 'https://hasinikolluru.app.n8n.cloud/webhook/fc96fdb1-add8-48f7-abf5-d75dbfead628/chat';
const N8N_INSTANCE_ID = 'dc3ddf728bae0b31f05569c2b256093bea8b25d99f72de3ed97cc16817c82150';

const SUGGESTION_PROMPTS = [
  '🥖 Recommend a fresh sourdough',
  '🥐 Are the croissants eggless?',
  '📦 How do I track my order?',
  '⏰ What are today’s batch timings?',
  '🥭 Tell me about the Mango Tres Leches'
];

export const BakeryChatbot: React.FC = () => {
  const { 
    menuItems, 
    orders, 
    setActiveTab, 
    setTrackingOrderId,
    isChatOpen,
    setIsChatOpen 
  } = useBakery();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_crumb_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-init',
        sender: 'assistant',
        text: 'Namaste & Welcome to Hearth & Crumb! 🥖\n\nI am your live bakery assistant connected to our automated baking line. How can I help you today? You can ask about our wild sourdoughs, eggless bakes, batch times, or active orders.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'n8n'
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or restore session ID
  useEffect(() => {
    let sid = localStorage.getItem('hearth_crumb_chat_session');
    if (!sid) {
      sid = `patron-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('hearth_crumb_chat_session', sid);
    }
    setSessionId(sid);
  }, []);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hearth_crumb_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isChatOpen]);

  const generateLocalBakeryResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Sourdough recommendation
    if (q.includes('sourdough') || q.includes('bread') || q.includes('loaf')) {
      const bread = menuItems.find(m => m.category === 'Sourdough & Breads');
      return `Our flagship is the **San Francisco Country Sourdough Boule** (₹260). It undergoes a 36-hour slow cold fermentation using our natural starter "Chandana". Crust is deeply blistered and open-crumbed! We also have the **Rosemary & Malabar Sea Salt Focaccia** (₹240) drenched in cold-pressed extra virgin olive oil. Both are 100% Vegan!`;
    }

    // Eggless question
    if (q.includes('eggless') || q.includes('egg') || q.includes('vegetarian')) {
      const egglessItems = menuItems.filter(m => m.dietary === 'Eggless' || m.dietary === 'Vegan');
      const names = egglessItems.map(m => m.name).slice(0, 4).join(', ');
      return `Good news! Most of our bakes are 100% Eggless or Vegan, including our **French Butter Croissant** (₹180), **Cardamom & Pistachio Knot** (₹220), **Alphonso Mango Tres Leches** (₹340), and all Sourdoughs. Only the Heritage Parsi Mawa Cake contains eggs.`;
    }

    // Order tracking
    if (q.includes('track') || q.includes('order') || q.includes('status') || q.includes('hc-')) {
      const latestOrder = orders[0];
      if (latestOrder) {
        return `You can track any order on our Live Tracker! Your most recent order **#${latestOrder.id}** is currently in **${latestOrder.status.toUpperCase()}** status (${latestOrder.deliveryType === 'delivery' ? 'Express Delivery' : 'Counter Pickup'}). Click "Live Order Tracking" in the top bar or search with your Order ID!`;
      }
      return `You can track your order anytime using your Order ID (format HC-XXXX) or mobile number via the "Live Order Tracking" tab in the navigation bar!`;
    }

    // Batch timing / Hours
    if (q.includes('time') || q.includes('batch') || q.includes('hour') || q.includes('when')) {
      return `Our stone deck ovens fire at dawn! 
• First morning batch: 6:00 AM – 7:30 AM (Sourdough & Croissants)
• Second afternoon drop: 12:00 PM – 1:30 PM (Fresh Focaccia & Savory Puffs)
• Bakehouse Counter Hours: Tuesday – Sunday: 7:00 AM – 8:30 PM (Mondays closed).`;
    }

    // Mango tres leches / cakes
    if (q.includes('mango') || q.includes('cake') || q.includes('dessert') || q.includes('sweet')) {
      return `The **Alphonso Mango Tres Leches Cake** (₹340) is our signature dessert! It's made with fresh Ratnagiri mango pulp soaked into light sponge with three cardamom-infused milks and whipped velvet mascarpone. 100% Eggless and baked fresh this morning!`;
    }

    // Default polite bakery guidance
    return `Thank you for asking! Hearth & Crumb is an artisanal neighborhood bakehouse located on Colaba Causeway, Mumbai. We deck-bake small batches daily in Indian Rupees (₹). You can add items to your shopping bag, pay seamlessly via UPI or Card, and track real-time oven inventory!`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = {
        action: 'sendMessage',
        sessionId: sessionId || 'patron-default',
        chatInput: text,
        message: text
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Instance-Id': N8N_INSTANCE_ID
      };

      // Attempt 1: Direct fetch to the n8n webhook URL
      // Attempt 2: Fallback to local Vite proxy /api/n8n-chat if needed
      let response: Response | null = null;
      let usedProxy = false;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (directErr) {
        console.warn('Direct n8n fetch failed, trying proxy...', directErr);
        try {
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 12000);
          response = await fetch('/api/n8n-chat', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: controller2.signal
          });
          clearTimeout(timeoutId2);
          usedProxy = true;
        } catch (proxyErr) {
          console.warn('Proxy fetch also failed:', proxyErr);
        }
      }

      let botReply = '';
      let isN8nSuccess = false;

      if (response && response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          // Support multiple n8n output schemas
          if (typeof data === 'string') {
            botReply = data;
          } else if (data.output) {
            botReply = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
          } else if (data.text) {
            botReply = data.text;
          } else if (data.response) {
            botReply = data.response;
          } else if (data.message && data.message !== 'Workflow was started') {
            botReply = data.message;
          } else if (Array.isArray(data) && data[0]?.text) {
            botReply = data[0].text;
          } else {
            botReply = JSON.stringify(data);
          }
          isN8nSuccess = Boolean(botReply && botReply !== '{"message":"Error in workflow"}');
        } else {
          botReply = await response.text();
          isN8nSuccess = Boolean(botReply && !botReply.includes('Error in workflow'));
        }
      }

      // If n8n workflow returned an error, timed out, or had no text, use our intelligent local bakery response
      if (!isN8nSuccess || !botReply) {
        botReply = generateLocalBakeryResponse(text);
      }

      const botMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: isN8nSuccess ? 'n8n' : 'fallback'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackReply = generateLocalBakeryResponse(text);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'fallback'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Clear chat history?')) {
      const resetMessages: ChatMessage[] = [
        {
          id: `msg-reset-${Date.now()}`,
          sender: 'assistant',
          text: 'Chat history cleared. How else may I assist you with our hearth bakes today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'n8n'
        }
      ];
      setMessages(resetMessages);
      localStorage.removeItem('hearth_crumb_chat_history');
    }
  };

  return (
    <>
      {/* Floating Chat Launcher Button (Bottom-Right) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-amber-900 hover:bg-amber-800 text-stone-50 p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer group hover:scale-105 active:scale-95 border border-amber-700/60"
          aria-label="Open Bakery Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-amber-900 animate-pulse" />
          </div>
          <span className="hidden sm:inline text-xs font-semibold tracking-wide">
            Chat with Bakery AI
          </span>
          <span className="text-[10px] bg-amber-800 text-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
            n8n
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isChatOpen && (
        <div 
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[540px] max-h-[85vh] bg-[#FAF8F5] rounded-2xl shadow-2xl border border-stone-300/80 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
          onClick={e => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="bg-stone-900 text-stone-100 px-4 py-3.5 flex items-center justify-between border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-900 flex items-center justify-center text-amber-200 shrink-0 border border-amber-700">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold text-stone-100 tracking-wide">
                    Hearth & Crumb Assistant
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected to n8n Chat Webhook" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-amber-300/80">
                  <span>n8n Cloud Webhook</span>
                  <span>·</span>
                  <span className="font-mono">Live</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-stone-400">
              <button
                onClick={clearChat}
                className="p-1.5 hover:text-stone-100 hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
                title="Clear Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 hover:text-stone-100 hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Webhook Notice Pill */}
          <div className="bg-amber-100/70 border-b border-amber-200/80 px-3 py-1.5 text-[10px] text-amber-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 truncate max-w-[280px]">
              <Sparkles className="w-3 h-3 text-amber-700 shrink-0" />
              <span className="truncate">Automated n8n AI agent for Hearth & Crumb</span>
            </div>
            <span className="font-mono text-[9px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950 font-semibold">
              Webhook
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-amber-900 text-stone-50 rounded-br-xs font-normal'
                    : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-xs'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  <div className={`mt-1 text-[9px] flex items-center gap-1 ${
                    msg.sender === 'user' ? 'text-amber-200/70 justify-end' : 'text-stone-400 justify-start'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {msg.source === 'n8n' && (
                      <span className="text-[8px] bg-amber-50 text-amber-800 px-1 rounded border border-amber-200">
                        n8n
                      </span>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader Indicator */}
            {isLoading && (
              <div className="flex gap-2 items-center text-stone-500 text-xs">
                <div className="w-7 h-7 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-xs px-3.5 py-2.5 flex items-center gap-1.5 shadow-xs">
                  <span className="text-[11px] text-stone-500 mr-1">Consulting n8n AI agent</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-stone-100 border-t border-stone-200/80 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
            {SUGGESTION_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-full transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about bakes, batch times, orders..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-900 focus:bg-white transition-all disabled:opacity-50"
            />
            
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-amber-900 hover:bg-amber-800 disabled:opacity-40 text-stone-50 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
