import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Button, Grid, TextField } from '@mui/material';


function UserInformation() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        const userToken = localStorage.getItem("userToken");

        const formData = new FormData();
        formData.append('email', email);
        formData.append('full_name', fullName);
        formData.append('nickname', nickname);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await fetch('http://tu-dominio.com/api/updateUserInfo/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`
                },
                body: formData
            });

            const data = await response.json();

            // Aquí puedes manejar la respuesta del servidor
            if (response.ok) {
                alert("Información actualizada correctamente");
            } else {
                alert(data.error || "Ocurrió un error al actualizar la información");
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
            const response = await fetch('http://tu-dominio.com/api/deactivateAccount/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cuenta desactivada correctamente");
                // Aquí se puede redirigir al usuario a la página de inicio o hacer log out
            } else {
                alert(data.error || "Ocurrió un error al intentar desactivar la cuenta");
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
                        <Button variant="contained" color="primary" onClick={handleUpdate}>
                            Actualizar información
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDeactivateAccount}>
                            Desactivar cuenta
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default UserInformation;