// Esse arquivo centraliza a conexão com o PostgreSQL não precisa reabrir conexão toda hora — só chama a função query.
// Importa o Pool da biblioteca do PostgreSQL para Node (pg).
import { Pool } from 'pg'

// Cria o pool de conexao
const pool = new Pool({
  // Usa a variável de ambiente que esta em .env
  connectionString: process.env.DATABASE_URL,
})

// Função query
export async function query(text: string, params?: any[]) {
  // Pega uma conexão disponível no pool
  const client = await pool.connect()

  try {
    // Executa a query SQL com parâmetros
    const res = await client.query(text, params)
    // Retorna só as linhas resultantes (formato JS)
    return res.rows

  } finally {
    
    // Libera a conexão de volta pro pool
    client.release()
  }
}
