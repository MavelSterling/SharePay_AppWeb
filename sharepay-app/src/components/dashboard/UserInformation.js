import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Button, Grid, TextField , TextareaAutosize} from '@mui/material';
import { getUserByUsername, getSpecificPasswordfromUser, getSpecificUser, getProfileByID } from '../../api/service';


function UserInformation() {
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [bio, setBio] = useState('');

    
    useEffect(() => {
        async function fetchData() {
            const userToken = localStorage.getItem('userToken');
            const UserName = localStorage.getItem('username');
            const userId = localStorage.getItem('userId');
    
            try {
                const responseUsuarios = await getUserByUsername(userToken, UserName); // Obtener todos los datos del usuario
                const responsePerfil = await getProfileByID(userToken, userId);
                //console.log(responseUsuarios)
                //console.log(responsePerfil)

                // //
    
                if (responseUsuarios.status === 200) {
                    const infoUser = responseUsuarios.data;
                    const infoProfile = responsePerfil.data;
    
                    setEmail(infoUser.email);
                    setNombre(infoUser.first_name);
                    setApellido(infoUser.last_name);
                    setNickname(infoUser.username);
                    setPassword(infoUser.password);
                    setConfirmPassword(infoUser.password2);
                    setAvatarPreview(infoProfile.FotoOAvatar);
                    setBio(infoProfile.bio)

                    console.log(infoProfile.bio)
                } else {
                    console.error("No se pudo obtener la información del usuario o la contraseña.");
                }


            } catch (error) {
                console.error("Error:", error);
            }
        }
    
        fetchData();
    }, []);
    

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('username', nickname);
        formData.append('password', password);
        formData.append('first_name', nombre);
        formData.append('last_name', apellido);
        formData.append('email', email);
    
        if (avatar) {
            formData.append('avatar', avatar);
        }
    
        const correoElectronicoActivo = localStorage.getItem('CorreoElectronicoActivo');
    
        try {
            const responseUsuario = await getSpecificUser(correoElectronicoActivo);
            const responsePassword = await getSpecificPasswordfromUser(correoElectronicoActivo);
        
            console.log("Respuesta Usuario:", responseUsuario);
            console.log("Respuesta Password:", responsePassword);
        
            if (responseUsuario.status === 200 && responsePassword.status === 200) {
                const dataUsuario = responseUsuario.json().data;
                const dataPassword = responsePassword.json().data;
        
                setEmail(dataUsuario.CorreoElectronico);
                setNombre(dataUsuario.NombreCompleto);
                setNickname(dataUsuario.Apodo);
                setPassword(dataPassword.Password);
                setAvatarPreview(dataUsuario.FotoOAvatar)
                console.log("Información actualizada correctamente");
            } else {
                console.error("No se pudo obtener la información del usuario o la contraseña.");
                alert("Ocurrió un error al actualizar la información.");
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
            const responseUsuario = await fetch('http://tu-dominio.com/api/deactivateAccount/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`
                }
            });

            const dataUsuario = await responseUsuario.json();

            if (responseUsuario.ok) {
                alert("Cuenta desactivada correctamente");
                // Aquí se puede redirigir al usuario a la página de inicio o hacer log out
            } else {
                alert(dataUsuario.error || "Ocurrió un error al intentar desactivar la cuenta");
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
                            style={{ marginTop: '10px' }}
                        />
                        <TextField
                            fullWidth
                            label="Nombre/s"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            style={{ marginTop: '10px' }}
                        />
                        <TextField
                            fullWidth
                            label="Apellido/s"
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
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
                        <TextField
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ marginTop: '10px' }}
                        />
                        

                    </Grid>

                    {/* Columna derecha */}
                    <Grid item xs={12} md={6} container direction="column" alignItems="center" justifyContent="flex-start">
                        <div style={{ width: '150px', height: '150px', marginBottom: '20px' }}>
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
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            style={{
                                width: '100%',
                                marginTop: '10px',
                                padding: '8px',
                                border: '1px solid #ccc', // Cambié el grosor del borde para que coincida con los otros campos
                                borderRadius: '4px', // Agregué bordes redondeados para hacerlo más consistente
                                resize: 'none'
                            }}
                        />
                    </Grid>


                    {/* Botones */}
                    <Grid item xs={12} container justifyContent="space-between">
                        <Button className="button-info" variant="contained" onClick={handleUpdate}>
                            Actualizar información
                        </Button>
                        <Button className="button-info" variant="contained" color="secondary" onClick={handleDeactivateAccount}>
                            Desactivar cuenta
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default UserInformation;