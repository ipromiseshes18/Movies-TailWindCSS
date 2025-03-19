// components/Movies/components/ThemeSwitcher.jsx
import React from "react";

export const ThemeSwitcher = ({ theme, toggleTheme }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm">{theme === "Light" ? "☀️" : "🌙"}</span>
    <label className="theme-switch relative inline-block w-12 h-6">
      <input
        type="checkbox"
        checked={theme === "Dark"}
        onChange={toggleTheme}
        className="opacity-0 w-0 h-0"
      />
      <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition-all rounded-full before:absolute before:content-[''] before:h-5 before:w-5 before:left-1 before:bottom-0.5 before:bg-white before:transition-all before:rounded-full before:transform before:translate-y-[-50%] dark:before:translate-x-6"></span>
    </label>
    <p>Current Theme: {theme}</p>
  </div>
);
