import { pool } from "../../database/db";
import bycrypt from 'bcryptjs';

const signupUser = async (Payload: Record<string,unknown>) => {
  const { name, email, password, phone, role } = Payload;

  // Encrypt the password using bcrypt
  const hashedPassword = await bycrypt.hash(password as string, 12);
  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return { error: 'Email already in use' }
    }

    // Insert new user into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hashedPassword, phone, role]
    );
    return result
  } catch (err) {
    console.error('Error registering user:', err);
    throw new Error('Internal server error');
  }
}

export const userService = {
  signupUser
}