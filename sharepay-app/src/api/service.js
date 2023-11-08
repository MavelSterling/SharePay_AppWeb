import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/BackendApp/api/v1'
});

export const getUsers = (access_token) => api.get('/Usuarios/', {
    headers: {
      'Authorization': `token ${access_token}`
    }
});

//export const getSpecificUser = (email) => api.get(`/Usuarios/?CorreoElectronico=${email}`);
export const getSpecificUser = (email) => api.get(`/Usuarios/?UserID__CorreoElectronico=${email}`);
//export const getSpecificPassword = (email) => api.get(`/Passwords/?Passwords=${email}`);
export const getSpecificPassword = (password) => api.get(`/Passwords/?UserID__Password=${password}`);



export const getSpecificPasswordfromUser = (email) => api.get(`/Passwords/?UserID__CorreoElectronico=${email}`);


export const createUser = (data) => api.post('/Usuarios/', data)
export const createPassword = (data) => api.post('/Passwords/', data) 


/*
export const getSpecificPassword = (identifier) => {
    // Determinar si 'identifier' parece ser un correo electrónico
    const isEmailFormat = identifier.includes('@');
    console.log(isEmailFormat)
    
    // Construir los parámetros de la solicitud en función de lo que proporcionemos
    
    
    if(isEmailFormat){
        return api.get(`/Passwords/?UserID__CorreoElectronico=${identifier}`);
    }
    else{
        return api.get(`/Passwords/?UserID__Password=${identifier}`);
    }
};
*/