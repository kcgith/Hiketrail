let authHandler = null;

export const setAuthHandler = (handler) => {
  authHandler = handler;
};

export const triggerAuth = () => {
  if (authHandler) authHandler();
};
