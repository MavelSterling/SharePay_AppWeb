import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Button, Grid, TextField, Select, InputLabel, FormControl, MenuItem } from '@material-ui/core';
import { getProfileByUsername , getUserByUsername, updateUserInfo, updateProfileInfo, getProfileByID , validatePassword, getUserByEmail} from '../../api/service';

import { useNavigate } from 'react-router-dom';  // Importar useNavigate

function UserInformation() {
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState(null);
    const [confirmpassword, setConfirmPassword] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [bio, setBio] = useState("");
    const [isActive, setIsActive] = useState(false);

    const OPCIONES_FOTO_AVATAR = [
        ['https://static.vecteezy.com/system/resources/previews/019/896/012/original/female-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png', "avatar 1"],
        ['https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png', "avatar 2"],
        ['https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png', "avatar 3"],
        ['https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png', "avatar 4"],
        ['https://as1.ftcdn.net/v2/jpg/01/21/93/74/1000_F_121937450_E3o8jRG3mKbMaAFprSuNOlyrLraSVVua.jpg', "avatar 5"],
        ['https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg', "avatar 6"]
    ]

    const [isEditable, setIsEditable] = useState(false);
    
    useEffect(() => {
        async function fetchData() {
            const userToken = localStorage.getItem('userToken');
            const UserName = localStorage.getItem('username');
            const userId = localStorage.getItem('userId');
    
            try {
                const responseUsuarios = await getUserByUsername(userToken, UserName); // Obtener todos los datos del usuario
                const responsePerfil = await getProfileByID(userToken, userId); // Obtener el perfil del usuario
    
                if (responseUsuarios.status === 200 && responsePerfil.status === 200) {
                    const infoUser = responseUsuarios.data;
                    const infoProfile = responsePerfil.data;
    
                    setEmail(infoUser.email);
                    setNombre(infoUser.first_name);
                    setApellido(infoUser.last_name);
                    setNickname(infoUser.username);
                    setAvatarPreview(infoProfile.FotoOAvatar);
                    setBio(infoProfile.bio);
                    setIsActive(infoUser.is_active);
                } else {
                    console.error("No se pudo obtener la información del usuario o la contraseña.");
                }


            } catch (error) {
                console.error("Error:", error);
            }
        }
    
        fetchData();
    }, []);

    const navigate = useNavigate();  // Usa el hook useNavigate
    
    const handleUpdate = async (e) => {
        e.preventDefault();
      
        setIsEditable(!isEditable);
      
        if (isEditable) {
          const jsonDataUser = {
            username: nickname,
            email: email,
            first_name: nombre,
            last_name: apellido,
            password: password,
          };
      
          const jsonDataProfile = {
            username: nickname,
            bio: bio,
          };
      
          if (avatar) {
            jsonDataProfile.FotoOAvatar = avatar;
          }
      
          const localToken = localStorage.getItem('userToken');
      
          // Validación de contraseñas
          if (!validatePassword(password, confirmpassword)) {
            setPassword(null);
            setConfirmPassword(null);
            return; // Salir de la función si la validación de contraseña falla
          }
      
          try {
            const responseUsuario = await updateUserInfo(localToken, jsonDataUser);
            const responsePerfil = await updateProfileInfo(localToken, jsonDataProfile);
      
            console.log('Respuesta Usuario:', responseUsuario);
            console.log('Respuesta Perfil:', responsePerfil);
      
            if (responseUsuario.status === 200 && responsePerfil.status === 200) {
              const dataUsuario = responseUsuario.data;
              const dataPerfil = responsePerfil.data;
      
              setEmail(dataUsuario.username);
              setNombre(dataUsuario.first_name);
              setApellido(dataUsuario.last_name);
              setNickname(dataUsuario.Apodo);
              setAvatarPreview(dataPerfil.FotoOAvatar);
              setBio(dataPerfil.bio);
      
              alert('Información actualizada correctamente');
              window.location.reload();
            } else {
              console.error('No se pudo obtener la información del usuario o la contraseña.');
              alert('No se pudo obtener la información del usuario o la contraseña.');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar conectar con el servidor.');
            // window.location.reload()
          }
        }
      };
      
    

      const handleAvatarChange = (selectedValue) => {
        setAvatar(selectedValue);
        setAvatarPreview(selectedValue);
      };

    const handleCancel = (e) => {
        setIsEditable(false);
        setPassword(null);
        setConfirmPassword(null);
    }

    const handleDeactivateAccount = async () => {
        // Con un endpoint que maneje la desactivación de cuentas:
        const localToken = localStorage.getItem("userToken");
        const jsonDataUser = {
            username: nickname,
            is_active: 0//esto desactiva el usuario
          };
        try {
            const responseUsuario = await updateUserInfo(localToken, jsonDataUser);

            if (responseUsuario.status === 200) {
                alert("Cuenta desactivada correctamente");
                console.log('Usuario ha desactivado su cuenta, cerrando sesión...');
                localStorage.removeItem('userToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                navigate('/');
            } else {
                alert(responseUsuario.error || "Ocurrió un error al intentar desactivar la cuenta");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar conectar con el servidor.");
        }
    };

    var respuesta = null;

    if(localStorage.getItem('userToken') == null){
        respuesta = (
            <div style={{ display: 'flex'}}>usted no tiene permisos para ver esta pagina, por favor inicie sesion</div>
        )
    }else{
        respuesta = (
            <div style={{ display: 'flex'}}>
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
                                value={email || ''}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEditable}
                                style={{ marginTop: '10px' }}
                            />
                            <TextField
                                fullWidth
                                label="Nombre/s"
                                type="text"
                                value={nombre || ''}
                                onChange={(e) => setNombre(e.target.value)}
                                disabled={!isEditable}
                                style={{ marginTop: '10px' }}
                            />
                            <TextField
                                fullWidth
                                label="Apellido/s"
                                type="text"
                                value={apellido || ''}
                                onChange={(e) => setApellido(e.target.value)}
                                disabled={!isEditable}
                                style={{ marginTop: '10px' }}
                            />
                            <TextField
                                fullWidth
                                label="Apodo"
                                type="text"
                                value={nickname || ''}
                                onChange={(e) => setNickname(e.target.value)}
                                disabled={true}
                                style={{ marginTop: '10px' }}
                            />
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                value={password || ''}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={!isEditable}
                                style={{ marginTop: '10px', display: isEditable ? 'block' : 'none' }}
                            />
                            <TextField
                                fullWidth
                                label="Confirmar contraseña"
                                type="password"
                                value={confirmpassword || ''}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={!isEditable}
                                style={{ marginTop: '10px', display: isEditable ? 'block' : 'none' }}
                            />
                            
    
                        </Grid>
    
                        {/* Columna derecha */}
                        <Grid item xs={12} md={6} container direction="column" alignItems="center" justifyContent="flex-start">
                            <div style={{ width: '150px', height: '150px', marginBottom: '20px' }}>
                                {avatarPreview ? <img src={avatarPreview} alt="Avatar Preview" style={{ maxWidth: '100%', maxHeight: '100%' , borderRadius: '50%'}} /> : "No image uploaded"}
                            </div>
                            <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px', marginTop: '16px' }}>
                                <InputLabel>Seleccionar Avatar</InputLabel>
                                <Select
                                disabled={!isEditable}
                                value={avatarPreview}
                                onChange={(e) => handleAvatarChange(e.target.value)}
                                label="Seleccionar Avatar"
                                renderValue={(selected) => {
                                    const selectedOption = OPCIONES_FOTO_AVATAR.find((option) => option[0] === selected);
                                    return (
                                    <>
                                        {selectedOption && (
                                        <>
                                            <img
                                            src={selectedOption[0]}
                                            alt={`Avatar ${selectedOption[1]}`}
                                            style={{ width: '30px', height: '30px', marginRight: '8px', borderRadius: '50%' }}
                                            />
                                            {`  ${selectedOption[1]}`}
                                        </>
                                        )}
                                    </>
                                    );
                                }}
                                >
                                {OPCIONES_FOTO_AVATAR.map((option) => (
                                    <MenuItem key={option[1]} value={option[0]}>
                                    <>
                                        <img
                                        src={option[0]}
                                        alt={`Avatar ${option[1]}`}
                                        style={{ width: '30px', height: '30px', marginRight: '8px', borderRadius: '50%' }}
                                        />
                                        {`Opción número ${option[1]}`}
                                    </>
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Bio"
                                multiline
                                minRows={3}
                                value={bio || ''}
                                onChange={(e) => setBio(e.target.value)}
                                disabled={!isEditable}
                                fullWidth
                                style={{
                                    marginTop: '10px',
                                    marginBottom: '10px',
                                }}
                            />
                        </Grid>
                    </Grid>
                    {/* Contenedor de botones */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', paddingLeft: '35px', paddingRight: '35px' }}>
                        {/* Botones Aceptar y Cancelar */}
                        <div style={{ display: 'flex', whiteSpace: 'nowrap', width: 'auto' }}>
                            <Button className="button-info" variant="contained" onClick={handleUpdate} style={{ marginTop: '10px', marginRight: '35px', whiteSpace: 'nowrap', width: 'auto' }}>
                            {isEditable ? 'Enviar datos' : 'Actualizar datos'}
                            </Button>
                            <Button
                            className="button-info"
                            variant="contained"
                            onClick={handleCancel}
                            disabled={!isEditable}
                            style={{ marginTop: '10px', display: isEditable ? 'block' : 'none', whiteSpace: 'nowrap', width: 'auto' }}
                            >
                            Cancelar
                            </Button>
                        </div>

                        {/* Botón Desactivar cuenta */}
                        <Button className="button-info" variant="contained" color="secondary" onClick={handleDeactivateAccount} style={{ marginTop: '10px', whiteSpace: 'nowrap', width: 'auto' }}>
                            Desactivar cuenta
                        </Button>
                        </div>
                </div>
            </div>
        );
    }


    return(respuesta);

}
export default UserInformation;