"use client";

import { useState } from "react";
import ChatInterface, { CartCard, CartItem } from "./components/ChatInterface"; 

const DUMMY_PRODUCTS = [
  { id: 1, name: "Amul Full Cream Milk", unit: "1 litre", price: 66, time: "8 MINS", image: "/amul.jpg" },
  { id: 9, name: "Mother Dairy Full Cream", unit: "1 litre", price: 66, time: "8 MINS", image: "/mother dairy.jpg" },
  { id: 10, name: "Sanchi Gold Milk", unit: "1 litre", price: 64, time: "8 MINS", image: "/Sanchi Milk.jpg" },
  { id: 2, name: "Tata Sugar", unit: "1 kg", price: 45, time: "8 MINS", image: "/tata sugar.jpg" },
  { id: 3, name: "Aashirvaad Atta", unit: "5 kg", price: 220, time: "12 MINS", image: "/Aashirvaad ATTA.jpg" },
  { id: 4, name: "Maggi Noodles", unit: "Pack of 4", price: 60, time: "9 MINS", image: "/images (3).jpg" },
  { id: 5, name: "Brown Bread", unit: "1 loaf", price: 35, time: "8 MINS", image: "/brown bread.jpg" },
  { id: 6, name: "Red Onions", unit: "1 kg", price: 35, time: "10 MINS", image: "/red onion.jpg" },
  { id: 7, name: "Fresh Eggs", unit: "12 pieces", price: 84, time: "8 MINS", image: "/fresh egg.jpg" },
  { id: 8, name: "Fortune Sunflower Oil", unit: "1 litre", price: 140, time: "10 MINS", image: "/fortune oil.jpg" },
];

const CATEGORIES = [
  "Bestsellers", "Snacks & Munchies", "Beverages", "Dairy & Bakery", 
  "Fruits & Vegetables", "Personal Care", "Cleaning Essentials", "Home Care"
];

export default function Home() {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAdd = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id: number) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      if (newQuantities[id] > 1) {
        newQuantities[id] -= 1;
      } else {
        delete newQuantities[id];
      }
      return newQuantities;
    });
  };

  const stagedItemCount = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
  const stagedTotalPrice = Object.entries(quantities).reduce((acc, [id, qty]) => {
    const product = DUMMY_PRODUCTS.find(p => p.id === parseInt(id));
    return acc + (product ? product.price * qty : 0);
  }, 0);

  const handleCommitToCart = () => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      
      Object.entries(quantities).forEach(([idStr, qty]) => {
        if (qty > 0) {
          const product = DUMMY_PRODUCTS.find(p => p.id === parseInt(idStr));
          if (product) {
            const existingIndex = updatedCart.findIndex(item => item.name === product.name);
            if (existingIndex >= 0) {
              updatedCart[existingIndex].quantity += qty;
            } else {
              updatedCart.push({ 
                name: product.name, 
                variant: product.unit, 
                quantity: qty, 
                price: product.price,
                image: product.image 
              });
            }
          }
        }
      });
      return updatedCart;
    });

    setCartTotal((prev) => prev + stagedTotalPrice);
    setQuantities({}); 
    setCartOpen(true);
  };

  const handleUpdateCartItemQuantity = (itemName: string, delta: number) => {
    setCart((prevCart) => {
      let updatedTotal = cartTotal;
      const updated = prevCart.map(item => {
        if (item.name === itemName) {
          const newQty = item.quantity + delta;
          if (newQty === 0) return null;
          updatedTotal += delta * item.price;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[]; 
      
      const newTotal = updated.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setCartTotal(newTotal);
      return updated;
    });
  };

  const handlePlaceOrder = () => {
    alert("🎉 Order placed successfully! Chotu will deliver it in 10 minutes.");
    setCart([]);
    setCartTotal(0);
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative overflow-x-hidden">
      
      <header className="sticky top-0 z-[60] shadow-md border-b" style={{ background: "#172338" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-col shrink-0 w-full md:w-auto text-white">
            <span className="text-xl font-black tracking-wide">Delivery in 10 mins</span>
            <span className="text-sm text-gray-300">Home - Gwalior, Madhya Pradesh</span>
          </div>

          <div className="w-full md:flex-1 max-w-xl bg-white rounded-xl flex items-center px-4 py-2.5 shadow-inner">
            <svg className="w-5 h-5 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search for 'Milk', 'Bread', 'Maggi'..." 
              className="w-full bg-transparent text-gray-800 outline-none text-sm placeholder-gray-400" 
            />
          </div>

          <div className="flex items-center gap-6 shrink-0 self-end md:self-auto">
            <button className="text-white hover:text-gray-300 font-semibold text-lg transition-colors">
              Login
            </button>
            
            <button 
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 border"
              style={{ 
                background: cart.length > 0 ? "#318616" : "rgba(255,255,255,0.1)",
                borderColor: cart.length > 0 ? "#318616" : "rgba(255,255,255,0.2)",
                color: "white" 
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="font-bold text-sm hidden md:block">My Cart</span>
              {cart.length > 0 && (
                <div className="bg-white text-[#318616] px-1.5 py-0.5 rounded text-xs font-bold ml-1">
                  {cart.length}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <div className="mb-8">
          <div className="flex overflow-x-auto gap-3 py-2" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat, index) => (
              <button 
                key={index} 
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors
                  ${index === 0 
                    ? 'bg-[#e5f0ea] text-[#318616] border-[#318616]' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {DUMMY_PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="self-start text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 mb-2 flex items-center gap-1 z-10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {product.time}
              </div>
              <div className="w-full h-28 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl mix-blend-multiply" />
              </div>
              <h3 className="font-semibold text-sm leading-tight text-gray-800 line-clamp-2 mb-1 h-8">{product.name}</h3>
              <span className="text-xs text-gray-500 mb-3">{product.unit}</span>
              <div className="mt-auto flex items-center justify-between h-9">
                <span className="font-bold text-sm">&#8377;{product.price}</span>
                {quantities[product.id] ? (
                  <div className="flex items-center justify-between w-[72px] h-full rounded-lg text-sm font-bold overflow-hidden shadow-sm" style={{ backgroundColor: "#318616", color: "#ffffff" }}>
                    <button onClick={() => handleRemove(product.id)} className="w-1/3 h-full flex items-center justify-center active:bg-green-800 transition-colors">-</button>
                    <span className="w-1/3 flex items-center justify-center bg-white text-[#318616] h-full">{quantities[product.id]}</span>
                    <button onClick={() => handleAdd(product.id)} className="w-1/3 h-full flex items-center justify-center active:bg-green-800 transition-colors">+</button>
                  </div>
                ) : (
                  <button onClick={() => handleAdd(product.id)} className="px-6 py-1.5 h-full rounded-lg border text-sm font-bold transition-colors active:scale-95 uppercase shadow-sm" style={{ borderColor: "#318616", color: "#318616", backgroundColor: "#f3fcf4" }}>ADD</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" 
            onClick={() => setCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#f4f6f9] h-full shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
            <CartCard 
              cart={cart} 
              total={cartTotal} 
              onClose={() => setCartOpen(false)}
              onUpdateQuantity={handleUpdateCartItemQuantity}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      )}

      {stagedItemCount > 0 && !isChatOpen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-11/12 md:w-auto md:min-w-[340px] rounded-[16px] shadow-2xl flex items-center justify-between px-5 py-3 cursor-pointer transition-transform hover:-translate-y-1 active:scale-95" 
             style={{ backgroundColor: "#318616", color: "white" }}
             onClick={handleCommitToCart}>
          <div className="flex flex-col">
            <span className="font-bold text-sm">{stagedItemCount} item{stagedItemCount > 1 ? 's' : ''}</span>
            <span className="text-xs font-semibold opacity-90">&#8377;{stagedTotalPrice}</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-sm">
            Add to Cart
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
        </div>
      )}

      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-4 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl md:text-3xl font-black transition-transform hover:scale-105 active:scale-95 border-4 border-white"
          style={{ background: "#8B7FD9", color: "white" }}
          aria-label="Open Chotu Assistant"
        >
          च
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-24 right-4 md:right-8 z-50 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 flex flex-col bg-white w-[360px] h-[600px] max-h-[75vh]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
            <span className="font-bold text-gray-800 text-lg">Chat with Chotu</span>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors text-xl font-bold">✕</button>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <ChatInterface 
              cart={cart} setCart={setCart} 
              cartTotal={cartTotal} setCartTotal={setCartTotal} 
              cartOpen={cartOpen} setCartOpen={setCartOpen} 
            /> 
          </div>
        </div>
      )}

    </div>
  );
}