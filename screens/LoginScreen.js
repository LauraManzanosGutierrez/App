import React, { useState } from 'react';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { Fondo } from '../components/FondoCirculos';
import Url from '../components/Url';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import jwt_decode from 'jwt-decode'; // Importar jwt-decode para decodificar el token
import CryptoJS from 'crypto-js'; // Importar crypto-js para codificar la contraseña

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        // Codificar la contraseña con SHA-256
        const passwordCodificada = CryptoJS.SHA256(password).toString();

        try {
            const response = await axios.post(`${Url.apiUrl}/login`, {
                email: email,
                contraseña: passwordCodificada
            });

            const { token, error, code } = response.data;
            if (token) {
                // Guardar el token en el almacenamiento local
                await AsyncStorage.setItem('token', token);
                const decodedToken = jwt_decode(token);
                const userId = decodedToken.sub; // Obtener el ID del usuario del token decodificado
                
                navigation.navigate('Home', { userId }); // Pasar el ID del usuario a Home.js
            } else if (code === 'USER_NOT_EXIST') {
                Alert.alert('Lo siento', 'Este usuario ya no existe');
            } else if (code === 'INVALID_CREDENTIALS') {
                Alert.alert('Error', 'Credenciales inválidas');
            } else {
                Alert.alert('Error', 'Ocurrió un error inesperado');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Ocurrió un error inesperado');
        }
    };

    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />
            <Text style={globalStyles.titulo}>Inicia sesión</Text>
            <Text style={globalStyles.subtitulo}>Inicia sesión con nosotros</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#FABDC9"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#FABDC9"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableHighlight
                style={styles.boton}
                underlayColor="#FF9AAD"
                onPress={handleLogin}
            >
                <Text style={globalStyles.textoBoton}>INICIAR SESIÓN</Text>
            </TouchableHighlight>
            <View style={styles.row}>
                <Text style={globalStyles.subtitulo}>¿No tienes una cuenta?</Text>
                <Text
                    style={styles.enlaceFormulario}
                    onPress={() => navigation.navigate('RegisterScreen')}
                >
                    Regístrate
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={globalStyles.subtitulo}>¿Has olvidado tu contraseña?</Text>
                <Text
                    style={styles.enlaceFormulario}
                    onPress={() => navigation.navigate('RecuperarContraseñaScreen')}
                >
                    Recuperar contraseña
                </Text>
            </View>
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
});