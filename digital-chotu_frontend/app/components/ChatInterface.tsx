"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

/* ─── Types ─────────────── */

type Role = "user" | "chotu";
interface Message { id: number; role: Role; text: string; }
export interface CartItem { 
  name: string; 
  variant: string; 
  quantity: number; 
  price: number;
  image?: string; 
}

let msgId = 1;
const nextId = () => ++msgId;

const GREETING: Message = {
  id: 0,
  role: "chotu",
  text: "Namaste! I am Chotu, your shopping helper.",
};

/* ─── Sub-components ──────────────────────────────── */

function ChotuBubble({
  text,
  onReplay,
  isSpeakingThis,
}: {
  text: string;
  onReplay: () => void;
  isSpeakingThis: boolean;
}) {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="w-3 h-3 rounded-full mb-1 shrink-0" style={{ background: "#8B7FD9" }} aria-hidden />
      <div
        className="rounded-[20px] rounded-bl-[4px] px-5 py-4 text-lg leading-relaxed flex items-start gap-3"
        style={{ background: "#EDEBFA", color: "#1e1b3a" }}
      >
        <span>{text}</span>
        <button
          type="button"
          onClick={onReplay}
          className="shrink-0 text-base leading-none opacity-60 hover:opacity-100 transition-opacity active:scale-95"
          style={{ color: "#8B7FD9" }}
          aria-label="Replay this message"
          title="Replay"
        >
          {isSpeakingThis ? "🔊" : "🔈"}
        </button>
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="rounded-[20px] rounded-br-[4px] px-5 py-4 text-lg leading-relaxed max-w-[80%]" style={{ background: "#ffffff", color: "#1e1b3a", border: "1.5px solid rgba(139,127,217,0.2)" }}>
        {text}
      </div>
    </div>
  );
}

export function formatCurrency(amount: number) {
  return `₹${amount}`;
}

export function CartCard({ 
  cart, 
  total,
  onClose,
  onUpdateQuantity,
  onPlaceOrder
}: { 
  cart: CartItem[]; 
  total: number;
  onClose?: () => void;
  onUpdateQuantity?: (name: string, delta: number) => void;
  onPlaceOrder?: () => void;
}) {
  if (cart.length === 0) return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800">My Cart</h2>
        <div className="w-10"></div> 
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500 font-semibold p-6 text-center">
        Your cart is empty! Add items to proceed.
      </div>
    </div>
  );

  return (
    <section className="flex flex-col h-full bg-[#f4f6f9]">
      <div className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-800 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
          )}
          <h2 className="text-lg font-bold text-gray-800">My Cart</h2>
        </div>
        <button className="text-[#318616] text-sm font-bold flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Share
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4" style={{ scrollbarWidth: "none" }}>
        
        <div className="bg-white rounded-xl p-4 flex gap-4 shadow-sm border border-gray-100 items-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100 text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-[17px]">Delivery in 10 minutes</h3>
            <p className="text-sm text-gray-500 font-medium">Shipment of {cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl py-2 px-4 shadow-sm border border-gray-100">
          {cart.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex gap-4 py-4 border-b border-gray-50 last:border-0 items-center">
              <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg shrink-0 flex items-center justify-center p-1 overflow-hidden">
                {item.image ? (
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                ) : (
                   <span className="text-xl">🛍️</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-[15px] truncate">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                <p className="font-bold text-gray-800 text-[15px] mt-1">{formatCurrency(item.price)}</p>
              </div>
              
              {onUpdateQuantity && (
                <div className="flex items-center justify-between w-[76px] h-9 rounded-lg text-sm font-bold overflow-hidden shadow-sm shrink-0" style={{ backgroundColor: "#318616", color: "#ffffff" }}>
                  <button onClick={() => onUpdateQuantity(item.name, -1)} className="w-1/3 h-full flex items-center justify-center active:bg-green-800 transition-colors">-</button>
                  <span className="w-1/3 flex items-center justify-center bg-white text-[#318616] h-full text-xs">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.name, 1)} className="w-1/3 h-full flex items-center justify-center active:bg-green-800 transition-colors">+</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-bold text-gray-800 mb-2">Bill details</h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Items total</span>
            <span className="font-medium text-gray-800">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> Delivery charge</span>
            <span className="text-[#318616] font-bold">FREE <span className="line-through text-gray-400 font-normal ml-1">₹15</span></span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 border-b border-gray-50 pb-3">
            <span className="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Handling charge</span>
            <span className="font-medium text-gray-800">₹4</span>
          </div>
          <div className="flex justify-between text-[15px] font-bold text-gray-900 pt-1">
            <span>Grand total</span>
            <span>{formatCurrency(total + 4)}</span>
          </div>
        </div>
        
        <div className="h-20"></div>
      </div>

      {onPlaceOrder && (
        <div className="absolute bottom-0 w-full bg-white p-3 border-t border-gray-100 rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <button 
            onClick={onPlaceOrder}
            className="w-full py-3.5 rounded-xl text-white font-bold text-[17px] transition-transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-between px-5"
            style={{ background: "#318616" }}
          >
            <div className="flex flex-col items-start">
              <span className="leading-tight">{formatCurrency(total + 4)}</span>
              <span className="text-[10px] font-semibold text-green-100 uppercase tracking-wider">Total</span>
            </div>
            <div className="flex items-center gap-2">
              Login to Proceed
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </button>
        </div>
      )}
    </section>
  );
}

function OrderSummaryCard({ items, total, onConfirm, confirmed }: { items: CartItem[]; total: number; onConfirm: () => void; confirmed: boolean; }) {
  return (
    <div className="rounded-[20px] p-5 mt-2" style={{ background: "#ffffff", border: "1.5px solid rgba(139,127,217,0.2)" }}>
      <p className="text-base font-semibold mb-3" style={{ color: "#6b658f" }}>YOUR ORDER</p>
      <ul className="space-y-2 mb-4">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between items-baseline gap-4">
            <span className="text-lg" style={{ color: "#1e1b3a" }}>
              {item.name} <span className="text-base" style={{ color: "#6b658f" }}>({item.variant}, Qty {item.quantity})</span>
            </span>
            <span className="text-lg font-semibold shrink-0" style={{ color: "#1e1b3a" }}>₹{item.quantity * item.price}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center pt-3 mb-5" style={{ borderTop: "1px solid rgba(139,127,217,0.15)" }}>
        <span className="text-xl font-bold" style={{ color: "#1e1b3a" }}>Total</span>
        <span className="text-xl font-bold" style={{ color: "#8B7FD9" }}>₹{total}</span>
      </div>
      {confirmed ? (
        <div className="w-full rounded-2xl py-4 text-center text-lg font-bold" style={{ background: "#d4edda", color: "#2d6a4f" }}>
          ✓ Order Confirmed!
        </div>
      ) : (
        <button onClick={onConfirm} className="w-full rounded-2xl py-4 text-lg font-bold transition-opacity active:opacity-80" style={{ background: "#FFB88C", color: "#1e1b3a" }}>
          Yes, place my order
        </button>
      )}
    </div>
  );
}

function QuickReply({ label, onClick }: { label: string; onClick: (label: string) => void }) {
  return (
    <button onClick={() => onClick(label)} className="rounded-full px-5 py-3 text-base font-semibold transition-all active:scale-95" style={{ background: "#ffffff", border: "1.5px solid #8B7FD9", color: "#8B7FD9" }}>
      {label}
    </button>
  );
}

/* ─── Main component Interface ───────────────────────────────── */

interface ChatProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartTotal: number;
  setCartTotal: React.Dispatch<React.SetStateAction<number>>;
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatInterface({ cart, setCart, cartTotal, setCartTotal, cartOpen, setCartOpen }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");

  const [currentSummaryItems, setCurrentSummaryItems] = useState<CartItem[] | null>(null);
  const [summaryConfirmed, setSummaryConfirmed] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const isRecognitionActiveRef = useRef(false);
  const transcriptRef = useRef("");
  const isListeningRef = useRef(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);
  const audioAbortControllerRef = useRef<AbortController | null>(null);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, quickReplies]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const secure = window.isSecureContext || window.location.hostname === "localhost";
    setVoiceSupported(!!SpeechRecognitionCtor && secure);
  }, []);

  function stopCurrentAudio() {
    if (audioAbortControllerRef.current) {
      audioAbortControllerRef.current.abort();
      audioAbortControllerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  }

  async function playAudio(text: string, messageId?: number) {
    const trimmed = text?.trim();
    if (!trimmed) return;

    stopCurrentAudio();
    if (isListeningRef.current) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL is not configured.");
      return;
    }

    const controller = new AbortController();
    audioAbortControllerRef.current = controller;

    try {
      const res = await fetch(`${backendUrl}/api/audio/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok) {
        console.log("Audio generation failed:", res.status);
        return;
      }

      const blob = await res.blob();
      if (controller.signal.aborted) return; 

      const url = URL.createObjectURL(blob);
      currentObjectUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      const cleanupAndClear = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        if (currentObjectUrlRef.current === url) {
          URL.revokeObjectURL(url);
          currentObjectUrlRef.current = null;
        }
        if (audioRef.current === audio) audioRef.current = null;
      };

      audio.onended = cleanupAndClear;
      audio.onerror = cleanupAndClear;

      setIsSpeaking(true);
      setSpeakingMessageId(messageId ?? null);
      await audio.play();
    } catch (err: any) {
      if (err?.name !== "AbortError") console.error("Audio playback error:", err);
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    } finally {
      if (audioAbortControllerRef.current === controller) audioAbortControllerRef.current = null;
    }
  }

  useEffect(() => {
    const greetingTimer = window.setTimeout(() => {
      playAudio(GREETING.text, GREETING.id);
    }, 700);
    return () => window.clearTimeout(greetingTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        try { recognitionRef.current.stop(); } catch {}
        recognitionRef.current = null;
      }
      stopCurrentAudio();
    };
  }, []);

  function addMessage(role: Role, text: string) {
    const id = nextId();
    setMessages((prev) => [...prev, { id, role, text }]);
    return id;
  }

  async function advanceFlow(userText: string, confirmed = false) {
    const outgoingText = userText.trim();
    if (!outgoingText) return;

    const updatedMessages = [...messages, { id: nextId(), role: "user" as Role, text: outgoingText }];
    setMessages(updatedMessages);
    setInput("");
    setQuickReplies([]);

    if (isDone) return;

    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: updatedMessages.map((m) => ({ role: m.role, text: m.text })),
          userMessage: outgoingText,
          confirmed,
        }),
      });

      if (!res.ok) throw new Error(`Chat request failed with status ${res.status}`);
      let data: any = await res.json();
      if (!data || typeof data.chotuReply !== "string") throw new Error("Invalid response");

      setIsTyping(false);
      const chotuMsgId = addMessage("chotu", data.chotuReply);
      playAudio(data.chotuReply, chotuMsgId);

      setCart(Array.isArray(data.cart) ? data.cart : []);
      setCartTotal(typeof data.cartTotal === "number" ? data.cartTotal : 0);

      if (data.showSummary) {
        setCurrentSummaryItems(data.cart ?? []);
        setCartOpen(false);
      }
      if (Array.isArray(data.quickReplies)) setQuickReplies(data.quickReplies);
      if (data.done) setIsDone(true);

      if (data.orderPlaced) {
        setOrderPlaced(true);
        setSummaryConfirmed(true);
        setCurrentSummaryItems(null);
        setCart([]);
        setCartTotal(0);
        setCartOpen(false);
      }
    } catch (err) {
      console.error("Frontend fetch error:", err);
      setIsTyping(false);
      addMessage("chotu", "Sorry, something went wrong. Could you try again?");
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;
    advanceFlow(text);
  }

  function handleQuickReply(label: string) {
    if (isTyping) return;
    advanceFlow(label);
  }

  function handleConfirmOrder() { advanceFlow("Yes, place my order", true); }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function startListening() {
    if (isRecognitionActiveRef.current) return; 
    if (isSpeaking) return; 

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      addMessage("chotu", "Voice input isn't supported in this browser yet.");
      return;
    }

    stopCurrentAudio();
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      transcriptRef.current = transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      isRecognitionActiveRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
      const finalTranscript = transcriptRef.current.trim();
      transcriptRef.current = "";
      if (finalTranscript) advanceFlow(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      isRecognitionActiveRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        addMessage("chotu", "I need microphone access to hear you — please allow it in your browser settings!");
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      isRecognitionActiveRef.current = true;
      setIsListening(true);
    } catch (err) {
      isRecognitionActiveRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
    }
  }

  function stopListening() { recognitionRef.current?.stop(); }

  return (
    <div className="flex flex-col h-full w-full mx-auto" style={{ background: "#FAFAFC" }}>
      
      <header className="shrink-0 px-6 py-5" style={{ background: "#ffffff", borderBottom: "1px solid rgba(139,127,217,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0" style={{ background: "#EDEBFA", color: "#8B7FD9" }}>च</div>
          <div>
            <h1 className="text-xl font-extrabold leading-none" style={{ color: "#1e1b3a" }}>Chotu</h1>
            <p className="text-sm mt-0.5" style={{ color: "#6b658f" }}>
              {isSpeaking ? "Speaking…" : "Your shopping helper"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#6bcb77" }} />
            <span className="text-sm font-semibold" style={{ color: "#6b658f" }}>Online</span>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4" style={{ scrollbarWidth: "none" }}>
        {messages.map((msg, idx) => {
          const isLastChotu = msg.role === "chotu" && idx === messages.length - 1;
          const showCard = isLastChotu && currentSummaryItems;
          return (
            <div key={msg.id}>
              {msg.role === "chotu" ? (
                <ChotuBubble text={msg.text} onReplay={() => playAudio(msg.text, msg.id)} isSpeakingThis={speakingMessageId === msg.id} />
              ) : (
                <UserBubble text={msg.text} />
              )}
              {showCard && (
                <div className="ml-5 mt-3">
                  <OrderSummaryCard items={currentSummaryItems!} total={cartTotal} onConfirm={handleConfirmOrder} confirmed={summaryConfirmed} />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: "#8B7FD9" }} aria-hidden />
            <div className="rounded-[20px] rounded-bl-[4px] px-5 py-4 flex gap-1.5 items-center" style={{ background: "#EDEBFA" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#8B7FD9", opacity: 0.5, animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {quickReplies.length > 0 && !isTyping && (
        <div className="shrink-0 px-4 pb-3 flex flex-wrap gap-2">
          {quickReplies.map((label) => <QuickReply key={label} label={label} onClick={handleQuickReply} />)}
        </div>
      )}

      {isDone ? (
        <div className="shrink-0 mx-4 mb-6 rounded-2xl px-5 py-4 text-center text-base font-semibold" style={{ background: "#EDEBFA", color: "#6b658f" }}>
          {orderPlaced ? "🎉 Your order is on its way! Come back anytime to order again." : "👋 Thanks for visiting Chotu! Come back anytime if you need groceries."}
        </div>
      ) : (
        <div className="shrink-0 px-4 pb-6 pt-2" style={{ background: "#FAFAFC" }}>
          <div className="flex items-end gap-3 rounded-[20px] px-4 py-3" style={{ background: "#ffffff", border: "1.5px solid rgba(139,127,217,0.25)", boxShadow: "0 2px 12px rgba(139,127,217,0.08)" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening… speak now" : "Tell me what you need…"}
              rows={1}
              disabled={isTyping || isListening}
              className="flex-1 resize-none bg-transparent outline-none text-lg leading-relaxed"
              style={{ color: "#1e1b3a", maxHeight: "120px", overflowY: "auto", scrollbarWidth: "none" }}
            />

            {voiceSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isTyping || isSpeaking}
                className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-opacity disabled:opacity-30 active:scale-95"
                style={{ background: isListening ? "#FFB88C" : "#EDEBFA", color: isListening ? "#ffffff" : "#8B7FD9" }}
              >
                {isListening ? "●" : "🎙"}
              </button>
            )}

            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping || isListening}
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-opacity disabled:opacity-30 active:scale-95"
              style={{ background: "#8B7FD9", color: "#ffffff" }}
            >↑</button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-5px); opacity: 1; } } textarea::placeholder { color: #a09cc0; }`}</style>
    </div>
  );
}