import api from './api';

/**
 * Biletleri listeler veya filtreler.
 * @param {object} params - Opsiyonel filtreler (örn: { status: 'OPEN', priority: 'HIGH' })
 */
export const findTickets = (params) => {
  return api.get('/tickets', { params });
  // Not: Eğer /status ve /priority ayrı endpoint'ler ise (kötü tasarım), 
  // bu fonksiyonu ayrı ayrı yazman gerekir:
  // getTicketsByStatus: (status) => api.get('/tickets/status', { params: { status } })
};

/**
 * ID ile bir bilet getirir.
 * @param {number} id - Bilet ID'si
 */
export const getTicketById = (id) => {
  return api.get(`/tickets/${id}`);
};

/**
 * Bir müşteriye ait biletleri getirir.
 * @param {number} customerId - Müşteri ID'si
 */
export const getTicketsByCustomer = (customerId) => {
  return api.get(`/tickets/customer/${customerId}`);
};

/**
 * Bir ajana atanmış biletleri getirir.
 * @param {number} agentId - Ajan ID'si
 */
export const getTicketsByAssignedAgent = (agentId) => {
  // Controller'daki URL'in /assigned-agent/{agentId} olduğunu varsayıyorum
  return api.get(`/tickets/assigned-agent/${agentId}`);
};

/**
 * Bir departmana ait biletleri getirir.
 * @param {number} departmentId - Departman ID'si
 */
export const getTicketsByDepartment = (departmentId) => {
  return api.get(`/tickets/department/${departmentId}`);
};

/**
 * Yeni bir bilet oluşturur.
 * @param {object} ticketDto - Yeni bilet verisi (örn: { customer: {id}, department: {id}, subject, ... })
 */
export const createTicket = (ticketDto) => {
  return api.post('/tickets', ticketDto);
};

/**
 * Mevcut bir bileti günceller.
 * @param {number} id - Güncellenecek bilet ID'si
 * @param {object} ticketDto - Güncel bilet verisi
 */
export const updateTicket = (id, ticketDto) => {
  return api.put(`/tickets/${id}`, ticketDto);
};

/**
 * Bir biletin durumunu günceller.
 * @param {number} id - Bilet ID'si
 * @param {string} status - Yeni durum (örn: "CLOSED")
 */
export const updateTicketStatus = (id, status) => {
  return api.patch(`/tickets/${id}/status`, null, { params: { status } });
  // Veya eğer body gerektiriyorsa: api.patch(`/tickets/${id}/status?status=${status}`)
};

/**
 * Bir bileti siler.
 * @param {number} id - Silinecek bilet ID'si
 */
export const deleteTicket = (id) => {
  return api.delete(`/tickets/${id}`);
};