import api from './api';


export const findTickets = (params) => {
  return api.get('/tickets', { params });
};


export const getTicketById = (id) => {
  return api.get(`/tickets/${id}`);
};


export const getTicketsByCustomer = (customerId) => {
  return api.get(`/tickets/customer/${customerId}`);
};


export const getTicketsByAssignedAgent = (agentId) => {
  return api.get(`/tickets/assigned-agent/${agentId}`);
};


export const getTicketsByDepartment = (departmentId) => {
  return api.get(`/tickets/department/${departmentId}`);
};


export const createTicket = (ticketDto) => {
  return api.post('/tickets', ticketDto);
};


export const updateTicket = (id, ticketDto) => {
  return api.put(`/tickets/${id}`, ticketDto);
};


export const updateTicketStatus = (id, status) => {
  return api.patch(`/tickets/${id}/status`, null, { params: { status } });
};


export const deleteTicket = (id) => {
  return api.delete(`/tickets/${id}`);
};