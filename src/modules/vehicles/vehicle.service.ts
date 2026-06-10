import { pool } from "../../database/db";

const createVehicle = async (Payload: Record<string, unknown>) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = Payload;
  const result = await pool.query(`
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

  if (!result || result.rows.length === 0) {
    console.error('Failed to create vehicle:', result);
    return { success: false, message: 'Vehicle creation failed', error: 'Something went wrong' };
  }
  return result.rows[0];
}

const getAllVehicles = async () => {
  const result = await pool.query('SELECT * FROM vehicles');
  if (!result) {
    console.error('Failed to fetch vehicles:', result);
    return { success: false, message: 'Failed to fetch vehicles', error: 'Something went wrong' };
  }
  return result.rows;
}

const getVehiclebyID = async (id: number) => {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (!result || result.rows.length === 0) {
    console.error(`Failed to fetch vehicle with ID ${id}:`, result);
    return { success: false, message: `Vehicle with ID ${id} not found`, error: 'Something went wrong' };
  }
  return result.rows[0];
}

const updateVehicle = async (id: number, payload: Record<string, unknown>) => {
  const currentResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`, [id]
  );

  if (currentResult.rows.length === 0) {
    return { success: false, message: `Vehicle with ID ${id} not found`, error: 'Not found' };
  }
  const current = currentResult.rows[0];
  const simpleFields = ['vehicle_name', 'type', 'daily_rent_price', 'availability_status'];

  const fieldsToUpdate: string[] = simpleFields.filter(field =>
    field in payload && payload[field] !== current[field]
  );

  if (fieldsToUpdate.length === 0) {
    return { success: false, message: 'No changes detected', error: 'Payload values are identical to current record' };
  }

  const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);
  const values = [...fieldsToUpdate.map(field => payload[field]), id];

  const result = await pool.query(
    `UPDATE vehicles
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

const deleteVehicle = async (id: number) => {
  const isBooked = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (isBooked.rows.length === 0) {
    return { success: false, message: `Vehicle with ID ${id} not found`, error: 'Not found' };
  } else if (isBooked.rows[0].availability_status === 'booked') {
    return { success: false, message: `Vehicle with ID ${id} is currently booked and cannot be deleted`, error: 'Vehicle is booked' };
  }
  const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
  if (!result || result.rows.length === 0) {
    console.error(`Failed to delete vehicle with ID ${id}:`, result);
    return { success: false, message: `Vehicle with ID ${id} not found or deletion failed`, error: 'Something went wrong' };
  }
  return result.rows[0];
}

export const vehicleService = {
  createVehicle, getAllVehicles, getVehiclebyID, updateVehicle, deleteVehicle
}