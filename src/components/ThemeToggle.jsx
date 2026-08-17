import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
          darkMode ? "translate-x-7" : ""
        }`}
      />

      <div className="flex justify-between items-center h-full px-2 text-xs">
        <FaSun className="text-yellow-500" />
        <FaMoon className="text-white" />
      </div>
    </button>
  );
}
