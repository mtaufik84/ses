export const calculateProduction = (forecast, buffer, stock) => {
  const result = forecast + buffer - stock;
  return result < 0 ? 0 : Math.round(result);
};
