import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";

const ThemeContext = createContext(null);

const mockUser = {
  name: "Kesab Agarwal",
  email: "kesab@shopease.in",
  avatar: "KA",
  tier: "Gold Member",
  joinDate: "Jan 2023",
  totalOrders: 24,
  savedAmount: 18400,
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("INR");
  const [user] = useState(mockUser);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  }, []);

  // Apply theme class directly to <body> so ALL pages are affected
  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("theme-dark");
      body.classList.remove("theme-light");
    } else {
      body.classList.add("theme-light");
      body.classList.remove("theme-dark");
    }
  }, [theme]);

  const themeValues = useMemo(
    () => ({
      isDark: theme === "dark",
      bodyClass: theme === "dark" ? "theme-dark" : "theme-light",
      currencySymbol: currency === "INR" ? "₹" : "$",
    }),
    [theme, currency]
  );

  const value = {
    theme,
    toggleTheme,
    currency,
    setCurrency,
    user,
    ...themeValues,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};