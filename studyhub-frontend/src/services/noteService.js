import API from "../api/axiosConfig";

export const noteService = {

    getMyNotes: () =>
        API.get("/notes/my"),

    getPublicNotes: (page = 0, size = 12, sortBy = "createdAt") =>
        API.get("/notes/public", {
            params: { page, size, sortBy }
        }),

    createNote: (noteData) =>
        API.post("/notes", noteData),

    updateNote: (noteId, noteData) =>
        API.put(`/notes/${noteId}`, noteData),

    deleteNote: (noteId) =>
        API.delete(`/notes/${noteId}`),

   // in noteService.js
likeNote: (id) => API.post(`/notes/${id}/like`),
};