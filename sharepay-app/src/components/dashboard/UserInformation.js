import React, { useState } from 'react';
import Sidebar from './Sidebar';

function UserInformation() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        const userToken = localStorage.getItem("userToken");

        const formData = new FormData();
        formData.append('email', email);
        formData.append('full_name', fullName);
        formData.append('nickname', nickname);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await fetch('http://tu-dominio.com/api/updateUserInfo/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`
                },
                body: formData
            });

            const data = await response.json();

            // Aquí puedes manejar la respuesta del servidor, por ejemplo:
            if (response.ok) {
                alert("Información actualizada correctamente");
            } else {
                alert(data.error || "Ocurrió un error al actualizar la información");
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
        // Suponiendo que tengas una endpoint que maneje la desactivación de cuentas:
        const userToken = localStorage.getItem("userToken");
        try {
            const response = await fetch('http://tu-dominio.com/api/deactivateAccount/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cuenta desactivada correctamente");
                // Aquí podrías redirigir al usuario a la página de inicio o hacer log out
            } else {
                alert(data.error || "Ocurrió un error al intentar desactivar la cuenta");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar conectar con el servidor.");
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <h2>Información del usuario</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px' }}>
                    {/* Columna izquierda */}
                    <div>
                        <div style={{ margin: '10px 0' }}>
                            <label>
                                Correo electrónico:
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                />
                            </label>
                        </div>
                        <div style={{ margin: '10px 0' }}>
                            <label>
                                Nombre completo:
                                <input 
                                    type="text" 
                                    value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)} 
                                    style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                />
                            </label>
                        </div>
                        <div style={{ margin: '10px 0' }}>
                            <label>
                                Apodo:
                                <input 
                                    type="text" 
                                    value={nickname} 
                                    onChange={(e) => setNickname(e.target.value)} 
                                    style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '200px' }}>
                        <div style={{ width: '150px', height: '150px', border: '1px solid black', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                            <button style={{ cursor: 'pointer' }}>
                                Subir Avatar</button>
                        </label>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginTop: '20px' }}>
                    <button type="submit" onClick={handleUpdate}>Actualizar información</button>
                    <button onClick={handleDeactivateAccount}>
                        Desactivar cuenta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserInformation;
