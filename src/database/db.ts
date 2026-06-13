import {Pool} from 'pg'
import config from '../config'

export const pool = new Pool({
  connectionString: config.connectionString
});

export const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(10) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer'))
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(255) NOT NULL,
        type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) NOT NULL UNIQUE,
        daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(10) NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked'))
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date VARCHAR(20) NOT NULL,
        rent_end_date VARCHAR(20) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
        status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
        CONSTRAINT valid_date_range CHECK (rent_end_date > rent_start_date)
      );
    `);
    
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err; 
  }
}