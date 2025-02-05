import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Fondo } from '../components/FondoCirculos';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Button, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PreguntasScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { usuario, email, contraseña } = route.params || {};

    const [edad, setEdad] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [fechaUltimoCiclo, setFechaUltimoCiclo] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errorEdad, setErrorEdad] = useState('');
    const [errorPeso, setErrorPeso] = useState('');
    const [errorAltura, setErrorAltura] = useState('');
    const [errorFechaUltimoCiclo, setErrorFechaUltimoCiclo] = useState('');

    const handleNext = () => {
        let isValid = true;

        // Reiniciar errores
        setErrorEdad('');
        setErrorPeso('');
        setErrorAltura('');
        setErrorFechaUltimoCiclo('');

        // Validar edad
        const edadNum = parseInt(edad, 10);
        if (!edad || isNaN(edadNum) || edadNum < 12 || edadNum > 60) {
            setErrorEdad('Por favor, introduce una edad entre 12 y 60.');
            isValid = false;
        }

        // Validar peso
        const pesoNum = parseFloat(peso);
        if (!peso || isNaN(pesoNum) || pesoNum <= 35 || pesoNum > 200) {
            setErrorPeso('Por favor, introduce un peso entre 35 y 200.');
            isValid = false;
        }

        // Validar altura con el formato correcto (ej. 1.60)
        const alturaRegex = /^(?!0(\.0+)?$)(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/; // Altura válida en formato decimal
        if (!altura || !alturaRegex.test(altura)) {
            setErrorAltura('Por favor, introduce una altura válida en formato decimal (Ej. 1.60).');
            isValid = false;
        }

        // Validar fecha del último ciclo
        if (!fechaUltimoCiclo) {
            setErrorFechaUltimoCiclo('Por favor, selecciona una fecha válida.');
            isValid = false;
        }

        if (isValid) {
            navigation.navigate('PreguntasScreen2', { usuario, email, contraseña, edad, peso, altura, fechaUltimoCiclo: fechaUltimoCiclo.toISOString().split('T')[0] });
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || fechaUltimoCiclo;
        setShowDatePicker(Platform.OS === 'ios');
        setFechaUltimoCiclo(currentDate);
    };

    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />
            <Text style={globalStyles.titulo}>Antes de comenzar...</Text>

            {/* Campo Edad */}
            <Text style={globalStyles.textoBase}>¿Qué edad tienes?</Text>
            <TextInput
                style={[styles.input, errorEdad ? styles.inputError : null]}
                placeholder="Introduce tu edad (Ej. 30)"
                placeholderTextColor="#FABDC9"
                value={edad}
                onChangeText={setEdad}
            />
            {errorEdad ? <Text style={styles.error}>{errorEdad}</Text> : null}

            {/* Campo Peso */}
            <Text style={globalStyles.textoBase}>¿Cuánto pesas?</Text>
            <TextInput
                style={[styles.input, errorPeso ? styles.inputError : null]}
                placeholder="Introduce tu peso (Ej. 50)"
                placeholderTextColor="#FABDC9"
                value={peso}
                onChangeText={setPeso}
            />
            {errorPeso ? <Text style={styles.error}>{errorPeso}</Text> : null}

            {/* Campo Altura */}
            <Text style={globalStyles.textoBase}>¿Cuánto mides?</Text>
            <TextInput
                style={[styles.input, errorAltura ? styles.inputError : null]}
                placeholder="Introduce tu altura (Ej. 1.60)"
                placeholderTextColor="#FABDC9"
                value={altura}
                onChangeText={setAltura}
            />
            {errorAltura ? <Text style={styles.error}>{errorAltura}</Text> : null}

            {/* Campo Fecha del último ciclo */}
            <Text style={globalStyles.textoBase}>¿Cuándo fue tu último ciclo?</Text>
            
            <DateTimePicker
                    value={fechaUltimoCiclo}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
            />
            {errorFechaUltimoCiclo ? <Text style={styles.error}>{errorFechaUltimoCiclo}</Text> : null}

            {/* Botón Siguiente */}
            <TouchableHighlight
                style={styles.boton}
                underlayColor="#FF9AAD"
                onPress={handleNext}
            >
                <Text style={globalStyles.textoBoton}>SIGUIENTE</Text>
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
        marginTop: 0,
        padding: 10,
        paddingStart: 20,
        fontWeight: 'bold',
    },
    inputError: {
        borderColor: 'red',
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
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
        width: '80%',
        textAlign: 'left',
    },
});