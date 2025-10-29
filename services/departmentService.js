import api from './api';

/**
 * Departmanları listeler veya filtreler.
 * @param {object} params - Opsiyonel filtreler (örn: { name: 'Teknik' })
 */
export const findDepartments = (params) => {
  return api.get('/departments', { params });
  // Örnek kullanım:
  // findDepartments() -> Tüm departmanları getirir
  // findDepartments({ name: 'Teknik' }) -> Adı 'Teknik' içerenleri getirir
};

/**
 * ID ile bir departman getirir.
 * @param {number} id - Departman ID'si
 */
export const getDepartmentById = (id) => {
  return api.get(`/departments/${id}`);
};

/**
 * Yeni bir departman oluşturur.
 * @param {object} departmentDto - Yeni departman verisi (örn: { name, description })
 */
export const createDepartment = (departmentDto) => {
  return api.post('/departments', departmentDto);
};

/**
 * Mevcut bir departmanı günceller.
 * @param {number} id - Güncellenecek departman ID'si
 * @param {object} departmentDto - Güncel departman verisi
 */
export const updateDepartment = (id, departmentDto) => {
  return api.put(`/departments/${id}`, departmentDto);
};

/**
 * Bir departmanı siler.
 * @param {number} id - Silinecek departman ID'si
 */
export const deleteDepartment = (id) => {
  return api.delete(`/departments/${id}`);
};