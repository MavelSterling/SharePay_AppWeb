import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect} from 'react';
import { Container, Paper, Grid, Typography, TextField, Button, Link } from '@mui/material';
import logo from '../assets/Logo.png';
import { getToken, getUserByUsername} from '../api/service';
import { useMediaQuery } from 'react-responsive';

function Login() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [username, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  
  useEffect(() => {
    if (localStorage.getItem('userToken') !== null) {
      alert('Usted ya habia iniciado sesion, bienvenido de vuelta')
      navigate('/dashboard/user-information');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await getToken(username, password);

        if (response.data.token) {
            const token = response.data.token;

            // Obtener el ID del usuario
            const userResponse = await getUserByUsername(token, username);
            
            if (userResponse.data.user_id) {
                const userId = userResponse.data.user_id;
                const userEmail = userResponse.data.email;

                localStorage.setItem('userToken', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', username);
                localStorage.setItem('email', userEmail);

                console.log('token: ',token);
                console.log('UserID: ', userId);
                alert('Bienvenido ', username)
                navigate("/dashboard/user-information");
            } else {
                console.log('Error al obtener el ID del usuario.');
                alert('Error al obtener el ID del usuario.');
            }
        } else {
            console.log('Inicio de sesión fallido, credenciales incorrectas.');
            alert('Inicio de sesión fallido, credenciales incorrectas.');
        }
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        alert('Error durante el inicio de sesión:', error);
    }

};

  

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