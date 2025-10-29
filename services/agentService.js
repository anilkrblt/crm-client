import api from './api';

/**
 * Ajanları listeler veya filtreler.
 * @param {object} params - Opsiyonel filtreler (örn: { name: 'Anil', department: 'Teknik' })
 */
export const findAgents = (params) => {
  return api.get('/agents', { params });
};

/**
 * ID ile bir ajanı getirir.
 * @param {number} id - Ajan ID'si
 */
export const getAgentById = (id) => {
  return api.get(`/agents/${id}`);
};

/**
 * Yeni bir ajan oluşturur.
 * @param {object} agentDto - Yeni ajan verisi (örn: { firstName, lastName, email, password, departmentName })
 */
export const createAgent = (agentDto) => {
  return api.post('/agents', agentDto);
};

/**
 * Mevcut bir ajanı günceller.
 * @param {number} id - Güncellenecek ajan ID'si
 * @param {object} agentDto - Güncel ajan verisi
 */
export const updateAgent = (id, agentDto) => {
  return api.put(`/agents/${id}`, agentDto);
};

/**
 * Bir ajanı siler.
 * @param {number} id - Silinecek ajan ID'si
 */
export const deleteAgent = (id) => {
  return api.delete(`/agents/${id}`);
};