import { pool } from "../../database/db";
import { User } from "../../types";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const rentStartDate = new Date(rent_start_date as string);
  const rentEndDate = new Date(rent_end_date as string);
  if (rentEndDate.getTime() <= rentStartDate.getTime()) {
    return { success: false, message: 'Invalid date range: rent_end_date must be after rent_start_date', error: 'Invalid input' };
  }

  const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [customer_id]);
  if (userResult.rows.length === 0) {
    return { success: false, message: `User with ID ${customer_id} not found`, error: 'Not found' };
  }
  const vehicleResult = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicle_id]);
  if (vehicleResult.rows.length === 0) {
    return { success: false, message: `Vehicle with ID ${vehicle_id} not found`, error: 'Not found' };
  }
  if (vehicleResult.rows[0].availability_status !== 'available') {
    return { success: false, message: `Vehicle with ID ${vehicle_id} is not available for booking`, error: 'Unavailable' };
  }
  const dailyRentPrice = parseFloat(vehicleResult.rows[0].daily_rent_price);
  const rentalDays = Math.ceil((rentEndDate.getTime() - rentStartDate.getTime()) / (1000 * 3600 * 24));
  const totalPrice = dailyRentPrice * rentalDays;
  const result = await pool.query(`
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]);

  const updateVehicleResult = await pool.query(`
    UPDATE vehicles SET availability_status = 'booked' WHERE id = $1 RETURNING *`, [vehicle_id]
  );
  const result1 = { ...result.rows[0], vehicle: { "vehicle_name": updateVehicleResult.rows[0].vehicle_name, "daily_rent_price": updateVehicleResult.rows[0].daily_rent_price } };

  if (!result1 || result.rows.length === 0) {
    console.error('Failed to create booking:', result);
    return { success: false, message: 'Booking creation failed', error: 'Something went wrong' };
  }
  return result1;
}

const getAllBookings = async (user: User) => {
  const baseQuery = `
    SELECT 
      b.*, c.name, c.email, v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users c ON c.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id
  `;
  let result;
  if (user.role === 'admin') {
    result = await pool.query(baseQuery);
  } else if (user.role === 'customer') {
    result = await pool.query(`${baseQuery} WHERE b.customer_id = $1`, [user.id]);
  }

  if (!result || result.rows.length === 0) {
    return { success: false, message: 'Failed to fetch bookings', error: 'Something went wrong' };
  }

  const data = result.rows.map(row => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));
  return data;
};

const updateBooking = async (request: object, payload: Record<string, unknown>) => {
  const { user, Id } = request as { user?: User, Id: number };
  const role = user?.role;
  const { status } = payload;

  const allowedStatuses = ['active', 'cancelled', 'returned'];
  if (!status || !allowedStatuses.includes(status as string)) {
    return { success: false, message: 'Invalid status value', error: `Status must be one of: ${allowedStatuses.join(', ')}` };
  }

  let baseQuery = '';
  let queryParams: any[] = [status, Id];

  if (role === 'customer') {
    baseQuery = `
      UPDATE bookings
      SET status = $1
      WHERE id = $2 AND customer_id = $3 AND rent_start_date > CURRENT_DATE
      RETURNING *;
    `;
    queryParams.push(user?.id);
  } else if (role === 'admin') {
    baseQuery = `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
  } else {
    return { success: false, message: 'Unauthorized', error: 'Unknown role' };
  }
  const result = await pool.query(baseQuery, queryParams);

  if (!result || result.rows.length === 0) {
    return { success: false, message: `Update failed for booking ID ${Id}`, error: 'No booking found or date condition not met' };
  }

  let newAvailabilityStatus = 'available';
  if (status === 'active') {
    newAvailabilityStatus = 'booked';
  }

  const vehicleUpdateResult = await pool.query(`
    UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING *`, [newAvailabilityStatus, result.rows[0].vehicle_id]);
  const result1 = { ...result.rows[0], vehicle: { "availability_status" : vehicleUpdateResult.rows[0].availability_status } };
  
  if (status === 'active' && new Date(result.rows[0].rent_end_date).getTime() < Date.now()) {
    await pool.query(`
      UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`, [Id]
    );
    await pool.query(`
      UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING *`, [result.rows[0].vehicle_id]
    );
  }

  if (role === 'customer') {
    return result.rows[0];
  } else if (role === 'admin') {
    return result1;
  }
};

export const bookingService = {
  createBooking, getAllBookings, updateBooking
}