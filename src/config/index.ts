import Path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: Path.resolve(__dirname, '../../.env') })
const config = {
  port : process.env.PORT || 5000,
  connectionString : process.env.CONNECTION_STRING || 'postgresql://postgres:password@localhost:5432/postgres'
}

export default config