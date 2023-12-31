import axios from 'axios'

const apilocal = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
});

const api = axios.create({
  baseURL: 'https://riddimental.pythonanywhere.com/api/'
});


export const updateUserInfo = (access_token, userData) => api.post('/update_user/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});


export const updateProfileInfo = (access_token, userData) => api.post('/update_perfil/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const updateContactInfo = (access_token, userData) => api.post('/update_contactos/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const updateEventInfo = (access_token, userData) => api.post('/update_event/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const deleteContact = (access_token, userData) => api.post('/delete_contactos/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const deleteEvent = (access_token, eventID) => api.post('/delete_event/', { eventID }, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const createEventParticipant = (access_token, userData) => api.post('/create_event_participant/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const createCotnact = (access_token, userData) => api.post('/create_contactos/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const createEvent = (access_token, userData) => api.post('/create_events/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const createActivity = (access_token, userData) => api.post('/create_activity/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

// devuelve el perfil directamente
export const getProfileByID = (access_token, userID) => api.get(`/api/v1/Perfiles/${userID}/`, {
  headers: {
    'Authorization': `Token ${access_token}`
  }
});

//devuelve una lista de resultados, donde el atributo [0] es el perfil
export const searchProfileByUsername = (access_token, username) => api.get(`/api/v1/Perfiles/?search=${username}`, {
  headers: {
    'Authorization': `Token ${access_token}`
  }
});


export const checkCommonEvents = (access_token, userData) => api.get('/have_common_events/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

export const getUserByUsername = (access_token, username) => api.get(`/get_user/?username=${username}`, {
  headers: {
    'Authorization': `token ${access_token}`
  }
});

export const getContacts = (access_token, username) => api.get(`/get_contacts/?username=${username}`, {
  headers: {
    'Authorization': `token ${access_token}`
  }
});



export const getUserByEmail = (access_token, email) => api.get(`/get_user/?email=${email}`, {
  headers: {
    'Authorization': `token ${access_token}`
  }
});

export const getMyEvents = (access_token, username) => api.get(`/get_my_events/?username=${username}`, {
  headers: {
    'Authorization': `token ${access_token}`
  }
});

//devuelve las actividades de un evento
export const getEventActivities = (access_token, eventID) => api.get(`/get_event_activities/?eventID=${eventID}`, {
  headers: {
    'Authorization': `Token ${access_token}`
  }
});

//devuelve los participantes de un evento
export const getEventParticipants = (access_token, eventoID) => api.get(`/get_event_participants/?eventoID=${eventoID}`, {
  headers: {
    'Authorization': `Token ${access_token}`
  }
});

export const getAllEvents = (access_token) => api.get(`/get_all_events/`, {
  headers: {
    'Authorization': `token ${access_token}`
  }
});

/*
export const getActivities = (access_token, username) => api.get(`/get_user/?email=${email}`, {
  headers: {
    'Authorization': `token ${access_token}`
  }
});



export const createActivity = (access_token, userData) => api.post('/create_contactos/', userData, {
  headers: {
    'Authorization': `Token ${access_token}`,
  },
});

 */



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

  export function validatePassword(password, confirmPassword) {
    const minLength = 8;
    /*
    const minUpperCase = 1; // Al menos una letra mayúscula
    const minLowerCase = 1; // Al menos una letra minúscula
    const minDigits = 1; // Al menos un dígito
    const minSpecialChars = 1; // Al menos un carácter especial
    */
  
    // Comprueba si el campo de contraseña está vacío
    if (password == null) {
      alert(`El campo contraseña está vacío`);
      return false;
    }
  
    if (!password.trim()) {
      alert(`El campo contraseña está vacío`);
      return false;
    }
  
    // Comprueba la longitud mínima de la contraseña
    if (password.length < minLength) {
      alert(`La contraseña debe tener al menos ${minLength} caracteres.`);
      return false;
    }
  
    // Comprueba si las contraseñas coinciden
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return false;
    }
  
    /*
    // Comprueba si la contraseña contiene al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      alert('La contraseña debe contener al menos una letra mayúscula.');
      return false;
    }
    
    // Comprueba si la contraseña contiene al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      alert('La contraseña debe contener al menos una letra minúscula.');
      return false;
    }
    */
    
    // Comprueba si la contraseña contiene al menos un dígito
    if (!/\d/.test(password)) {
      alert('La contraseña debe contener al menos un dígito.');
      return false;
    }
  
    // Comprueba si la contraseña contiene al menos un carácter especial
    /*
    if (!/[^A-Za-z0-9]/.test(password)) {
      alert('La contraseña debe contener al menos un carácter especial.');
      return false;
    }
    */
  
    // Comprueba si la contraseña contiene espacios en blanco
    if (/\s/.test(password)) {
      alert('La contraseña no puede contener espacios en blanco.');
      return false;
    }
  
    // Agrega más criterios según sea necesario
  
    return true; // La contraseña cumple con los requisitos
};