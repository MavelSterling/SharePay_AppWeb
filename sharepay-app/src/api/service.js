import axios from 'axios'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/BackendApp/api/v1'
})

export const getUsers = () => api.get('/Usuarios/');

export const getSpecificUser = (email) => api.get(`/Usuarios/?CorreoElectronico=${email}`);
export const getSpecificPassword = (email) => api.get(`/Passwords/?Passwords=${email}`);

export const createUser = (data) => api.post('/Usuarios/', data)
export const createPassword = (data) => api.post('/Passwords/', data) 