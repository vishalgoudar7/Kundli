import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export async function generateKundli(data) {
  const response = await axios.post(`${API_URL}/kundli`, data);
  return response.data;
}
