import { defineEventHandler, getQuery } from "h3";
import { query } from "../db";

export default defineEventHandler(async (event) => {
  const { period = "30", start, end } = getQuery(event);

  let where = "";

  if (period !== "custom") {
    where = `created_at >= NOW() - INTERVAL '${period} days'`;
  } else if (start && end) {
    where = `created_at BETWEEN '${start}' AND '${end}'`;
  } else {
    where = `created_at >= NOW() - INTERVAL '30 days'`;
  }

  const sql = `
    SELECT
      COALESCE(SUM(total_amount),0) AS revenue,
      COUNT(id) AS total_orders,
      COALESCE(ROUND(AVG(total_amount),2),0) AS avg_ticket
    FROM sales
    WHERE sale_status_desc = 'COMPLETED' AND ${where}
  `;

  const result = await query(sql);
  return result[0];
});
