import express, { Request, Response } from 'express'
import config from './config'
import { initDatabase } from './database/db'
import { authRoute } from './modules/auth/auth.route'
import { vehicleRoute } from './modules/vehicles/vehicle.route'
import { usersRoute } from './modules/user/user.route'
import { bookingRoute } from './modules/bookings/booking.route'
export const app = express()
const port = config.port
app.use(express.json())
initDatabase();
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/vehicles', vehicleRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/bookings', bookingRoute);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Typescript!')
})
export const server = !process.env.VERCEL
  ? app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  : null;

export default app;