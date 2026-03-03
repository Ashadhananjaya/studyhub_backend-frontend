// import API from "../api/axiosConfig";

// export const getMyNotes = () => {
//   return API.get("/notes/my");
// };

// export const createNote = (note) => {
//   return API.post("/notes", note);
// };

// export const deleteNote = (id) => {
//   return API.delete(`/notes/${id}`);
// };
import API from "../api/axiosConfig";

export const noteService = {
  getMyNotes: () => API.get("/notes/my"),
  
  createNote: (noteData) => API.post("/notes", noteData),
  
  // Requirement: Update/Edit note
  updateNote: (id, noteData) => API.put(`/notes/${id}`, noteData),
  
  deleteNote: (id) => API.delete(`/notes/${id}`),
};