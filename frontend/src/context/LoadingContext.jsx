import { createContext, useState, useEffect, useContext } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    window.addEventListener("loading:start", start);
    window.addEventListener("loading:end", end);

    return () => {
      window.removeEventListener("loading:start", start);
      window.removeEventListener("loading:end", end);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
