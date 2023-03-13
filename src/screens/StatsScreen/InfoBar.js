import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export default function InfoBar({ title, onPressRight, onPressLeft }) {
    return (
        <View style={styles.infoBar}>
            <TouchableOpacity style={styles.infoBarButton} onPress={() => onPressRight()}>
                <AntDesign name="doubleleft" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.infoBarTitleContainer}>
                <Text style={styles.infoBarTitle}>{title}</Text>
            </View>
            <TouchableOpacity style={styles.infoBarButton} onPress={() => onPressLeft()}>
                <AntDesign name="doubleright" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    infoBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 32,
        paddingRight: 32,
        paddingBottom: 16
    },
    infoBarButton: {
        height: 56,
        width: 56,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        borderRadius: 28,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.75
    },
    infoBarTitleContainer: {
        flex: 1
    },
    infoBarTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 28,
        textAlign: 'center',
        opacity: 0.75
    },
});