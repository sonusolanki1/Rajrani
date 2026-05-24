import React from 'react';

const PromoBanner = () => {
  return (
    <div className="bg-black text-white overflow-hidden py-3 relative z-60">
      <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center mx-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              FREE SHIPPING ON ORDERS OVER ₹1999
            </span>
            <div className="w-1 h-1 bg-white rounded-full mx-10" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              SHOP NOW PAY LATER WITH WHATSAPP
            </span>
            <div className="w-1 h-1 bg-white rounded-full mx-10" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              NEW SEASON ARRIVALS JUST LANDED
            </span>
            <div className="w-1 h-1 bg-white rounded-full mx-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;