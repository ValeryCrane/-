import React from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Platform, StatusBar} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'

// Заголовок с кнопкой назад.
export default function Header({ title }) {
    const navigation = useNavigation()

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={36} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    headerTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 28,
        opacity: 0.75
    },
    backButton: {
        position: 'absolute',
        left: 32
    }
})