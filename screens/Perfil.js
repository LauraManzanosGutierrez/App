// filepath: /c:/Users/laura/OneDrive - Universidad Europea Miguel de Cervantes/Universidad/UEMC/4º/TFG/AppTFG/App/screens/Perfil.js
import { StyleSheet, Text, View, TouchableHighlight, TextInput, TouchableOpacity } from 'react-native'; 
import Fondo from '../components/FondoPerfil';
import { globalStyles } from '../styles/globalStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { homeStyle } from '../styles/homeStyle';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importar iconos
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importar axios para hacer la solicitud GET y PUT
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import Url from '../components/Url';

export default function Perfil() {
    const navigation = useNavigation(); // Hook para la navegación
    const route = useRoute(); // Hook para obtener los parámetros de la ruta
    const { userId } = route.params; // Obtener el ID del usuario de los parámetros de la ruta

    // Estado para controlar la edición de los campos
    const [editable, setEditable] = useState(false);
    const [userData, setUserData] = useState({
        usuario: '',
        nombre: '',
        apellidos: '',
        email: ''
    });

    useEffect(() => {
        obtenerDatosUsuario(); // Llamar a la función para obtener los datos del usuario
    }, []);

    const obtenerDatosUsuario = async () => {
        try {
            const response = await axios.get(`${Url.apiUrl}/usuarios/${userId}`);
            setUserData(response.data.usuario); // Asignar los datos del usuario al estado
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    };

    // Función para cambiar el estado de edición
    const toggleEdit = () => {
        setEditable(!editable);
    };

    // Función para guardar los cambios
    const saveChanges = async () => {
        try {
            await axios.put(`${Url.apiUrl}/usuarios/${userId}`, userData);
            
            setEditable(false); // Desactivar la edición después de guardar
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token'); // Eliminar el token de AsyncStorage
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            }); // Navegar a la pantalla de inicio de sesión y resetear la navegación
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Función para eliminar la cuenta
    const eliminarCuenta = async () => {
        try {
            await axios.put(`${Url.apiUrl}/estado/${userId}`, { estado: 0 });
            await logout();
            
        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
            
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

            {/* Botón de cerrar sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Icon name="logout" size={30} color="#FF758F" />
            </TouchableOpacity>

            {/* Botón de eliminar cuenta */}
            <TouchableOpacity style={styles.deleteButton} onPress={eliminarCuenta}>
                <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
            </TouchableOpacity>

            {/* Campos de entrada */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    placeholderTextColor="#FABDC9"
                    editable={editable}
                    value={userData.usuario}
                    onChangeText={(text) => setUserData({ ...userData, usuario: text })}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="#FABDC9"
                    editable={editable}
                    value={userData.nombre}
                    onChangeText={(text) => setUserData({ ...userData, nombre: text })}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Apellidos"
                    placeholderTextColor="#FABDC9"
                    editable={editable}
                    value={userData.apellidos}
                    onChangeText={(text) => setUserData({ ...userData, apellidos: text })}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#FABDC9"
                    editable={editable}
                    value={userData.email}
                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                />
            </View>

            <View style={styles.row}>
                <Text style={globalStyles.subtitulo}>Editar claves de acceso</Text>
                <Text 
                    style={styles.enlaceFormulario} 
                    onPress={() => navigation.navigate('EditarContraseña', { userId })} // Navegar a EditarContraseña
                >
                    Aquí
                </Text>
            </View>
            
            {/* Botón de editar */}
            <TouchableHighlight
                style={styles.boton}
                underlayColor="#FF9AAD"
                onPress={toggleEdit}
            >
                <Text style={globalStyles.textoBoton}>{editable ? 'CANCELAR' : 'EDITAR'}</Text>
            </TouchableHighlight>

            {/* Botón de guardar */}
            {editable && (
                <TouchableHighlight
                    style={styles.boton}
                    underlayColor="#FF9AAD"
                    onPress={saveChanges}
                    
                >
                    <Text style={globalStyles.textoBoton}>GUARDAR</Text>
                    
                </TouchableHighlight>
            )}

            
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 30,
        marginTop: 30,
        paddingHorizontal: 10,
        width: '80%',
        height: 40,
    },
    input: {
        flex: 1,
        color: '#333',
        fontWeight: 'bold',
        paddingStart: 10,
    },
    boton: {
        borderWidth: 1,
        borderColor: '#FF758F',
        backgroundColor: '#FF758F',
        width: '80%',
        height: 40,
        borderRadius: 30,
        marginTop: 30,
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
    profileCircle: {
        alignSelf: 'center',
        backgroundColor: '#FFF0F3',
        marginTop: 30,
        marginBottom: 50,
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cameraButton: {
        position: 'absolute',
        top: 150,
        right: 5,
        backgroundColor: '#FFF0F3',
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF758F',
    },
    logoutButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: '#FFF0F3',
        borderRadius: 30,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF758F',
    },
    deleteButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: '#FFF0F3',
        borderRadius: 30,
        width: 120,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF758F',
    },
    deleteButtonText: {
        color: '#FF758F',
        fontWeight: 'bold',
    }
});