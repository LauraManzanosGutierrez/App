import { StyleSheet, Text, View, TouchableOpacity, Switch, TouchableHighlight } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// Solicitar permisos y configurar las notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function Notificaciones() {
    const navigation = useNavigation(); // Hook para la navegación
    const route = useRoute();
    const { userId } = route.params; // Obtener el ID del usuario de los parámetros de la ruta

    // Estado para manejar las notificaciones activadas
    const [notifications, setNotifications] = useState({
        reminderCycle: false, // Recordatorio para el ciclo
        reminderPill: false, // Recordatorio para la píldora
        reminderPeriodOneDayBefore: false, // Un día antes del periodo
        reminderPeriodThreeDaysBefore: false, // Tres días antes del periodo
        reminderOvulationOneDayBefore: false, // Un día antes de la ovulación
    });

    // Función para manejar la activación/desactivación de notificaciones
    const toggleNotification = (notification) => {
        setNotifications((prevState) => ({
            ...prevState,
            [notification]: !prevState[notification],
        }));
    };

    // Solicitar permisos de notificaciones al montar el componente
    useEffect(() => {
        async function requestPermissions() {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Se requieren permisos para mostrar notificaciones.');
            }
        }
        requestPermissions();
    }, []);

    // Función para programar una notificación local
    const scheduleNotification = async (title, body, triggerTime) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
            },
            trigger: {
                ...triggerTime,
                repeats: true, // Repite diariamente
            },
        });
    };

    // Función para activar las notificaciones programadas
    const handleSaveNotifications = () => {
        const triggerTime = { hour: 21, minute: 0 }; // Definir hora para todas las notificaciones

        if (notifications.reminderCycle) {
            scheduleNotification("Ciclo Menstrual", "Es hora de registrar tu ciclo.", triggerTime);
        }
        if (notifications.reminderPill) {
            scheduleNotification("Píldora", "No olvides tomar tu píldora.", triggerTime);
        }
        if (notifications.reminderPeriodOneDayBefore) {
            // Programar notificación un día antes del periodo
            scheduleNotification("Periodo Menstrual", "Tu periodo comienza mañana.", { hour: 21, minute: 0, day: new Date().getDate() + 1 });
        }
        if (notifications.reminderPeriodThreeDaysBefore) {
            // Programar notificación tres días antes del periodo
            scheduleNotification("Periodo Menstrual", "Tu periodo comienza en tres días.", { hour: 21, minute: 0, day: new Date().getDate() + 3 });
        }
        if (notifications.reminderOvulationOneDayBefore) {
            // Programar notificación un día antes de la ovulación
            scheduleNotification("Ovulación", "Tu ovulación será mañana.", { hour: 21, minute: 0, day: new Date().getDate() + 1 });
        }
    };

    return (
        <View style={globalStyles.container}>
            <StatusBar style="light" />

            <Text style={globalStyles.titulo}>Programar...</Text>
            <Text></Text>
            

            

            {/* Recordatorio para el ciclo */}
            <View style={styles.reminderRow}>
                <Text style={styles.reminderText}>Recordatorio para el ciclo</Text>
                <Switch
                    value={notifications.reminderCycle}
                    onValueChange={() => toggleNotification('reminderCycle')}
                    thumbColor={notifications.reminderCycle ? '#FF758F' : '#d3d3d3'}
                    trackColor={{ false: '#F3E2E6', true: '#F3E2E6' }}
                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                />
            </View>

            {/* Recordatorio para la píldora */}
            <View style={styles.reminderRow}>
                <Text style={styles.reminderText}>Recordatorio para la píldora</Text>
                <Switch
                    value={notifications.reminderPill}
                    onValueChange={() => toggleNotification('reminderPill')}
                    thumbColor={notifications.reminderPill ? '#FF758F' : '#d3d3d3'}
                    trackColor={{ false: '#F3E2E6', true: '#F3E2E6' }}
                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                />
            </View>

            {/* Notificación un día antes del periodo */}
            <View style={styles.reminderRow}>
                <Text style={styles.reminderText}>Un día antes del periodo</Text>
                <Switch
                    value={notifications.reminderPeriodOneDayBefore}
                    onValueChange={() => toggleNotification('reminderPeriodOneDayBefore')}
                    thumbColor={notifications.reminderPeriodOneDayBefore ? '#FF758F' : '#d3d3d3'}
                    trackColor={{ false: '#F3E2E6', true: '#F3E2E6' }}
                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                />
            </View>

            {/* Notificación tres días antes del periodo */}
            <View style={styles.reminderRow}>
                <Text style={styles.reminderText}>Tres días antes del periodo</Text>
                <Switch
                    value={notifications.reminderPeriodThreeDaysBefore}
                    onValueChange={() => toggleNotification('reminderPeriodThreeDaysBefore')}
                    thumbColor={notifications.reminderPeriodThreeDaysBefore ? '#FF758F' : '#d3d3d3'}
                    trackColor={{ false: '#F3E2E6', true: '#F3E2E6' }}
                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                />
            </View>

            {/* Notificación un día antes de la ovulación */}
            <View style={styles.reminderRow}>
                <Text style={styles.reminderText}>Un día antes de la ovulación</Text>
                <Switch
                    value={notifications.reminderOvulationOneDayBefore}
                    onValueChange={() => toggleNotification('reminderOvulationOneDayBefore')}
                    thumbColor={notifications.reminderOvulationOneDayBefore ? '#FF758F' : '#d3d3d3'}
                    trackColor={{ false: '#F3E2E6', true: '#F3E2E6' }}
                    style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                />
            </View>

            {/* Botón Guardar */}
            <TouchableHighlight
                style={styles.botonGuardar}
                underlayColor="#FF9AAD"
                onPress={handleSaveNotifications}
            >
                <Text style={globalStyles.textoBoton}>GUARDAR</Text>
            </TouchableHighlight>
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
    reminderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderRadius: 30,
        marginBottom: 15,
        marginTop: 10,
        width: '80%',
        height: 50,
        paddingHorizontal: 20,
        shadowColor: "#000",
    },
    reminderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF758F',
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
});