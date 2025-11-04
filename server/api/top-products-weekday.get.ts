import { defineEventHandler, getQuery } from "h3";
import { query } from "../db";

export default defineEventHandler(async (event) => {
  const { period = 30, channel, weekday } = getQuery(event);

  let where = `s.created_at >= NOW() - INTERVAL '${period} days' AND s.sale_status_desc = 'COMPLETED'`;

  if (channel) {
    // Pode ser string ou array
    const channels = Array.isArray(channel) ? channel : [channel];
    const channelList = channels.map((c) => `'${c}'`).join(",");
    where += ` AND c.name IN (${channelList})`;
  }

  if (weekday) {
    // weekday = 0 (Sunday) .. 6 (Saturday)
    const days = Array.isArray(weekday) ? weekday : [weekday];
    const dayList = days.map((d) => Number(d)).join(",");
    where += ` AND EXTRACT(DOW FROM s.created_at) IN (${dayList})`;
  }

  const sql = `
    SELECT
      p.name AS product_name,
      EXTRACT(DOW FROM s.created_at) AS weekday,
      COUNT(ps.id) AS total_sales,
      SUM(ps.total_price) AS revenue
    FROM product_sales ps
    JOIN products p ON ps.product_id = p.id
    JOIN sales s ON ps.sale_id = s.id
    JOIN channels c ON s.channel_id = c.id
    WHERE ${where}
    GROUP BY p.name, weekday
    ORDER BY total_sales DESC
    LIMIT 10
  `;

  try {
    const data = await query(sql);
    return data;
  } catch (error) {
    console.error("Erro na API top-products-weekday:", error);
    throw new Error("Erro ao buscar produtos mais vendidos por dia");
  }
});
