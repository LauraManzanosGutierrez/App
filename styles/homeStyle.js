// styles/homeStyle.js
import { StyleSheet } from 'react-native';

export const homeStyle = StyleSheet.create({
    boton: {
        borderWidth: 1,
        borderColor: '#FF758F',
        backgroundColor: '#FF758F',
        width: '80%',
        height: 40,
        borderRadius: 30,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonNuevo: {
        borderColor: '#FF758F',
        width: 100, // Ajustar el tamaño de los botones nuevos
        height: 70,  // Aumentar la altura para que los iconos y el texto tengan más espacio
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,  // Bajar aún más los botones
    },
    calendarContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    calendar: {
        borderRadius: 30,
        height: 370,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: -44,  // Disminuir el valor de bottom para mover los botones más abajo
        left: '10%',
        right: '10%',
        flexDirection: 'row',  // Colocar los botones en fila
        justifyContent: 'space-between', // Distribuir los botones uniformemente
        alignItems: 'center',
    },
    buttonContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Estilo para el header con la campanita a la izquierda y el perfil a la derecha
    headerContainer: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between', // Distribuye los iconos a los extremos
        paddingHorizontal: 20,
        zIndex: 1,
    },
    botonCampanita: {
        backgroundColor: '#FF758F',
        padding: 8,
        borderRadius: 30,
    },
    botonPerfil: {
        backgroundColor: '#FF758F',
        padding: 8,
        borderRadius: 30,
    },
    // Estilo para el header con el texto centrado
    headerText: {
        position: 'absolute',
        top: 88, // Un poco más abajo de los iconos
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    titulo: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase', // Para que el texto esté en mayúsculas
    },
    fecha: {
        color: 'white',
        fontSize: 16,
        marginTop: 5,
    },
    // Estilo para el texto "Introduce tus datos"
    introduceDatos: {
        color: 'gray', // Color negro
        fontSize: 15,   // Tamaño de la fuente
        marginTop: 60,  // Colocar un poco más abajo
        textAlign: 'center', // Centrado horizontal
    },

});
