import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
});

export const updateUserInfo = (access_token, userData) => api.post('/update_user/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
    'Content-Type': 'application/json',
  },
});

export const updateUserProfile = (access_token, userData) => api.post('/update_perfil/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
    'Content-Type': 'application/json',
  },
});


// En tu archivo de servicio o donde defines las llamadas a la API
export const getProfileByID = (access_token, userID) => api.get(`/api/v1/Perfiles/${userID}/`, {
  headers: {
    'Authorization': `Token ${access_token}`
  }
});


export const getUserByUsername = (access_token, username) => api.get(`/get_user/?username=${username}`, {
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
