import { pool } from "../../database/db";
import bycrypt from 'bcryptjs';

const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  if (!result) {
    console.error('Failed to fetch users:', result);
    return { success: false, message: 'Failed to fetch users', error: 'Something went wrong' };
  }
  return result.rows;
}


const updateUser = async (id: number, payload: Record<string, unknown>) => {
  const currentResult = await pool.query(
    `SELECT * FROM users WHERE id = $1`, [id]
  );

  if (currentResult.rows.length === 0) {
    return { success: false, message: `User with ID ${id} not found`, error: 'Not found' };
  }
  const current = currentResult.rows[0];
  const simpleFields = ['name', 'email', 'password', 'phone', 'role'];

  if (typeof payload['role'] === 'string' && payload['role'] === 'admin' && current.role === 'customer') {
    return { success: false, message: 'Customer cannot change role', error: 'Role must be admin' };
  }

  let hashedPassword: string | undefined;
  if ('password' in payload) {
    if (typeof payload['password'] === 'string' && payload['password'].length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long', error: 'Invalid password' };
    }
    if (typeof payload['password'] === 'string') {
      hashedPassword = await bycrypt.hash(payload['password'], 12);
      payload['password'] = hashedPassword;
    }
  }

  const fieldsToUpdate: string[] = simpleFields.filter(field =>
    field in payload && payload[field] !== current[field]
  );
  

  if (fieldsToUpdate.length === 0) {
    return { success: false, message: 'No changes detected', error: 'Payload values are identical to current record' };
  }

  const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);
  const values = [...fieldsToUpdate.map(field => payload[field]), id];

  const result = await pool.query(
    `UPDATE users
     SET ${setClauses.join(', ')}
     WHERE id = $${fieldsToUpdate.length + 1}
     RETURNING *`,
    values
  );

  if (!result || result.rows.length === 0) {
    console.error(`Failed to update vehicle with ID ${id}:`, result);
    return { success: false, message: `Update failed for vehicle ID ${id}`, error: 'Something went wrong' };
  }

  return result.rows[0];
};

const deleteUser = async (id: number) => {
  const isBooked = await pool.query("SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'", [id]);
  if (isBooked.rows.length !== 0) {
    return { success: false, message: `User with ID ${id} has active bookings and cannot be deleted`, error: 'User has active bookings' };
  }
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  if (!result || result.rows.length === 0) {
    console.error(`Failed to delete vehicle with ID ${id}:`, result);
    return { success: false, message: `Vehicle with ID ${id} not found or deletion failed`, error: 'Something went wrong' };
  }
  return result.rows[0];
}

export const usersService = {
  getAllUsers, updateUser, deleteUser
};