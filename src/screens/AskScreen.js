import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { addObservation, saveStorageInCloud } from '../models/Storage';

// Экран записи наблюдения.
export default function AskScreen({ navigation }) {
    const [chosenValue, setChosenValue] = useState(-1)
    const [isButtonVisible, setIsButtonVisible] = useState(false)
    const buttonOpacityValue = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (isButtonVisible && chosenValue === -1) {
            setIsButtonVisible(false)
            Animated.timing(buttonOpacityValue, { toValue: 0, useNativeDriver: true, duration: 300 }).start()
        } else if (!isButtonVisible && chosenValue !== -1) {
            setIsButtonVisible(true)
            Animated.timing(buttonOpacityValue, { toValue: 1, useNativeDriver: true, duration: 300 }).start()
        }
    }, [chosenValue])

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Text style={styles.title}>how do you feel?</Text>
                <View style={styles.optionsWrapper}>
                    {
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => {
                            return <Option 
                                number={number} 
                                chosen={chosenValue} 
                                setChosen={setChosenValue}
                                key={number}
                            />
                        })
                    }
                </View>
                <Animated.View style={{opacity: buttonOpacityValue}}>
                    <TouchableOpacity 
                        style={styles.saveButton} 
                        onPress={() => {
                            if (isButtonVisible) {
                                saveStorageInCloud()
                                addObservation(chosenValue).then(navigation.goBack())
                            }
                        }}
                    >
                        <Text style={styles.saveButtonTitle}>save</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
      );
}

// Кнопка для выбора.
function Option({ number, chosen, setChosen }) {
    const viewStyle = chosen === number ? 
        [styles.option, styles.chosenOption] : styles.option
    const textStyle = chosen === number ?
        [styles.optionText, styles.chosenOptionText] : styles.optionText
    return ( 
        <TouchableOpacity style={viewStyle} onPress={() => setChosen(number)}>
            <Text style={textStyle}>{number}</Text>
        </TouchableOpacity> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        marginLeft: 32,
        marginRight: 32,
        fontFamily: 'Roboto-Black',
        fontSize: 32,
        marginBottom: 32,
        opacity: 0.75
    },
    optionsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginLeft: 32,
        marginRight: 32,
        marginBottom: 40
    },
    option: {
        height: 56,
        width: 56,
        borderRadius: 28,
        shadowColor: '#000',
        shadowRadius: 8,
        shadowOpacity: 0.15,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 10
    },
    chosenOption: {
        backgroundColor: '#000',
        opacity: 0.75
    },
    optionText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 28,
        opacity: 0.75
    },
    chosenOptionText: {
        color: '#fff'
    },
    saveButton: {
        height: 56,
        borderRadius: 28,
        marginLeft: 44,
        marginRight: 44,
        backgroundColor: '#000',
        opacity: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonTitle: {
        color: '#fff',
        opacity: 0.75,
        fontFamily: 'Roboto-Bold',
        fontSize: 28
    }
})