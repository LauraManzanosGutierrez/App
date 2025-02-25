import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Fondo } from '../components/FondoCirculos';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import RadioGroup from 'react-native-radio-buttons-group';
import Url from '../components/Url';

export default function PreguntasScreen2() {
    const navigation = useNavigation();
    const route = useRoute();
    const { usuario, email, contraseña, edad, peso, altura, fechaUltimoCiclo } = route.params || {}; // Asegurarse de que los parámetros existen
    const [deporte, setDeporte] = useState('0');
    const [sueno, setSueno] = useState('0');
    const [estres, setEstres] = useState('0');

    const deporteOptions = [
        { id: '0', label: 'Nada', value: '0', color: '#FF758F' },
        { id: '1', label: 'Moderado', value: '1', color: '#FF758F' },
        { id: '2', label: 'Frecuente', value: '2', color: '#FF758F' },
        { id: '3', label: 'Extremo', value: '3', color: '#FF758F' },
    ];

    const suenoOptions = [
        { id: '0', label: 'Mal', value: '0', color: '#FF758F' },
        { id: '1', label: 'Bien', value: '1', color: '#FF758F' },
    ];

    const estresOptions = [
        { id: '0', label: 'Nada', value: '0', color: '#FF758F' },
        { id: '1', label: 'Poco', value: '1', color: '#FF758F' },
        { id: '2', label: 'Mucho', value: '2', color: '#FF758F' },
    ];

    const handleRegister = async () => {
        const usuarioCompleto = {
            usuario,
            email,
            contraseña,
            edad: parseInt(edad),
            peso: parseFloat(peso),
            altura: parseFloat(altura),
            fechaUltimoCiclo,
            deporte: parseInt(deporte),
            estres: parseInt(estres),
            sueño: parseInt(sueno),
        };
    
        try {
            // Enviar datos al servidor Flask para predecir
            const respuestaPrediccion = await fetch('http://192.168.1.137:5000/predecir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: usuarioCompleto.usuario,
                    edad: usuarioCompleto.edad,
                    peso: usuarioCompleto.peso,
                    altura: usuarioCompleto.altura,
                    deporte: usuarioCompleto.deporte,
                    estres: usuarioCompleto.estres,
                    sueño: usuarioCompleto.sueño,
                }),
            });
    
            if (!respuestaPrediccion.ok) {
                throw new Error(`Error en la predicción: ${respuestaPrediccion.status} - ${respuestaPrediccion.statusText}`);
            }
    
            const predicciones = await respuestaPrediccion.json();
    
            // Agregar las predicciones al objeto usuarioCompleto
            usuarioCompleto.duracionCiclo = predicciones.duracionCiclo;
            usuarioCompleto.duracionPeriodo = predicciones.duracionPeriodo;
    
            // Enviar los datos completos al servidor de usuarios
            const respuestaUsuario = await fetch(`${Url.apiUrl}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuarioCompleto),
            });
    
            if (!respuestaUsuario.ok) {
                throw new Error(`Error en la petición: ${respuestaUsuario.status} - ${respuestaUsuario.statusText}`);
            }
    
            const resultado = await respuestaUsuario.json();
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error('ERROR', error);
        }
    };

    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />
            <Text style={globalStyles.titulo}>Antes de comenzar...</Text>

            <Text style={globalStyles.textoBase}>¿Cuánto deporte practicas?</Text>
            <View style={styles.radioGroupGrid}>
                <RadioGroup
                    radioButtons={deporteOptions.slice(0, 2)}
                    onPress={setDeporte}
                    selectedId={deporte}
                    containerStyle={styles.radioGroupHorizontal}
                />
                <RadioGroup
                    radioButtons={deporteOptions.slice(2, 4)}
                    onPress={setDeporte}
                    selectedId={deporte}
                    containerStyle={styles.radioGroupHorizontal}
                />
            </View>

            <Text style={globalStyles.textoBase}>¿Consideras que duermes bien o mal?</Text>
            <RadioGroup
                radioButtons={suenoOptions}
                onPress={setSueno}
                selectedId={sueno}
                containerStyle={styles.radioGroupHorizontal}
            />

            <Text style={globalStyles.textoBase}>¿Cuánto estrés has tenido?</Text>
            <RadioGroup
                radioButtons={estresOptions}
                onPress={setEstres}
                selectedId={estres}
                containerStyle={styles.radioGroupHorizontal}
            />

            <TouchableHighlight
                style={styles.boton}
                underlayColor="#FF9AAD"
                onPress={handleRegister}
            >
                <Text style={globalStyles.textoBoton}>FIN</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    radioGroupHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    radioGroupGrid: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boton: {
        borderWidth: 1,
        borderColor: '#FF758F',
        backgroundColor: '#FF758F',
        width: '80%',
        height: 40,
        borderRadius: 30,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});