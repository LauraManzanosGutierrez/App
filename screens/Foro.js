import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, TouchableHighlight } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { homeStyle } from '../styles/homeStyle';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Fondo } from '../components/FondoBarraAbajo';
import Url from '../components/Url';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Foro() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params; // Obtener el ID del usuario de los parámetros de la ruta
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        cargarPreguntas();
    }, []); 

    // Función para cargar las preguntas desde el servidor
    async function cargarPreguntas() {
        const url = `${Url.apiUrl}/preguntas`; // Dirección IPv4 del servidor
    
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error(`Error en la petición: ${respuesta.status} - ${respuesta.statusText}`);
            }
    
            const datos = await respuesta.json(); // Parseamos el JSON
            
    
            // Mapea los datos para adaptarlos al estado 'preguntas'
            const preguntasMapeadas = datos.preguntas.map((pregunta) => {
                const fechaObj = new Date(pregunta.fecha); // Convertimos la fecha
                return {
                    id: pregunta.idPreguntas, // ID de la pregunta
                    titulo: pregunta.titulo, // Título de la pregunta
                    contenido: pregunta.contenido, // Contenido
                    fecha: fechaObj.toLocaleDateString(), // Formato de fecha
                    hora: fechaObj.toLocaleTimeString(), // Formato de hora
                    usuario: pregunta.usuario // Nombre del usuario o "Anónimo"
                };
            });
    
            setPreguntas(preguntasMapeadas); // Actualizamos el estado
        } catch (error) {
            console.error("ERROR", error);
        }
    }

    // Función para crear una pregunta
    async function crearPreguntas() {        
        try {
            const nuevaPregunta = {
                idUsuario: userId, // Usar el ID del usuario pasado por la ruta
                titulo,
                contenido,
            };

            if (!titulo || !contenido) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            const url = `${Url.apiUrl}/preguntas`; // URL del servidor
            const respuesta = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaPregunta), // Convierte el objeto a JSON
            });
    
            if (!respuesta.ok) {
                throw new Error(`Error en la petición: ${respuesta.status}`);
            }
    
            const resultado = await respuesta.json(); // Respuesta del servidor
            
    
            // Añadir la nueva pregunta a la lista actual
            const preguntaServidor = resultado.pregunta;
            const fecha = new Date(preguntaServidor.fecha);
    
            const preguntaFormateada = {
                id: preguntaServidor.id, // ID devuelto por el servidor
                titulo: preguntaServidor.titulo,
                contenido: preguntaServidor.contenido,
                fecha: fecha.toLocaleDateString(),
                hora: fecha.toLocaleTimeString(),
                usuario: preguntaServidor.autor, // Incluye el autor devuelto
            };
    
            setPreguntas([...preguntas, preguntaFormateada]); // Actualiza la lista
            setTitulo(''); // Limpia el campo de título
            setContenido(''); // Limpia el campo de contenido
    
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    
    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />

            {/* Título y formulario de creación de pregunta */}
            <Text style={styles.titulo}>Realiza una pregunta...</Text>
            <Text style={styles.text}>Título:</Text>
            <TextInput
                style={styles.input}
                placeholder="Título de la pregunta"
                value={titulo}
                onChangeText={setTitulo}
            />
            <Text style={styles.text}>Contenido:</Text>
            <TextInput
                style={styles.input}
                placeholder="¿Qué pregunta quieres realizar?"
                value={contenido}
                onChangeText={setContenido}
            />

            {/* Botón para guardar la nueva pregunta */}
            <TouchableOpacity
                style={styles.botonGuardar}
                onPress={crearPreguntas} // Llama a la nueva función
            >
                <Text style={globalStyles.textoBoton}>Crear Pregunta</Text>
            </TouchableOpacity>

            {/* Lista de preguntas recientes */}
            <View style={styles.recordatoriosContainer}>
                <Text style={styles.text}>Preguntas recientes:</Text>
                <FlatList
                    data={preguntas} // Datos de las preguntas
                    keyExtractor={(item) => item.id.toString()} // Clave única para cada ítem
                    renderItem={({ item }) => (
                        <View style={styles.container}>
                            <TouchableOpacity
                                style={styles.recordatorio}
                                onPress={() => navigation.navigate('PreguntaEspecifica', { id: item.id, userId })}  
                                
                            >
                                
                                <Text style={styles.tituloPregunta}>{item.titulo}</Text>
                                <Text style={styles.recordatorioUsuario}>{item.usuario}</Text>
                                <Text style={styles.recordatorioText}>{item.contenido}</Text>
                                <Text style={styles.recordatorioFecha}>{item.fecha}</Text>
                                
                            </TouchableOpacity>
                        </View>
                    )}
                    style={styles.recordatorioList}
                />
            </View>

            {/* Contenedor de los tres botones nuevos */}
            <View style={homeStyle.buttonsContainer}>
                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => navigation.navigate('Home',{ userId })}
                >
                    <View style={homeStyle.buttonContent}>
                        <Icon name="calendar-today" size={24} color="white" />
                        <Text style={globalStyles.textoBoton}>Calendario</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => navigation.navigate('Foro',{ userId })}
                >
                    <View style={homeStyle.buttonContent}>
                        <Icon name="chat" size={24} color="white" />
                        <Text style={globalStyles.textoBoton}>Foro</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => navigation.navigate('Noticias',{ userId })}
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

// Estilos del componente
const styles = StyleSheet.create({
    titulo: {
        fontSize: 20,
        color: '#FF758F',
        fontWeight: 'bold',
    },
    input: {
        width: '90%',
        height: 35,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingLeft: 10,
        fontSize: 14,
    },
    text: {
        fontSize: 14,
        color: '#FF758F',
        marginTop: 10,
        marginBottom: 8.5,
        fontWeight: 'bold',
    },
    botonGuardar: {
        borderWidth: 1,
        borderColor: '#FF758F',
        backgroundColor: '#FF758F',
        width: '90%',
        height: 35,
        borderRadius: 20,
        marginTop: 20,
        justifyContent: 'center',
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
    recordatorioUsuario: {
        fontSize: 14,
        color: '#FF758F',
        fontWeight: 'bold',
    },
    recordatorioFecha: {
        fontSize: 14,
        color: 'gray',
    },
    tituloPregunta: {
        fontSize: 16,
        color: '#FF758F',
        fontWeight: 'bold',
    },
    recordatorioList: {
        maxHeight: 400,
    },
    eliminarBoton: {
        backgroundColor: '#FF6B6B',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    eliminarBotonTexto: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});