// src/components/Login.js

import React, { useState } from 'react';
import { Container, Paper, Grid, Typography, TextField, Button, Link } from '@mui/material';
import logo from '../assets/Logo.png'; // Logo


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí deberías autenticar con tu backend o sistema de autenticación.
    console.log('Intento de inicio de sesión con:', username, password);
  };

  return (
    <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '30px', marginTop: '20vh', backgroundColor: 'transparent' }}>
            {/* Logo */}
            <Grid container justify="center" style={{ marginBottom: '20px' }}>
            <img src={logo} alt="App Logo" width={100} style={{ display: 'block', margin: '0 auto' }} />
            </Grid>

            <Typography variant="h5" align="center">Iniciar sesión</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    style={{ marginTop: '20px' }}
                >
                    Ingresar
                </Button>
                <Grid container justify="center" style={{ marginTop: '20px' }}>
                    <Link href="/register" variant="body2">
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </Grid>
            </form>
        </Paper>
    </Container>
    );
}

export default Login;
