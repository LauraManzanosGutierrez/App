import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PreguntasScreen from './screens/PreguntasScreen';
import PreguntasScreen2 from './screens/PreguntasScreen2';
import Home from './screens/Home';
import RecuperarContraseñaScreen from './screens/RecuperarContraseñaScreen';
import Perfil from './screens/Perfil';
import EditarContraseña from './screens/EditarContraseña';
import Notificaciones from './screens/Notificaciones';
import Recordatorios from './screens/Recordatorios';
import Foro from './screens/Foro';
import PreguntaEspecifica from './screens/PreguntaEspecifica';
import Noticias from './screens/Noticias';
import NoticiaEspecifica from './screens/NoticiaEspecifica';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en LoginScreen
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en Home
                />
                <Stack.Screen
                    name="RegisterScreen"
                    component={RegisterScreen}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en RegisterScreen
                />
                <Stack.Screen
                    name="PreguntasScreen"
                    component={PreguntasScreen}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en PreguntasScreen
                />
                <Stack.Screen
                    name="PreguntasScreen2"
                    component={PreguntasScreen2}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en PreguntasScreen2
                />
                <Stack.Screen
                    name="RecuperarContraseñaScreen"
                    component={RecuperarContraseñaScreen}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en RecuperarContraseñaScreen
                />
                <Stack.Screen
                    name="Perfil"
                    component={Perfil}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en Perfil
                />
                <Stack.Screen
                    name="EditarContraseña"
                    component={EditarContraseña}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en EditarContraseña
                />
                <Stack.Screen
                    name="Notificaciones"
                    component={Notificaciones}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en Notificaciones
                />
                <Stack.Screen
                    name="Recordatorios"
                    component={Recordatorios}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en Recordatorios
                />
                <Stack.Screen
                    name="Foro"
                    component={Foro}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en Foro
                />
                <Stack.Screen
                    name="PreguntaEspecifica"
                    component={PreguntaEspecifica}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en PreguntaEspecifica
                />
                <Stack.Screen
                    name="Noticias"
                    component={Noticias}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en Noticias
                />
                <Stack.Screen
                    name="NoticiaEspecifica"
                    component={NoticiaEspecifica}
                    options={{ headerShown: false }} // Ocultar la barra de navegación en NoticiaEspecifica
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});