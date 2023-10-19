import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import logo from '../assets/Logo.png';

function Register() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('fullName', fullName);
        formData.append('nickname', nickname);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await axios.post('http://tuBackendURL/api/register/', formData);
            if (response.data) {
                // Registro exitoso
                console.log('Registro exitoso:', response.data);
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
        <Container component="main" maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'transparent' }}>
                <Grid container alignItems="center" justifyContent="center" style={{ marginBottom: '20px' }}>
                    <img src={logo} alt="App Logo" width={100} style={{ display: 'block', margin: '0 auto' }} />
                </Grid>

                <Typography variant="h5" align="center">Registrarse</Typography>
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
            </Paper>
        </Container>
    );
}

export default Register;
