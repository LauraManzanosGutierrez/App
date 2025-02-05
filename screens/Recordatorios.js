import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export default function Notificaciones() {
    const navigation = useNavigation();

    // Estado para los valores del formulario
    const [titulo, setTitulo] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [hora, setHora] = useState(new Date());

    // Estado para los recordatorios
    const [recordatorios, setRecordatorios] = useState([]);

    // Función para pedir permisos para las notificaciones
    const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permiso de notificación no otorgado');
        }
    };

    useEffect(() => {
        requestPermissions(); // Llama a la función al cargar el componente
    }, []);

    // Función para guardar el recordatorio
    const guardarRecordatorio = () => {
        if (!titulo || !fecha || !hora) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const nuevoRecordatorio = { titulo, fecha, hora };
        setRecordatorios([...recordatorios, nuevoRecordatorio]); // Agrega el nuevo recordatorio al estado
        setTitulo(''); // Limpia el campo de título después de guardar

        // Enviar la notificación
        enviarNotificacion(nuevoRecordatorio);
    };

    // Función para enviar la notificación en la fecha y hora del recordatorio
    const enviarNotificacion = async (recordatorio) => {
        // Combina la fecha y hora seleccionadas
        const fechaHoraNotificacion = new Date(recordatorio.fecha);
        fechaHoraNotificacion.setHours(recordatorio.hora.getHours());
        fechaHoraNotificacion.setMinutes(recordatorio.hora.getMinutes());
        fechaHoraNotificacion.setSeconds(0);

        // Si la fecha y hora ya han pasado, no se envía la notificación
        if (fechaHoraNotificacion < new Date()) {
            alert("La fecha y hora deben ser futuras.");
            return;
        }

        // Configuración de la notificación
        const localNotification = {
            content: {
                title: recordatorio.titulo,
                body: `Recordatorio para el ${recordatorio.fecha.toLocaleDateString()} a las ${recordatorio.hora.toLocaleTimeString()}`,
            },
            trigger: {
                date: fechaHoraNotificacion, // La notificación se activa en la fecha y hora del recordatorio
            },
        };

        // Programar la notificación
        await Notifications.scheduleNotificationAsync(localNotification);
    };

    return (
        <View style={globalStyles.container}>
            <StatusBar style="light" />

            <Text style={globalStyles.titulo}>Programar...</Text>

            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.boton, { backgroundColor: '#FFB6C1' }]}
                    onPress={() => navigation.navigate('Notificaciones')}
                >
                    <Text style={globalStyles.textoBoton}>NOTIFICACIONES</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.boton, { backgroundColor: '#FF758F' }]}
                    onPress={() => navigation.navigate('Recordatorios')}
                >
                    <Text style={globalStyles.textoBoton}>RECORDATORIOS</Text>
                </TouchableOpacity>
            </View>

            {/* Título del recordatorio */}
            <Text style={styles.text}>Título:</Text>
            <TextInput
                style={styles.input}
                placeholder="Título del Recordatorio"
                value={titulo}
                onChangeText={setTitulo}
            />

            {/* Selector de fecha y hora */}
            <View style={styles.dateTimeRow}>
                <View style={styles.datePicker}>
                    <Text style={styles.text}>Fecha:</Text>
                    <DateTimePicker
                        value={fecha}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => setFecha(selectedDate || fecha)}
                    />
                </View>
                <View style={styles.datePicker}>
                    <Text style={styles.text}>Hora:</Text>
                    <DateTimePicker
                        value={hora}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => setHora(selectedTime || hora)}
                    />
                </View>
            </View>

            {/* Botón para guardar */}
            <TouchableOpacity
                style={styles.botonGuardar}
                onPress={guardarRecordatorio}
            >
                <Text style={globalStyles.textoBoton}>GUARDAR</Text>
            </TouchableOpacity>

            {/* Sección para mostrar los recordatorios creados */}
            <View style={styles.recordatoriosContainer}>
                <Text style={styles.text}>Recordatorios:</Text>
                <FlatList
                    data={recordatorios} // Muestra todos los recordatorios
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.recordatorio}>
                            <Text style={styles.recordatorioText}>{item.titulo}</Text>
                            <Text style={styles.recordatorioText}>
                                {item.fecha.toLocaleDateString()} - {item.hora.toLocaleTimeString()}
                            </Text>
                        </View>
                    )}
                    // Habilita el desplazamiento vertical
                    style={styles.recordatorioList}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 30,
        backgroundColor: '#fff',
        paddingLeft: 10,
    },
    text: {
        fontSize: 16,
        color: '#FF758F',
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    botonGuardar: {
        borderWidth: 1,
        borderColor: '#FF758F',
        backgroundColor: '#FF758F',
        width: '80%',
        height: 40,
        borderRadius: 30,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boton: {
        borderWidth: 1,
        borderColor: '#FF758F',
        width: '36%',
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    dateTimeRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    datePicker: {
        width: '45%',
        alignItems: 'center',
    },
    recordatoriosContainer: {
        marginTop: 30,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
    },
    recordatorio: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#FFEBEE',
        borderRadius: 8,
        borderColor: '#FF758F',
        borderWidth: 1,
    },
    recordatorioText: {
        fontSize: 14,
        color: '#FF758F',
    },
    recordatorioList: {
        maxHeight: 180, // Ajustamos la altura máxima para mostrar solo tres recordatorios a la vez
    },
});
