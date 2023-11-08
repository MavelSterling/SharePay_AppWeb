import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/BackendApp/'
});

export const getUsers = (access_token) => api.get('api/v1/Usuarios/', {
    headers: {
      'Authorization': `token ${access_token}`
    }
});

export const getUserByToken = (token) => {
    return api.get('/user', {
      headers: {
        'Authorization': `Bearer ${token}`, // Envía el token como encabezado de autorización
      },
    });
  };

//este es el login
export const getToken = (usuario, password) => {
    return api.post('/generate_token/', {
        username: usuario,
        password: password,
    });
  };  
  

//este es el registro

export const registerUser = (userData) => {
    return api.post('/sign-up/', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

//export const getSpecificUser = (email) => api.get(`/Usuarios/?CorreoElectronico=${email}`);
export const getSpecificUser = (email) => api.get(`api/v1/Usuarios/?UserID__CorreoElectronico=${email}`);
//export const getSpecificPassword = (email) => api.get(`/Passwords/?Passwords=${email}`);
export const getSpecificPassword = (password) => api.get(`api/v1/Passwords/?UserID__Password=${password}`);



export const getSpecificPasswordfromUser = (email) => api.get(`api/v1/Passwords/?UserID__CorreoElectronico=${email}`);
