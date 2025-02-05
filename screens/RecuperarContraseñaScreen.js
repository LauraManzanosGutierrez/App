import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react'; // Importar useState desde React
import { Fondo } from '../components/FondoCirculos';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importar navegación
import { globalStyles } from '../styles/globalStyles'; // Importar estilos globales
import axios from 'axios'; // Importar axios para hacer la solicitud POST
import CryptoJS from 'crypto-js'; // Importar crypto-js para codificar la contraseña
import Url from '../components/Url';

export default function RecuperarContraseñaScreen() {
    const navigation = useNavigation(); // Hook para la navegación

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorRepeatPassword, setErrorRepeatPassword] = useState('');

    // Función para recuperar la contraseña
    const recuperarContraseña = async () => {
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
                await axios.post(`${Url.apiUrl}/contraseña`, { email, contraseña: newPasswordCodificada });
                navigation.navigate('LoginScreen'); // Navegar a la pantalla de inicio de sesión (LoginScreen)
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
            <Text style={globalStyles.titulo}>Recuperar contraseña</Text>
            <Text style={globalStyles.subtitulo}>Recupera tu contraseña</Text>

            {/* Campos de entrada con nuevo color de placeholder */}
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#FABDC9"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Introduce tu nueva contraseña"
                placeholderTextColor="#FABDC9"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
            />
            {errorPassword ? <Text style={styles.error}>{errorPassword}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Repite la nueva contraseña"
                placeholderTextColor="#FABDC9"
                secureTextEntry={true}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
            />
            {errorRepeatPassword ? <Text style={styles.error}>{errorRepeatPassword}</Text> : null}

            <TouchableHighlight
                style={styles.boton}
                underlayColor="#FF9AAD"
                onPress={recuperarContraseña}
            >
                <Text style={globalStyles.textoBoton}>RECUPERAR CONTRASEÑA</Text>
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
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
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