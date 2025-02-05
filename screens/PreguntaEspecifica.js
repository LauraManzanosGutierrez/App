import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Alert, StatusBar, TextInput, FlatList } from 'react-native';
import { Fondo } from '../components/FondoBarraAbajo';
import { globalStyles } from '../styles/globalStyles';
import { homeStyle } from '../styles/homeStyle';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de que tienes el paquete 'react-native-vector-icons' instalado.
import { useNavigation, useRoute } from '@react-navigation/native';
import Url from '../components/Url';

export default function PreguntaEspecifica() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, userId } = route.params; // Recibe el ID pasado desde la navegación
    

    const [pregunta, setPregunta] = useState(null);
    const [respuestas, setRespuestas] = useState([]);
    const [mostrarInput, setMostrarInput] = useState(false);
    const [nuevaRespuesta, setNuevaRespuesta] = useState('');

    useEffect(() => {
        cargarPregunta();
    }, [id]);

    // Función para cargar las preguntas desde el servidor
    async function cargarPregunta() {
        const url = `${Url.apiUrl}/preguntas/${id}`;
        
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error(`Error en la petición: ${respuesta.status} - ${respuesta.statusText}`);
            }
    
            const datos = await respuesta.json(); // Parseamos el JSON
            
            // Asignamos la pregunta y las respuestas al estado
            setPregunta(datos.pregunta);
            setRespuestas(datos.respuestas.map(respuesta => ({
                ...respuesta,
                fecha: new Date(respuesta.fecha).toLocaleDateString()
            })));
        } catch (error) {
            console.error("ERROR", error);
        }
    }

    // Función para crear una respuesta
    async function crearRespuesta() {        
        try {
            const nuevaRespuestaObj = {
                
                idUsuario: userId, 
                contenido: nuevaRespuesta,
                Preguntas_idPreguntas: id,
            };
            

            if (!nuevaRespuesta) {
                alert("Por favor, ingrese una respuesta.");
                return;
            }

            const url = `${Url.apiUrl}/preguntas/${id}/respuestas`; // Cambia a la IP de tu máquina en la red local
            const respuesta = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaRespuestaObj), // Convierte el objeto a JSON
            });

            if (!respuesta.ok) {
                const errorText = await respuesta.text();
                console.error('Error en la respuesta del servidor:', errorText); // Agrega este log para verificar la respuesta del servidor
                throw new Error(`Error en la petición: ${respuesta.status}`);
            }

            const resultado = await respuesta.json(); // Respuesta del servidor
            

            // Añadir la nueva respuesta a la lista actual
            const respuestaServidor = resultado.respuesta;
            const fecha = new Date(respuestaServidor.fecha);

            const respuestaFormateada = {
                idRespuesta: respuestaServidor.id, // ID devuelto por el servidor
                idUsuario: respuestaServidor.idUsuario,
                contenido: respuestaServidor.contenido,
                fecha: fecha.toLocaleDateString(), // Formatear la fecha correctamente
                Preguntas_idPreguntas: respuestaServidor.Preguntas_idPreguntas, // ID de la pregunta
            };

            setRespuestas([...respuestas, respuestaFormateada]); // Actualiza la lista
            setNuevaRespuesta(''); // Limpia el campo de respuesta
            setMostrarInput(false); // Oculta el campo de respuesta
    
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />

            {pregunta ? (
                <View style={styles.preguntaContainer}>
                    <Text style={styles.titulo}>{pregunta.titulo}</Text>
                    <Text style={styles.contenido}>{pregunta.contenido}</Text>
                    <Text style={styles.fecha}>Fecha: {new Date(pregunta.fecha).toLocaleDateString()}</Text>
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor="#FF9AAD"
                        onPress={() => setMostrarInput(true)}
                    >
                        <Text style={styles.buttonText}>Responder</Text>
                    </TouchableHighlight>
                    {mostrarInput && (
                        <View style={styles.respuestaContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Escribe tu respuesta..."
                                value={nuevaRespuesta}
                                onChangeText={setNuevaRespuesta}
                                maxWidth={350} 
                                
                            />
                            <TouchableOpacity
                                style={styles.botonAceptar}
                                onPress={crearRespuesta}
                            >
                                <Text style={styles.buttonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : (
                <Text>Cargando pregunta...</Text>
            )}

            <Text style={styles.respuestasTitulo}>Respuestas:</Text>
            <FlatList
                data={respuestas}
                keyExtractor={(item) => item.idRespuesta.toString()}
                renderItem={({ item }) => (
                    <View style={styles.respuesta}>
                        <Text style={styles.contenido}>Usuario {item.Usuarios_idUsuario}:</Text>
                        <Text style={styles.contenido}>{item.contenido}</Text>
                        <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
                    </View>
                )}
                style={styles.recordatorioList}
            />

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

const styles = StyleSheet.create({
    preguntaContainer: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#FF758F',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#FFEBEE',
        width: '95%',
    },
    titulo: {
        fontSize: 20,
        color: '#FF758F',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    contenido: {
        fontSize: 16,
        color: '#FF758F',
        marginBottom: 3,
    },
    fecha: {
        fontSize: 14,
        color: 'gray',
        
    },
    respuestasTitulo: {
        fontSize: 18,
        color: '#FF758F',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    respuesta: {
        marginBottom: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#FF758F',
        borderRadius: 4,
        backgroundColor: '#FFEBEE',
    },
    button: {
        backgroundColor: '#FF758F',
        paddingHorizontal: 15,
        paddingVertical: 3,
        borderRadius: 5,
        marginRight: '68%',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    respuestaContainer: {
        marginTop: 10,
    },
    input: {
        width: '100%',
        height: 35,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingLeft: 10,
        fontSize: 14,
    },
    botonAceptar: {
        borderWidth: 1,
        borderColor: '#FF758F',
        backgroundColor: '#FF758F',
        width: '100%',
        height: 35,
        borderRadius: 20,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordatorioList: {
        maxHeight: 359,
        width: '95%', // Ocupar todo el ancho disponible
    },
});