import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { loadStorageFromCloud } from "../models/Storage";

// Экран авторизации.
export default function AuthScreen({ navigation }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        let unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                loadStorageFromCloud().then(() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    })
                ).catch(error => {
                    Alert.alert(error.message)
                })
                
            }
        })

        return unsubscribe
    }, [])

    // Обработка входа.
    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user
                console.log('Logged in with:', user.email)
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    // Обработка регистрации.
    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user
                console.log('Logged in with:', user.email)
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}></View>
            <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <TextInput 
                    style={styles.textInput} 
                    placeholder={'E-mail'} 
                    placeholderTextColor="#888888"
                    onChangeText={(text) => setEmail(text)}/>
                <TextInput
                    secureTextEntry={true} 
                    style={styles.textInput} 
                    placeholder={'Password'} 
                    placeholderTextColor="#888888" 
                    onChangeText={(text) => setPassword(text)}/>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleRegister()}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        flex: 1
    },
    form: {
        width: '80%',
        marginLeft: '10%'
    },
    textInput: {
        height: 56,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowRadius: 8,
        shadowOpacity: 0.15,
        textAlign: 'center',
        borderRadius: 28,
        fontSize: 20,
        margin: 8,
        fontFamily: 'Roboto-Light',
        elevation: 3
    },
    buttonWrapper: {
        marginTop: 16,
        marginBottom: 32
    },
    button: {
        height: 56,
        backgroundColor: '#000',
        opacity: 0.75,
        shadowColor: '#000',
        shadowRadius: 8,
        shadowOpacity: 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
        margin: 8,
        elevation: 3
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        opacity: 0.75
    }
})
