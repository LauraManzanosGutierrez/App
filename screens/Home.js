import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TouchableHighlight, Alert, Modal, StyleSheet } from 'react-native';
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
import RadioGroup from 'react-native-radio-buttons-group'; // Importar RadioGroup
import Url from '../components/Url';

export default function Home() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params; // Obtener el ID del usuario de los parámetros de la ruta
    const [username, setUsername] = useState(''); // Estado para almacenar el nombre de usuario
    const [tempSelectedDates, setTempSelectedDates] = useState({}); // Fechas seleccionadas temporalmente
    const [markedDates, setMarkedDates] = useState({}); // Fechas confirmadas (con color más oscuro)
    const [currentDate, setCurrentDate] = useState(''); // Fecha actual
    const [modalVisible, setModalVisible] = useState(false); // Estado para manejar la visibilidad del modal
    const [deporte, setDeporte] = useState(null); // Estado para la opción de deporte seleccionada
    const [sueno, setSueno] = useState(null); // Estado para la opción de sueño seleccionada
    const [estres, setEstres] = useState(null); // Estado para la opción de estrés seleccionada
    const [userData, setUserData] = useState({}); // Estado para almacenar los datos del usuario obtenidos de MySQL
    const [duracionCiclo, setDuracionCiclo] = useState(28); // Estado para la duración del ciclo
    const [duracionPeriodo, setDuracionPeriodo] = useState(5); // Estado para la duración del periodo

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

    useEffect(() => {
        setCurrentDate(moment().format('LL')); // Formato de fecha como: 30 de diciembre de 2024
        obtenerNombreUsuario(); // Llamar a la función para obtener el nombre de usuario
        obtenerDatosUsuarioPeriodo(); // Llamar a la función para obtener los datos del usuario
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

    const obtenerDatosUsuarioPeriodo = async () => {
        try {
            const response = await fetch(`${Url.apiUrl}/datosUsuarioPeriodo/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setUserData(data.usuario);
                setDuracionCiclo(data.usuario.duracionCiclo);
                setDuracionPeriodo(data.usuario.duracionPeriodo);
            } else {
                console.error('Error al obtener los datos del usuario:', data.error);
            }
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    };

    const enviarDatosUsuario = async () => {
        const datos = {
            idUsuario: userData.idUsuario,
            edad: userData.edad,
            BMI: userData.BMI,
            deporte: deporte,
            sueño: sueno,
            estres: estres,
            duracionCiclo: duracionCiclo,
            duracionPeriodo: duracionPeriodo
        };

        try {
            const response = await fetch(`${Url.apiUrl}/datosUsuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Datos enviados', 'Los datos del usuario han sido enviados correctamente.');
            } else {
                console.error('Error al enviar los datos del usuario:', data.error);
            }
        } catch (error) {
            console.error('Error al enviar los datos del usuario:', error);
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
        setModalVisible(true); // Mostrar el modal
    };

    const confirmSelection = () => {
        // Crear una copia de las fechas seleccionadas temporalmente y cambiarlas a color oscuro
        const updatedMarkedDates = { ...markedDates };

        Object.keys(tempSelectedDates).forEach((day) => {
            updatedMarkedDates[day] = {
                ...tempSelectedDates[day],
                selectedColor: '#F85070', // Rosa más oscuro al confirmar
            };
        });

        // Guardar las fechas confirmadas
        setMarkedDates(updatedMarkedDates);
        setTempSelectedDates({}); // Limpiar las fechas seleccionadas temporalmente
        setModalVisible(false); // Ocultar el modal
        enviarDatosUsuario(); // Enviar los datos del usuario al confirmar la selección
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

            {/* Modal para las preguntas */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={[globalStyles.textoBase, styles.modalText]}>Deporte practicado este mes?</Text>
                        <View style={styles.radioGroupGrid}>
                            <View style={styles.radioGroupRow}>
                                <RadioGroup
                                    radioButtons={deporteOptions.slice(0, 2)}
                                    onPress={setDeporte}
                                    selectedId={deporte}
                                    containerStyle={styles.radioGroupHorizontal}
                                    radioStyle={styles.radioButton}
                                    labelStyle={styles.radioLabel}
                                />
                            </View>
                            <View style={styles.radioGroupRow}>
                                <RadioGroup
                                    radioButtons={deporteOptions.slice(2, 4)}
                                    onPress={setDeporte}
                                    selectedId={deporte}
                                    containerStyle={styles.radioGroupHorizontal}
                                    radioStyle={styles.radioButton}
                                    labelStyle={styles.radioLabel}
                                />
                            </View>
                        </View>

                        <Text style={[globalStyles.textoBase, styles.modalText]}>¿Cómo has dormido este mes?</Text>
                        <View style={styles.radioGroupGrid}>
                            <RadioGroup
                                radioButtons={suenoOptions}
                                onPress={setSueno}
                                selectedId={sueno}
                                containerStyle={styles.radioGroupCentered}
                                radioStyle={styles.radioButton}
                                labelStyle={styles.radioLabel}
                            />
                        </View>

                        <Text style={[globalStyles.textoBase, styles.modalText]}>¿Cuánto estrés has tenido este mes?</Text>
                        <View style={styles.radioGroupGrid}>
                            <View style={styles.radioGroupRow}>
                                <RadioGroup
                                    radioButtons={estresOptions.slice(0, 2)}
                                    onPress={setEstres}
                                    selectedId={estres}
                                    containerStyle={styles.radioGroupCentered}
                                    radioStyle={styles.radioButton}
                                    labelStyle={styles.radioLabel}
                                />
                            </View>
                            <View style={styles.radioGroupRow}>
                                <RadioGroup
                                    radioButtons={estresOptions.slice(2, 3)}
                                    onPress={setEstres}
                                    selectedId={estres}
                                    containerStyle={styles.radioGroupCentered}
                                    radioStyle={styles.radioButton}
                                    labelStyle={styles.radioLabel}
                                />
                            </View>
                        </View>

                        <TouchableHighlight
                            style={homeStyle.boton}
                            underlayColor="#FF9AAD"
                            onPress={confirmSelection}
                        >
                            <Text style={globalStyles.textoBoton}>CONFIRMAR</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: 30,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 14, // Reducir el tamaño del texto
        marginVertical: 5,
    },
    radioGroupGrid: {
        width: '100%',
        marginVertical: 5, // Reducir el margen vertical para hacer el contenido más comprimido
        alignItems: 'center', // Centrar horizontalmente
    },
    radioGroupRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%', // Ajustar el ancho para centrar mejor
        marginVertical: 5,
    },
    radioGroupHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    radioGroupCentered: {
        flexDirection: 'row',
        justifyContent: 'center', // Centrar las opciones de sueño
        width: '100%',
    },
    radioButton: {
        transform: [{ scale: 0.8 }], // Reducir el tamaño de los botones de radio
    },
    radioLabel: {
        fontSize: 12, // Reducir el tamaño de las etiquetas
    },
});