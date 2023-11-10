import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
});
/*
const admin = axios.create({
  baseURL: 'http://127.0.0.1:8000/admin/'
});

*/
export const getUsers = (access_token) => api.get('api/v1/Usuarios/', {
    headers: {
      'Authorization': `token ${access_token}`
    }
});

// En tu archivo de servicio o donde defines las llamadas a la API
export const getProfileByID = (userToken, userID) => api.get(`/api/v1/Perfiles/${userID}/`, {
  headers: {
    'Authorization': `Token ${userToken}`
  }
});


export const getUserByUsername = (access_token, username) => api.get(`/get_user_id/?username=${username}`, {
  headers: {
    'Authorization': `token ${access_token}`
  }
});

//este es el login
export const getToken = (usuario, password) => {
    return api.post('/generate_token/', {
        username: usuario,
        password: password,
    });
  };  
  /* 
  */

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
