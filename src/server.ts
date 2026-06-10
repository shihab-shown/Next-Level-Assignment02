import express, { Request, Response } from 'express'
import config from './config'
import { initDatabase } from './database/db'
import { authRoute } from './modules/auth/auth.route'
import { vehicleRoute } from './modules/vehicles/vehicle.route'
import { usersRoute } from './modules/user/user.route'


const app = express()
const port = config.port
app.use(express.json()) // Middleware to parse JSON bodies

initDatabase();

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/vehicles', vehicleRoute);
app.use('/api/v1/users', usersRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Typescript!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})