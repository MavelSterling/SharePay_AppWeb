import React, { useState } from 'react';
import Sidebar from './Sidebar';

function UserInformation() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();
        console.log('Actualizando información:', email, fullName, nickname, avatar);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const previewURL = URL.createObjectURL(file);
            setAvatarPreview(previewURL);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2>Información del usuario</h2>
                <form onSubmit={handleUpdate} style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between' }}>
                    
                    {/* Columna izquierda */}
                    <div>
                        <div style={{ margin: '15px 0' }}>
                            <label>Correo electrónico:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', width: '100%', padding: '5px' }} />
                        </div>
                        <div style={{ margin: '15px 0' }}>
                            <label>Nombre completo:</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ display: 'block', width: '100%', padding: '5px' }} />
                        </div>
                        <div style={{ margin: '10px 0' }}>
                            <label>Apodo:</label>
                            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{ display: 'block', width: '100%', padding: '5px' }} />
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '200px' }}>
                        <div style={{ width: '150px', height: '150px', border: '1px solid black', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {avatarPreview ? <img src={avatarPreview} alt="Avatar Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : "Vista previa no disponible"}
                        </div>
                        <input accept="image/*" style={{ display: 'none' }} id="avatar-upload" type="file" onChange={handleAvatarChange} />
                        <label htmlFor="avatar-upload"><button style={{ cursor: 'pointer' }}>Subir Avatar</button></label>
                    </div>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginTop: '20px' }}>
                    <button type="submit" onClick={handleUpdate}>Actualizar información</button>
                    <button onClick={() => { /* Lógica para desactivar cuenta */ }}>Desactivar cuenta</button>
                </div>
            </div>
        </div>
    );
}

export default UserInformation;
