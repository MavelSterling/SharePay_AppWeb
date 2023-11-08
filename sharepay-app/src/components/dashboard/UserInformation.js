import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Button, Grid, TextField } from '@mui/material';
import { getUserByToken, getUsers, getSpecificPasswordfromUser, getSpecificUser } from '../../api/service';


function UserInformation() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    
    useEffect(() => {
        async function fetchData() {
            const userToken = localStorage.getItem('userToken');
            console.log(userToken)
    
            try {
                const responseUsuarios = await getUserByToken(userToken); // Obtener todos los usuarios
                const responsePasswords = await getSpecificPasswordfromUser(userToken);
    
                if (responseUsuarios.status === 200 && responsePasswords.status === 200) {
                    const usuarios = responseUsuarios.data;
                    const passwords = responsePasswords.data;
    
                    // Filtrar el usuario activo
                    const usuarioActivo = usuarios.find(usuario => usuario.CorreoElectronico === userToken);
                    const passwordActivo = passwords.find(password => password.UserID === usuarioActivo.ID);
    
                    setEmail(usuarioActivo.CorreoElectronico);
                    setFullName(usuarioActivo.NombreCompleto);
                    setNickname(usuarioActivo.Apodo);
                    setPassword(passwordActivo.Password);
                    setAvatarPreview(usuarioActivo.FotoOAvatar)

                    console.log(usuarioActivo.FotoOAvatar)
                } else {
                    console.error("No se pudo obtener la información del usuario o la contraseña.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    
        fetchData();
    }, []);
    

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('email', email);
        formData.append('full_name', fullName);
        formData.append('nickname', nickname);
        formData.append('password', password);
    
        if (avatar) {
            formData.append('avatar', avatar);
        }
    
        const correoElectronicoActivo = localStorage.getItem('CorreoElectronicoActivo');
    
        try {
            const responseUsuario = await getSpecificUser(correoElectronicoActivo);
            const responsePassword = await getSpecificPasswordfromUser(correoElectronicoActivo);
        
            console.log("Respuesta Usuario:", responseUsuario);
            console.log("Respuesta Password:", responsePassword);
        
            if (responseUsuario.status === 200 && responsePassword.status === 200) {
                const dataUsuario = responseUsuario.json().data;
                const dataPassword = responsePassword.json().data;
        
                setEmail(dataUsuario.CorreoElectronico);
                setFullName(dataUsuario.NombreCompleto);
                setNickname(dataUsuario.Apodo);
                setPassword(dataPassword.Password);
                setAvatarPreview(dataUsuario.FotoOAvatar)
                console.log("Información actualizada correctamente");
            } else {
                console.error("No se pudo obtener la información del usuario o la contraseña.");
                alert("Ocurrió un error al actualizar la información.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar conectar con el servidor.");
        }
        
    };
    

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const previewURL = URL.createObjectURL(file);
            setAvatarPreview(previewURL);
        }
    };

    const handleDeactivateAccount = async () => {
        // Con un endpoint que maneje la desactivación de cuentas:
        const userToken = localStorage.getItem("userToken");
        try {
            const responseUsuario = await fetch('http://tu-dominio.com/api/deactivateAccount/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`
                }
            });

            const dataUsuario = await responseUsuario.json();

            if (responseUsuario.ok) {
                alert("Cuenta desactivada correctamente");
                // Aquí se puede redirigir al usuario a la página de inicio o hacer log out
            } else {
                alert(dataUsuario.error || "Ocurrió un error al intentar desactivar la cuenta");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar conectar con el servidor.");
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Información del usuario</h2>

                <Grid container spacing={3}>
                    {/* Columna izquierda */}
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            label="Correo electrónico"
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <TextField 
                            fullWidth
                            label="Nombre completo"
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            style={{ marginTop: '10px' }}
                        />
                        <TextField 
                            fullWidth
                            label="Apodo"
                            type="text" 
                            value={nickname} 
                            onChange={(e) => setNickname(e.target.value)} 
                            style={{ marginTop: '10px' }}
                        />
                        <TextField 
                            fullWidth
                            label="Contraseña"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={{ marginTop: '10px' }}
                        />
                    </Grid>

                    {/* Columna derecha */}
                    <Grid item xs={12} md={6} container direction="column" alignItems="center" justifyContent="flex-start">
                        <div style={{ width: '150px', height: '150px', border: '1px solid black', marginBottom: '10px' }}>
                            {avatarPreview ? <img src={avatarPreview} alt="Avatar Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : "No image uploaded"}
                        </div>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="avatar-upload"
                            type="file"
                            onChange={handleAvatarChange}
                        />
                        <label htmlFor="avatar-upload">
                            <Button variant="contained" color="primary" component="span">
                                Subir Avatar
                            </Button>
                        </label>
                    </Grid>

                    {/* Botones */}
                    <Grid item xs={12} container justifyContent="space-between">
                        <Button  className="button-info" variant="contained" onClick={handleUpdate}>
                            Actualizar información
                        </Button>
                        <Button  className="button-info" variant="contained" color="secondary" onClick={handleDeactivateAccount}>
                            Desactivar cuenta
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default UserInformation;