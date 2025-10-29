import api from './api';


export const findCustomers = (params) => {
  return api.get('/customers', { params });
};


export const getCustomerById = (id) => {
  return api.get(`/customers/${id}`);
};


export const createCustomer = (customerDto) => {
  return api.post('/customers', customerDto);
};


export const updateCustomer = (id, customerDto) => {
  return api.put(`/customers/${id}`, customerDto);
};


export const deleteCustomer = (id) => {
  return api.delete(`/customers/${id}`);
};