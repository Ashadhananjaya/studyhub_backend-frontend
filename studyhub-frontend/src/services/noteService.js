import axios from 'axios';

const API_URL = "http://localhost:8080/api/notes";

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const noteService = {

    getMyNotes: () =>
        axios.get(`${API_URL}/my`, getAuthHeader()),

    // Now accepts page, size, sortBy for pagination
    getPublicNotes: (page = 0, size = 12, sortBy = "createdAt") =>
        axios.get(`${API_URL}/public`, {
            params: { page, size, sortBy }
        }),

    createNote: (noteData) =>
        axios.post(API_URL, noteData, getAuthHeader()),

    updateNote: (noteId, noteData) =>
        axios.put(`${API_URL}/${noteId}`, noteData, getAuthHeader()),

    deleteNote: (noteId) =>
        axios.delete(`${API_URL}/${noteId}`, getAuthHeader()),

    likeNote: (noteId) =>
        axios.post(`${API_URL}/${noteId}/like`, {}, getAuthHeader()),
};
