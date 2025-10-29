import api from './api';

/**
 * Bir bilete ait yorumları getirir.
 * @param {number} ticketId - Bilet ID'si
 */
export const getCommentsByTicket = (ticketId) => {
  return api.get(`/ticket-comments/ticket/${ticketId}`);
};

/**
 * Bir yazara ait yorumları getirir.
 * @param {number} authorId - Yazar (User) ID'si
 */
export const getCommentsByAuthor = (authorId) => {
  return api.get(`/ticket-comments/author/${authorId}`);
};

/**
 * Yeni bir yorum ekler.
 * @param {object} commentDto - Yeni yorum verisi (örn: { ticketId, comment })
 */
export const addComment = (commentDto) => {
  return api.post('/ticket-comments', commentDto);
};

/**
 * Mevcut bir yorumu günceller.
 * @param {number} id - Güncellenecek yorum ID'si
 * @param {object} commentDto - Güncel yorum verisi (örn: { comment })
 */
export const updateComment = (id, commentDto) => {
  return api.put(`/ticket-comments/${id}`, commentDto);
};

/**
 * Bir yorumu siler.
 * @param {number} id - Silinecek yorum ID'si
 */
export const deleteComment = (id) => {
  return api.delete(`/ticket-comments/${id}`);
};