export const extractToken = (header: string) => {
  const [strategy, token] = header.split(' ');
  if (strategy !== 'Basic') return null;

  return token;
};
