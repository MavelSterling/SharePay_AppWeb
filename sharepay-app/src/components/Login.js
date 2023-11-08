import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Container, Paper, Grid, Typography, TextField, Button, Link } from '@mui/material';
import logo from '../assets/Logo.png';
import { getToken} from '../api/service';
import { useMediaQuery } from 'react-responsive';

function Login() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [username, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Intenta obtener un token a partir de las credenciales brindadas por el username
      
      const response = await getToken(username, password);
      
      if (response.data.token) {
        // El inicio de sesión fue exitoso, el token está en response.data.token
        const token = response.data.token;
        // Puedes almacenar el token en el almacenamiento local o en una cookie para su uso posterior
        localStorage.setItem('userToken', token);
        console.log(token)
        
        // Luego, redirige al username a la página deseada (por ejemplo, la página de inicio de la aplicación)
        navigate("/dashboard/user-information");
      } else {
        // Si no se obtuvo un token, el inicio de sesión falló
        console.log('Inicio de sesión fallido, credenciales incorrectas.');
        alert('Inicio de sesión fallido, credenciales incorrectas.');
      }
    } catch (error) {
      // Maneja los errores en caso de problemas de red o servidor
      console.error('Error durante el inicio de sesión:', error);
      alert('Error durante el inicio de sesión:', error);
    }
  }

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
                label="Nickname o Usuario"
                value={username}
                onChange={(e) => setUsuario(e.target.value)}
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