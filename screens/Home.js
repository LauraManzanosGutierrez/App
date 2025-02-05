import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import { Fondo } from '../components/FondoHome';
import { globalStyles } from '../styles/globalStyles';
import { homeStyle } from '../styles/homeStyle'; // Importar estilos globales
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importar los iconos
import moment from 'moment';  // Para manejar la fecha actual
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import jwt_decode from 'jwt-decode'; // Importar jwt-decode para decodificar el token

export default function Home() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params; // Obtener el ID del usuario de los parámetros de la ruta
    const [username, setUsername] = useState(''); // Estado para almacenar el nombre de usuario
    const [tempSelectedDates, setTempSelectedDates] = useState({}); // Fechas seleccionadas temporalmente
    const [markedDates, setMarkedDates] = useState({}); // Fechas confirmadas (con color más oscuro)
    const [currentDate, setCurrentDate] = useState(''); // Fecha actual

    useEffect(() => {
        setCurrentDate(moment().format('LL')); // Formato de fecha como: 30 de diciembre de 2024
        obtenerNombreUsuario(); // Llamar a la función para obtener el nombre de usuario
    }, []);
    
    const obtenerNombreUsuario = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decodedToken = jwt_decode(token);

                setUsername(decodedToken.nombre); // Obtener el nombre de usuario del campo 'nombre'
            }
        } catch (error) {
            console.error('Error al obtener el nombre de usuario:', error);
        }
    };

    // Alternar selección temporal (solo si no están confirmadas)
    const toggleDaySelection = (day) => {
        const updatedTempDates = { ...tempSelectedDates };

        // Si no está en markedDates, entonces se puede seleccionar/desmarcar
        if (updatedTempDates[day]) {
            delete updatedTempDates[day]; // Eliminar la selección temporal
        } else {
            updatedTempDates[day] = {
                selected: true,
                marked: true,
                selectedColor: 'pink', // Rosa claro durante la selección
            };
        }

        setTempSelectedDates(updatedTempDates); // Actualizar las fechas seleccionadas temporalmente
    };

    const confirmSelection = () => {
        // Crear una copia de las fechas seleccionadas temporalmente y cambiarlas a color oscuro
        const updatedMarkedDates = {};

        Object.keys(tempSelectedDates).forEach((day) => {
            updatedMarkedDates[day] = {
                ...tempSelectedDates[day],
                selectedColor: '#F85070', // Rosa más oscuro al confirmar
            };
        });

        // Guardar las fechas confirmadas
        setMarkedDates(updatedMarkedDates);
        Alert.alert('Fechas guardadas', 'Tus días seleccionados han sido guardados.');
    };

    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />

            {/* Header con la campanita a la izquierda y el perfil a la derecha */}
            <View style={homeStyle.headerContainer}>
                <TouchableHighlight
                    style={homeStyle.botonCampanita}
                    underlayColor="#FF9AAD"
                    onPress={() => navigation.navigate('Notificaciones', { userId })}
                >
                    <Icon name="notifications" size={30} color="white" />
                </TouchableHighlight>

                <TouchableHighlight
                    style={homeStyle.botonPerfil}
                    underlayColor="#FF9AAD"
                    onPress={() => navigation.navigate('Perfil', { userId })} // Pasar el ID del usuario a Perfil.js
                >
                    <Icon name="account-circle" size={30} color="white" />
                </TouchableHighlight>
            </View>
            {/* Texto centrado en la parte superior */}
            <View style={homeStyle.headerText}>
                <Text style={homeStyle.titulo}>CALENDARIO MENSTRUAL</Text>
                <Text style={homeStyle.fecha}>{currentDate}</Text>
                
            </View>

            {/* Texto "Introduce tus datos" con el nombre del usuario */}
            <Text style={homeStyle.introduceDatos}>Bienvenida {username}, Introduce tu periodo:</Text>
            
            <View style={homeStyle.calendarContainer}>
                <Calendar
                    onDayPress={(day) => toggleDaySelection(day.dateString)} // Cuando se pulsa un día, se selecciona
                    markedDates={{ ...tempSelectedDates, ...markedDates }} // Mostrar las fechas seleccionadas y confirmadas
                    theme={{
                        selectedDayBackgroundColor: 'pink', // Rosa claro durante la selección
                        selectedDayTextColor: 'white',
                        todayTextColor: 'pink',
                        arrowColor: 'pink',
                    }}
                    style={homeStyle.calendar}
                    locale="es"
                />
            </View>

            {/* Botón de Confirmar cambios (sin cambios en su lugar) */}
            <TouchableHighlight
                style={homeStyle.boton}
                underlayColor="#FF9AAD"
                onPress={confirmSelection}
            >
                <Text style={globalStyles.textoBoton}>CONFIRMAR CAMBIOS</Text>
            </TouchableHighlight>

            {/* Contenedor de los tres botones nuevos */}
            <View style={homeStyle.buttonsContainer}>
                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => navigation.navigate('Home', { userId })}
                >
                    <View style={homeStyle.buttonContent}>
                        <Icon name="calendar-today" size={24} color="white" />
                        <Text style={globalStyles.textoBoton}>Calendario</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => navigation.navigate('Foro', { userId })}
                >
                    <View style={homeStyle.buttonContent}>
                        <Icon name="chat" size={24} color="white" />
                        <Text style={globalStyles.textoBoton}>Foro</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => navigation.navigate('Noticias', { userId })}
                >
                    <View style={homeStyle.buttonContent}>
                        <Icon name="menu-book" size={24} color="white" />
                        <Text style={globalStyles.textoBoton}>Noticias</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}