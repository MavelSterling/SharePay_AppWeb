import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, Grid, Typography, TextField, Button, Link, useTheme, useMediaQuery } from '@mui/material';
import logo from '../assets/Logo.png';
//import { useHistory } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const history = useHistory();

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
        localStorage.setItem('userToken', response.data.token);
        
        // Redirige al usuario a la página de UserInformation
       // history.push('/user-information');
      } else {
        alert('Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      alert('Error al intentar iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: isMobile ? '15px' : '30px', marginTop: isMobile ? '10vh' : '20vh', backgroundColor: 'transparent' }}>
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item>
            <img src={logo} alt="App Logo" width={isMobile ? 80 : 100} />
          </Grid>
          
          <Grid item>
            <Typography variant="h5" align="center">Iniciar sesión</Typography>
          </Grid>
          
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Login;
