
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="px-6 py-4 bg-white border-b border-slate-100 flex flex-col gap-0.5 sticky top-0 z-30">
      <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2 tracking-tight">
        <i className="fa-solid fa-hand-holding-medical"></i>
        WhiteCoatOnly
      </h1>
      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
        Scroll with purpose
      </p>
    </header>
  );
};

export default Header;
