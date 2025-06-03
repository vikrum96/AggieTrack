import React, { useState } from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 font-sans">
      {/* AggieTrack */}
      <div className="pl-10 text-4xl">
        <h1 className="text-[#500000] font-[750]">Aggie Track</h1>
      </div>

      {/* Favorites and Dark Mode */}
      <div className="pr-5 flex items-center space-x-8">
        <a href="#">Favorites</a>
        <button className="bg-black hover:opacity-80 active:opacity-50 text-white rounded-md p-1 px-4 cursor-pointer">Dark Mode</button>
      </div>
    </header>
  );
}

export default Header;