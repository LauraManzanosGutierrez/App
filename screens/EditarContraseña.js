import { StyleSheet, Text, View, TouchableHighlight, TextInput, TouchableOpacity, Alert } from 'react-native'; 
import Fondo from '../components/FondoPerfil';
import Url from '../components/Url';
import { globalStyles } from '../styles/globalStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import React, { useState } from 'react';
import axios from 'axios'; 
import CryptoJS from 'crypto-js'; 

export default function EditarContraseña() {
    const navigation = useNavigation(); // Hook para la navegación
    const route = useRoute(); // Hook para obtener los parámetros de la ruta
    const { userId } = route.params; // Obtener el ID del usuario de los parámetros de la ruta

    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorRepeatPassword, setErrorRepeatPassword] = useState('');

    // Función para guardar los cambios
    const saveChanges = async () => {
        let isValid = true;

        // Resetear errores
        setErrorPassword('');
        setErrorRepeatPassword('');

        if (!newPassword) {
            setErrorPassword('La nueva contraseña no puede estar vacía');
            isValid = false;
        }

        // Validar la nueva contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Al menos una mayúscula, un número y 8 caracteres
        if (!passwordRegex.test(newPassword)) {
            setErrorPassword('La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.');
            isValid = false;
        }

        // Verificar que las contraseñas coincidan
        if (newPassword !== repeatPassword) {
            setErrorRepeatPassword('Las contraseñas no coinciden.');
            isValid = false;
        }

        if (isValid) {
            // Codificar la nueva contraseña con SHA-256
            const newPasswordCodificada = CryptoJS.SHA256(newPassword).toString();
            

            try {
                await axios.put(`${Url.apiUrl}/usuarios/${userId}`, { contraseña: newPasswordCodificada });
                Alert.alert('Éxito', 'Contraseña actualizada correctamente');
                navigation.navigate('Home', { userId }); // Navegar a la pantalla de inicio (Home) con el userId
            } catch (error) {
                console.error('Error al actualizar la contraseña:', error);
                Alert.alert('Error', 'Hubo un problema al actualizar la contraseña');
            }
        }
    };

    return (
        <View style={globalStyles.container}>
            {/* Componente Fondo superpuesto */}
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />

            {/* Círculo con icono de perfil */}
            <View style={styles.profileCircle}>
                <Icon name="account-circle" size={80} color="#FF758F" />
                {/* Botón de cámara en la esquina del círculo */}
                <TouchableOpacity style={styles.cameraButton}>
                    <Icon name="camera-alt" size={30} color="#FF758F" />
                </TouchableOpacity>
            </View>

            {/* Texto encima de los campos de entrada */}
            <Text style={styles.editText}>Editar claves de acceso</Text>

            {/* Campos de entrada para las claves */}
            <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                placeholderTextColor="#FABDC9"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
            />
            {errorPassword ? <Text style={styles.error}>{errorPassword}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Repetir nueva contraseña"
                placeholderTextColor="#FABDC9"
                secureTextEntry={true}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
            />
            {errorRepeatPassword ? <Text style={styles.error}>{errorRepeatPassword}</Text> : null}
                        
            <TouchableHighlight
                style={styles.boton}
                underlayColor="#FF9AAD"
                onPress={saveChanges}
            >
                <Text style={globalStyles.textoBoton}>GUARDAR</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'white',
        color: '#333',
        width: '80%',
        height: 40,
        borderRadius: 30,
        marginTop: 30,
        padding: 10,
        paddingStart: 20,
        fontWeight: 'bold',
    },
    boton: {
        borderWidth: 1,
        borderColor: '#FF758F',
        backgroundColor: '#FF758F',
        width: '80%',
        height: 40,
        borderRadius: 30,
        marginTop: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    enlaceFormulario: {
        fontSize: 13,
        color: '#FF758F',
        fontWeight: 'bold',
    },
    // Estilo para el círculo de perfil
    profileCircle: {
        alignSelf: 'center',
        backgroundColor: '#FFF0F3', // Color de fondo del círculo
        marginTop: -80,
        marginBottom: 70,
        width: 200, // Ancho del círculo
        height: 200, // Alto del círculo
        borderRadius: 100, // Para hacerlo circular
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Necesario para la posición absoluta del botón
    },
    // Estilo para el botón de la cámara
    cameraButton: {
        position: 'absolute', // Posiciona el botón de la cámara de forma absoluta dentro del círculo
        top: 150, // Ajusta la distancia desde la parte superior
        right: 5, // Ajusta la distancia desde la parte derecha
        backgroundColor: '#FFF0F3', // Color de fondo del botón
        borderRadius: 30, // Hace el botón circular
        width: 50, // Ancho del botón
        height: 50, // Alto del botón
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2, // Ancho del borde
        borderColor: '#FF758F', // Color del borde (puedes cambiarlo a cualquier color que prefieras)
    },
    // Estilo para el texto "Editar claves de acceso"
    editText: {
        color: '#FF758F', // Color rosa oscuro
        fontSize: 30, // Tamaño de la fuente
        fontWeight: 'bold', // Hacerlo negrita
        marginTop: 20, // Separación del círculo
        marginBottom: 10, // Separación de los inputs
        textAlign: 'center', // Centrado
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginBottom: -15,
        width: '80%',
        textAlign: 'left',
    },
});