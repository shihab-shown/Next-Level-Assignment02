import express, { Request, Response } from 'express'
import config from './config'
import { initDatabase } from './database/db'
import { userRoute } from './modules/user/user.route'

const app = express()
const port = config.port
app.use(express.json()) // Middleware to parse JSON bodies

initDatabase();

app.use('/api/v1/auth', userRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Typescript!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})