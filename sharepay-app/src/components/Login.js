import React, { useState } from 'react';
import axios from 'axios';  // <-- Importa axios
import { Container, Paper, Grid, Typography, TextField, Button, Link } from '@mui/material';
import logo from '../assets/Logo.png'; // Logo

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Realiza la solicitud POST al endpoint de autenticación de Django
      const response = await axios.post('http://tu-dominio.com/api-token-auth/', {
        username: username,
        password: password
      });

      // Si la respuesta contiene un token, asume que la autenticación fue exitosa
      if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);  // Guarda el token en el localStorage

        // Aquí puedes redirigir al usuario al dashboard o la página que desees
        // Por ejemplo usando: history.push('/dashboard');
      } else {
        alert('Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      alert('Error al intentar iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '30px', marginTop: '20vh', backgroundColor: 'transparent' }}>
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
