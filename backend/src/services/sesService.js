export const singleExponentialSmoothing = (data, alpha) => {
  let forecast = data[0];
  const results = [];

  for (let i = 1; i < data.length; i++) {
    const actual = data[i];
    forecast = alpha * data[i - 1] + (1 - alpha) * forecast;

    const error = actual - forecast;

    results.push({
      actual,
      forecast,
      error,
      abs_error: Math.abs(error),
      sq_error: error ** 2,
    });
  }

  return results;
};
