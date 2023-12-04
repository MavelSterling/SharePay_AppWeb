import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid,useTheme, useMediaQuery, Link } from '@mui/material';
import logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
//import { createUser, getUsers } from '../api/service'
import { registerUser, validatePassword } from '../api/service';



function Register() {
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = {
            username: usuario,
            password: password,
            password2: confirmPassword,
            email: email,
            first_name: nombres,
            last_name: apellidos,
          };
        
        if (!validatePassword(password, confirmPassword)) {
            setPassword("");
            setConfirmPassword("");
            return;
        }

        try {
            const response = await registerUser(userData);
            if (response.data) {
                // Registro exitoso
                console.log('Registro exitoso:', response.data);
                alert('Registro exitoso');
                navigate("/login");
        }
        } catch (error) {
            console.error('Hubo un error al registrarse:', error);
            alert('hubo un error al registrarse, por favor, verifica los datos')
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    return (
        <Container component="main" maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', minHeight: '90vh', justifyContent: 'center' }}>
            <Paper elevation={1} style={{ padding: isMobile ? '12px' : '20px', marginTop: isMobile ? '10vh' : '15vh' }}>
                <Grid container spacing={1} direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <img src={logo} alt="App Logo" width={isMobile ? 80 : 180} />
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant="h5" align="center">Registrarse</Typography>
                    </Grid>
                    <Grid item xs={10} sm={8} md={6}>
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
                                label="Nombres"
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Apellidos"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Nickname (Usuario)"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                type="password"
                                margin="normal"
                                required
                                fullWidth
                                label="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                type="password"
                                margin="normal"
                                required
                                fullWidth
                                label="Confirma la contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <Grid container justify="center" style={{ marginTop: '20px' }}>
                                <Link href="/login" variant="body2">
                                ¿Ya tienes una cuenta? Inicia sesion.
                                </Link>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default Register;