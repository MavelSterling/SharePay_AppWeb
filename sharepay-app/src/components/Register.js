import React, { useState } from 'react';
//import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
//import { createUser, getUsers } from '../api/service'
import { createUser } from '../api/service'


function Register() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('fullName', fullName);
        formData.append('nickname', nickname);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        console.log(formData.get("email"))
        
        try {
            const response = await createUser({
                CorreoElectronico: formData.get("email"),
                NombreCompleto: formData.get("fullName"),
                Apodo: formData.get("nickname"),
                //FotoOAvatar: "https://static.vecteezy.com/system/resources/previews/019/896/012/original/female-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png",
                Estado: "activo"
            })
            if (response.data) {
                // Registro exitoso
                //console.log('Registro exitoso:', response.data);
                localStorage.setItem('id',response.data.UserID)
                navigate("/dashboard/user-information");  // <-- Esta línea para redirigir al usuario.

            }
        } catch (error) {
            console.error('Hubo un error al registrarse:', error);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    return (
        <Container component="main" maxWidth="md" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Grid container spacing={3} direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <img src={logo} alt="App Logo" width={100} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">Registrarse</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
                        <form onSubmit={handleRegister}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Correo electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Nombre completo"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Apodo"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="avatar-upload"
                                type="file"
                                onChange={handleAvatarChange}
                            />
                            <label htmlFor="avatar-upload">
                                <Button variant="outlined" color="primary" component="span" style={{ marginTop: '20px' }}>
                                    Subir Avatar
                                </Button>
                            </label>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '20px' }}
                            >
                                Registrarse
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default Register;

// para ver usuarios
// http://127.0.0.1:8000/BackendApp/api/v1/Usuarios/