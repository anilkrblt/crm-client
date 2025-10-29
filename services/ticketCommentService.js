import api from './api';


export const getCommentsByTicket = (ticketId) => {
  return api.get(`/ticket-comments/ticket/${ticketId}`);
};


export const getCommentsByAuthor = (authorId) => {
  return api.get(`/ticket-comments/author/${authorId}`);
};


export const addComment = (commentDto) => {
  return api.post('/ticket-comments', commentDto);
};


export const updateComment = (id, commentDto) => {
  return api.put(`/ticket-comments/${id}`, commentDto);
};


export const deleteComment = (id) => {
  return api.delete(`/ticket-comments/${id}`);
};