import api from './api';

/**
 * Giriş yaparak JWT token alır.
 * @param {object} credentials - { email, password } içeren obje
 */
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

// Not: Login başarılı olduğunda, dönen token'ı localStorage'a kaydetmelisin.
// Örnek: 
// login({ email, password })
//   .then(response => {
//     const token = response.data.token;
//     localStorage.setItem('token', token);
//     // Login başarılı, yönlendir...
//   })
//   .catch(error => {
//     // Hata yönetimi
//   });