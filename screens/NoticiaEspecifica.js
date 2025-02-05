import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import { homeStyle } from '../styles/homeStyle';
import { Fondo } from '../components/FondoBarraAbajo';
import Url from '../components/Url';

export default function NoticiaEspecifica() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params; // Recibe el ID pasado desde la navegación
    const [noticia, setNoticia] = useState(null);
    const ImagenNoticia = require('../assets/ImagenNoticias.jpg');

    useEffect(() => {
        cargarNoticiaEspecifica();
    }, [id]);

    // Función para cargar la noticia específica desde el servidor
    async function cargarNoticiaEspecifica() {
        const url = `${Url.apiUrl}/noticias/${id}`;
        
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error(`Error en la petición: ${respuesta.status} - ${respuesta.statusText}`);
            }
            const datos = await respuesta.json(); // Parseamos el JSON
            
            setNoticia(datos.noticia[0]); // Accedemos al primer elemento del array
        } catch (error) {
            console.error("ERROR", error);
        }
    }

    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />

            {noticia ? (
                <View style={styles.noticiaContainer}>
                    <Text style={styles.titulo}>{noticia.titulo}</Text>
                    <Text style={styles.contenido}>{noticia.contenido}</Text>

                    {/* Contenedor centrado para la imagen */}
                    <View style={styles.imagenContainer}>
                        <Image source={ImagenNoticia} style={styles.imagen} />
                    </View>

                    <Text style={styles.fecha}>Fecha: {new Date(noticia.fecha).toLocaleDateString()}</Text>
                </View>
            ) : (
                <Text>Cargando noticia...</Text>
            )}

            {/* Contenedor de los tres botones nuevos */}
            <View style={homeStyle.buttonsContainer}>
                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => navigation.navigate('Home')}
                >
                    <View style={homeStyle.buttonContent}>
                        <Icon name="calendar-today" size={24} color="white" />
                        <Text style={globalStyles.textoBoton}>Calendario</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => Alert.alert('Chat presionado')}
                >
                    <View style={homeStyle.buttonContent}>
                        <Icon name="chat" size={24} color="white" />
                        <Text style={globalStyles.textoBoton}>Foro</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={homeStyle.botonNuevo}
                    onPress={() => Alert.alert('Libro presionado')}
                >
                    <View style={homeStyle.buttonContent}>
                        <Icon name="menu-book" size={24} color="white" />
                        <Text style={globalStyles.textoBoton}>Contenido</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    noticiaContainer: {
        padding: 20,
        marginVertical: 16,
        backgroundColor: '#fff',  // Fondo blanco
        borderRadius: 12,
        elevation: 5,  // Sombra en dispositivos Android
        shadowColor: '#000', // Sombra en dispositivos iOS
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    titulo: {
        fontSize: 30,
        color: '#FF758F',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    contenido: {
        fontSize: 16,
        color: '#333',
        textAlign: 'justify',
        lineHeight: 22,  // Espaciado para mejorar la lectura
    },
    fecha: {
        fontSize: 14,
        color: '#999',
        textAlign: 'right',
        marginTop: 12,
    },
    imagenContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20, // Espaciado adicional para la imagen
    },
    imagen: {
        width: 250,
        height: 100, // Mantén la altura actual para las imágenes
        borderRadius: 8,
    },
});
