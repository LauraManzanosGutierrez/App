import { StatusBar } from 'expo-status-bar';
import { Fondo } from '../components/FondoCirculos';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import React, { useState } from 'react';
import CryptoJS from 'crypto-js'; // Importar crypto-js

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [errorUsuario, setErrorUsuario] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorContraseña, setErrorContraseña] = useState('');

    const handleRegister = () => {
        let isValid = true;

        // Resetear errores
        setErrorUsuario('');
        setErrorEmail('');
        setErrorContraseña('');

        // Validar Usuario
        if (!usuario.trim()) {
            setErrorUsuario('El nombre de usuario no puede estar vacío.');
            isValid = false;
        }

        // Validar Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            setErrorEmail('Por favor, introduce un correo electrónico válido.');
            isValid = false;
        }

        // Validar Contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // Al menos una mayúscula, un número y 6 caracteres
        if (!contraseña || !passwordRegex.test(contraseña)) {
            setErrorContraseña(
                'La contraseña debe tener al menos 6 caracteres, una letra mayúscula y un número.'
            );
            isValid = false;
        }

        if (isValid) {
            // Codificar la contraseña con SHA-256
            const contraseñaCodificada = CryptoJS.SHA256(contraseña).toString();

            // Navegar a la siguiente pantalla con los datos del usuario
            navigation.navigate('PreguntasScreen', { usuario, email, contraseña: contraseñaCodificada });
        }
    };

    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />
            <Text style={globalStyles.titulo}>Regístrate</Text>
            <Text style={globalStyles.subtitulo}>Aprende sobre ti con nosotros</Text>

            {/* Campo Usuario */}
            <TextInput
                style={styles.input}
                placeholder="Usuario"
                placeholderTextColor="#FABDC9"
                value={usuario}
                onChangeText={setUsuario}
            />
            {errorUsuario ? <Text style={styles.error}>{errorUsuario}</Text> : null}

            {/* Campo Correo Electrónico */}
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#FABDC9"
                value={email}
                onChangeText={setEmail}
            />
            {errorEmail ? <Text style={styles.error}>{errorEmail}</Text> : null}

            {/* Campo Contraseña */}
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#FABDC9"
                secureTextEntry={true}
                value={contraseña}
                onChangeText={setContraseña}
            />
            {errorContraseña ? <Text style={styles.error}>{errorContraseña}</Text> : null}

            {/* Botón Registrarse */}
            <TouchableHighlight
                style={styles.boton}
                underlayColor="#FF9AAD"
                onPress={handleRegister}
            >
                <Text style={globalStyles.textoBoton}>REGISTRARSE</Text>
            </TouchableHighlight>

            <View style={styles.row}>
                <Text style={globalStyles.subtitulo}>¿Ya tienes una cuenta?</Text>
                <Text
                    style={globalStyles.enlaceFormulario}
                    onPress={() => navigation.navigate('LoginScreen')}
                >
                    Inicia Sesión
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
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginBottom: -15,
        width: '80%',
        textAlign: 'left',
    },
});