import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { translations, Translations } from "./translations";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("ar"); // Default to Arabic
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setLanguage = useCallback((lang: Language) => {
    // Show loading overlay
    setIsLoading(true);

    // Phase 1: Fade out animation (0-300ms)
    document.body.classList.add("language-switching");
    document.body.classList.remove("language-switched");

    // Phase 2: Update language at midpoint when content is hidden (250ms)
    setTimeout(() => {
      setLanguageState(lang);
      // Update document direction and language
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
      // Store preference in localStorage
      localStorage.setItem("appLanguage", lang);
    }, 250);

    // Phase 3: Switch to fade in animation (300ms)
    setTimeout(() => {
      document.body.classList.remove("language-switching");
      document.body.classList.add("language-switched");
    }, 300);

    // Phase 4: Clean up and hide loading (600ms)
    setTimeout(() => {
      document.body.classList.remove("language-switched");
      setIsLoading(false);
    }, 600);
  }, []);

  // Initialize language from localStorage or default to Arabic
  React.useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage") as Language;
    if (savedLang && (savedLang === "ar" || savedLang === "en")) {
      setLanguage(savedLang);
    } else {
      // Set Arabic as default
      setLanguage("ar");
    }
  }, [setLanguage]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === "ar",
  };

  return (
    <LanguageContext.Provider value={value}>
      {isLoading && (
        <div className="language-loading-overlay">
          <div className="language-loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
