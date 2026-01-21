import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Cargando...');
  const [startTime, setStartTime] = useState(null);

  const showLoading = (msg = 'Cargando...') => {
    setMessage(msg);
    setLoading(true);
    setStartTime(Date.now());
  };

  const hideLoading = () => {
    setLoading(false);
    setMessage('Cargando...');
    setStartTime(null);
  };

  return (
    <LoadingContext.Provider value={{ loading, message, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe ser usado dentro de LoadingProvider');
  }
  return context;
};
