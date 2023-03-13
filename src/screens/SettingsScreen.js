import { StyleSheet, Text, View, TouchableOpacity, Animated, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { clearStorage } from '../models/Storage';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config"
import Header from '../elements/Header';

// Экран настроек.
export default function SettingsScreen({ navigation }) {

    const handleLogout = () => {
        Promise.all([
            clearStorage(),
            signOut(auth)
        ]).then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                });
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    return (
        <View style={styles.container}>
            <Header title={'settings'}/>
            <TouchableOpacity 
                style={styles.settingWrapper} 
                onPress={() => handleLogout()}>
                <AntDesign name="logout" size={24} color="black" />
                <Text style={styles.settingTitle}>Log out</Text>
            </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    settingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingLeft: 32,
        paddingRight: 16
    },
    settingTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        fontWeight: 500,
        marginLeft: 32
    }
});