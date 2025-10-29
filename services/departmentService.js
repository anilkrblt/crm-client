import api from './api';


export const findDepartments = (params) => {
  return api.get('/departments', { params });
};


export const getDepartmentById = (id) => {
  return api.get(`/departments/${id}`);
};


export const createDepartment = (departmentDto) => {
  return api.post('/departments', departmentDto);
};


export const updateDepartment = (id, departmentDto) => {
  return api.put(`/departments/${id}`, departmentDto);
};


export const deleteDepartment = (id) => {
  return api.delete(`/departments/${id}`);
};