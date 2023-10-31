import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Container, Paper, Grid, Typography, TextField, Button, Link, useTheme, useMediaQuery } from '@mui/material';
import logo from '../assets/Logo.png';
import { getSpecificPassword, getSpecificUser } from '../api/service';
//import { useHistory } from 'react-router-dom';

function Login() {
  const [CorreoElectronico, setCorreoElectronico] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Realiza la solicitud POST al endpoint de autenticación de Django
      const userResponse = await getSpecificUser({
        email: CorreoElectronico
      });

      const foundUser = userResponse.data.find(user => user.CorreoElectronico === CorreoElectronico);
      
      const passwordResponse = await getSpecificPassword({ 
        //busca el password del usuario en la tabla de Passwords con su email
        Password: password
      });
      
      
      if (foundUser) {
        console.log("usuario encontrado ", foundUser.Apodo)
        const foundPassword = passwordResponse.data.find(user => user.Password === password);
        // Verifica la contraseña
        
        if (foundPassword) {
          console.log('fecha de creacion de usuario',foundPassword.Creado_en)
          console.log('Login exitoso: bienvenido', foundUser.Apodo);
          localStorage.setItem('userToken', userResponse.data.token);
          localStorage.setItem('CorreoElectronicoActivo', foundUser.CorreoElectronico);
          console.log("usuario activo ", localStorage.getItem('CorreoElectronicoActivo'))
          
          
          navigate("/dashboard/user-information");  // <-- Esta línea para redirigir al usuario.
        } else {
          console.log("Contraseña incorrecta.")
          console.log('Por favor, inténtalo de nuevo.');
        }
      } else {
        console.log('Por favor, verifica tus credenciales.');
        console.log("Usuario no encontrado.")
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      console.log('Error al intentar iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={2} style={{ padding: isMobile ? '12px' : '30px', marginTop: isMobile ? '10vh' : '20vh' }}>
        <Grid container spacing={1} direction="column" alignItems="center">
          <Grid item>
            <img src={logo} alt="App Logo" width={isMobile ? 70 : 180} />
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
                label="Correo Electronico"
                value={CorreoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
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
