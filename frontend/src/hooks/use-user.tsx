import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
  useCallback,
} from "react";

interface UserContextValue {
  displayName: string | null;
  setDisplayName: (name: string) => void;
  isInitialized: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [displayName, setDisplayNameState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("displayName");
    if (stored) {
      setDisplayNameState(stored);
    }
    setIsInitialized(true);
  }, []);

  const setDisplayName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem("displayName", trimmed);
      setDisplayNameState(trimmed);
    }
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      displayName,
      setDisplayName,
      isInitialized,
    }),
    [displayName, setDisplayName, isInitialized]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
