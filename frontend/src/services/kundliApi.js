import api from './api.js';
export const createKundli = async data => (await api.post('/kundli', data)).data;
export const getKundlis = async () => (await api.get('/kundli')).data;
export const getKundli = async id => (await api.get(`/kundli/${id}`)).data;
export const updateKundli = async (id, data) => (await api.put(`/kundli/${id}`, data)).data;
export const deleteKundli = async id => (await api.delete(`/kundli/${id}`)).data;
export const generateKundli = createKundli;
