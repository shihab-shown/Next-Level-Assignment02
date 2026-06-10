import { pool } from "../../database/db";
import bycrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import config from "../../config";

const secret = config.jwt_secret;
const signupUser = async (Payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = Payload;

  if(password && typeof password === 'string' && password.length <= 6) {
    return { error: 'Password must be at least 6 characters long' }
  }
  const hashedPassword = await bycrypt.hash(password as string, 12);
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return { error: 'Email already in use' }
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hashedPassword, phone, role]
    );
    const jwtPayload = {
      id: result.rows[0].id,
      name: name,
      email: email,
      role: role,
    };
    const token = jwt.sign(jwtPayload, secret, { expiresIn: "7d" });
    return { user: result.rows[0], token };
  } catch (err) {
    console.error('Error registering user:', err);
    throw new Error('Internal server error');
  }
}

const signinUser = async (Payload: Record<string, unknown>) => {
  const { email, password } = Payload;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return { error: 'Invalid email' }
    }

    const user = result.rows[0];
    const isPasswordValid = await bycrypt.compare(password as string, user.password);
    if (!isPasswordValid) {
      return { error: 'Invalid password' }
    }

    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(jwtPayload, secret, { expiresIn: "7d" });
    return { token, user };
  } catch (err) {
    console.error('Error signing in user:', err);
    throw new Error('Internal server error');
  }
}

export const authService = {
  signupUser, signinUser
}