// styles/globalStyles.js
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3E2E6',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    fondo: {
        position: 'absolute',
    },
    titulo: {
        fontSize: 55,
        color: '#FF758F',
        fontWeight: 'bold',
        marginBottom:5,
    },
    subtitulo: {
        fontSize: 13,
        fontWeight: 'bold',
        marginRight:5,
    },
    textoBase:{
        fontSize: 15,
        fontWeight: 'bold',
        marginTop:5,
        marginBottom:10,
    },
    enlaceFormulario: {
        fontSize: 13,
        color: '#FF758F',
        fontWeight: 'bold',
    },
    textoBoton: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },

});
