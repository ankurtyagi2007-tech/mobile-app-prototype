import { createContext, useContext, useState, useCallback } from 'react';
import userData from '../data/user';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(userData);
  const [pollVotes, setPollVotes] = useState({});
  const [redemptions, setRedemptions] = useState({});

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const votePoll = useCallback((messageId, optionIndex) => {
    setPollVotes((prev) => ({ ...prev, [messageId]: optionIndex }));
  }, []);

  const redeemMerch = useCallback((merchId) => {
    setRedemptions((prev) => ({ ...prev, [merchId]: true }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        logout,
        pollVotes,
        votePoll,
        redemptions,
        redeemMerch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
