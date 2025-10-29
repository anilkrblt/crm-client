import axios from 'axios';

// 1. Merkezi Axios Instance Oluştur
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 2. Request Interceptor (İstek Önleyici)
// Bu, api.get(), api.post() vb. çağrıldığında araya girer
api.interceptors.request.use(
  (config) => {
    // localStorage'dan (veya token'ı nerede saklıyorsan) token'ı al
    const token = localStorage.getItem('token'); 
    
    if (token) {
      // Eğer token varsa, her isteğin Authorization header'ına ekle
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // İstek hatası olursa
    return Promise.reject(error);
  }
);

// Opsiyonel: Hata yönetimi için Response Interceptor
api.interceptors.response.use(
  (response) => {
    // 2xx aralığındaki yanıtlar buraya düşer
    return response;
  },
  (error) => {
    // 2xx dışındaki yanıtlar (404, 403, 500 vb.) buraya düşer
    if (error.response && error.response.status === 401) {
      // Örnek: Token geçersizse (Unauthorized) kullanıcıyı login'e yönlendir
      console.error("Yetkisiz istek! Token geçersiz veya süresi dolmuş.");
      // window.location.href = '/login'; 
      localStorage.removeItem('token'); // Geçersiz token'ı temizle
    }
    return Promise.reject(error);
  }
);

export default api;