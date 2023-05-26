const getError = (value: any): string => {
  let message: string;
  if (value instanceof Error) message = value.message;
  message = String(message);
  return message;
};

export { getError };
