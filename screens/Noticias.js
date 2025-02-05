import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import { homeStyle } from '../styles/homeStyle';
import { Fondo } from '../components/FondoBarraAbajo';
import Url from '../components/Url';

export default function Noticias() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params; // Obtener el ID del usuario de los parámetros de la ruta

    const [noticias, setNoticias] = useState([]);
    const [numColumns, setNumColumns] = useState(2); // Estado para controlar el número de columnas
    const ImagenNoticia = require('../assets/ImagenNoticias.jpg');

    useEffect(() => {
        cargarNoticias();
    }, []);

    async function cargarNoticias() {
        const url = `${Url.apiUrl}/noticias`;	
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error(
                    `Error en la petición: ${respuesta.status} - ${respuesta.statusText}`
                );
            }
            const datos = await respuesta.json();
            const noticiasMapeadas = datos.noticias.map((noticia) => {
                const fechaObj = new Date(noticia.fecha);
                return {
                    id: noticia.idNoticias,
                    titulo: noticia.titulo,
                    contenido: noticia.contenido,
                    fecha: fechaObj.toLocaleDateString(),
                };
            });
            setNoticias(noticiasMapeadas);
        } catch (error) {
            console.error('ERROR', error);
        }
    }

    return (
        <View style={globalStyles.container}>
            <Fondo style={[globalStyles.fondo]} />
            <StatusBar style="light" />
            <Text style={styles.titulo}>Noticias</Text>
            <View style={styles.recordatoriosContainer}>
                <FlatList
                    data={noticias}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={numColumns} // Aquí usamos el estado de columnas
                    key={`flatlist-${numColumns}`} // Cambiar la key para forzar un nuevo render
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.recordatorio}
                            onPress={() =>
                                navigation.navigate('NoticiaEspecifica', { id: item.id })
                            }
                        >
                            <Image source={ImagenNoticia} style={styles.imagen} />
                            <View style={styles.overlay}>
                                <Text style={styles.tituloSuperpuesto}>{item.titulo}</Text>
                            </View>
                        </TouchableOpacity>
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

const styles = StyleSheet.create({
    titulo: {
        marginTop:110,
        fontSize: 35,
        color: '#FF758F',
        fontWeight: 'bold',
    },
    recordatoriosContainer: {
        marginTop: 30,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
    },
    recordatorio: {
        flex: 1,
        margin: 13,
        borderRadius: 8,
        overflow: 'hidden',
    },
    imagen: {
        width: '100%',
        height: 150, // Mantén la altura actual para las imágenes
        borderRadius: 8,
    },
    overlay: {
        position: 'absolute',
        bottom: 0, // Mueve el texto hacia arriba ajustando esta propiedad
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 7,
    },
    tituloSuperpuesto: {
        color: '#FF758F',
        fontSize: 16, // Puedes hacer que el texto sea más grande si lo deseas
        fontWeight: 'bold',
        textAlign: 'center',
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    recordatorioList: {
        // Aumenta el maxHeight o elimínalo por completo para usar todo el espacio disponible
        maxHeight: '86%', // Esto hace que ocupe más espacio sin que se corte
    },
});