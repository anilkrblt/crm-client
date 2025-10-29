import api from './api';


export const findAgents = (params) => {
  return api.get('/agents', { params });
};


export const getAgentById = (id) => {
  return api.get(`/agents/${id}`);
};


export const createAgent = (agentDto) => {
  return api.post('/agents', agentDto);
};


export const updateAgent = (id, agentDto) => {
  return api.put(`/agents/${id}`, agentDto);
};


export const deleteAgent = (id) => {
  return api.delete(`/agents/${id}`);
};