export const aggregateMonthly = async (pool) => {
  await pool.query(`
    INSERT INTO sales_period_agg
    (product_id, period, period_start_date, period_end_date, qty_units, computed_at)
    SELECT
      product_id,
      'MONTH',
      DATE_FORMAT(sales_date, '%Y-%m-01'),
      LAST_DAY(sales_date),
      SUM(qty_units),
      NOW()
    FROM sales_daily
    GROUP BY product_id, YEAR(sales_date), MONTH(sales_date)
  `);
};
