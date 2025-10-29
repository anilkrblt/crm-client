import api from './api';

/**
 * Müşterileri listeler veya filtreler.
 * @param {object} params - Opsiyonel filtreler (örn: { name: 'Ali' } veya { email: 'ali@veli.com' })
 */
export const findCustomers = (params) => {
  return api.get('/customers', { params });
};

/**
 * ID ile bir müşteriyi getirir.
 * @param {number} id - Müşteri ID'si
 */
export const getCustomerById = (id) => {
  return api.get(`/customers/${id}`);
};

/**
 * Yeni bir müşteri oluşturur.
 * @param {object} customerDto - Yeni müşteri verisi (örn: { firstName, lastName, email, password, phone })
 */
export const createCustomer = (customerDto) => {
  // Not: Bu endpoint'in SecurityConfig'de public (permitAll) olması gerekir.
  return api.post('/customers', customerDto);
};

/**
 * Mevcut bir müşteriyi günceller.
 * @param {number} id - Güncellenecek müşteri ID'si
 * @param {object} customerDto - Güncel müşteri verisi
 */
export const updateCustomer = (id, customerDto) => {
  return api.put(`/customers/${id}`, customerDto);
};

/**
 * Bir müşteriyi siler.
 * @param {number} id - Silinecek müşteri ID'si
 */
export const deleteCustomer = (id) => {
  return api.delete(`/customers/${id}`);
};