import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, FlatList } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { WeeklyChart, DailyChart } from './Charts';
import Header from '../../elements/Header';
import { getLastObservations } from '../../models/Storage';
import InfoBar from './InfoBar';


// Экран со статистикой энергии.
export default function StatsScreen() {

    const windowWidth = Dimensions.get('window').width
    const dailyChartShiftValue = useRef(new Animated.Value(0)).current
    const weeklyChartShiftValue = useRef(new Animated.Value(-windowWidth)).current

    const [currentChart, setCurrentChart] = useState('daily')
    const [history, setHistory] = useState([])
    const [animating, setAnimating] = useState(false)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = () => {
        getLastObservations(20).then((observations) => {
            setHistory(observations)
        })
    }
    
    // Двигает карусель графиков вправо.
    const moveChartsRight = () => {
        if (animating) { return }
        setAnimating(true)

        if (currentChart === 'daily') {
            Animated.parallel([
                Animated.timing(dailyChartShiftValue, { 
                    toValue: windowWidth, 
                    useNativeDriver: true, 
                    duration: 250
                }),
                Animated.timing(weeklyChartShiftValue, {
                    toValue: 0, 
                    useNativeDriver: true, 
                    duration: 250
                })
            ]).start(() => {
                dailyChartShiftValue.setValue(-windowWidth)
                setCurrentChart('weekly')
                setAnimating(false)
            })
        } else {
            Animated.parallel([
                Animated.timing(weeklyChartShiftValue, { 
                    toValue: windowWidth, 
                    useNativeDriver: true, 
                    duration: 250
                }),
                Animated.timing(dailyChartShiftValue, {
                    toValue: 0, 
                    useNativeDriver: true, 
                    duration: 250
                })
            ]).start(() => {
                weeklyChartShiftValue.setValue(-windowWidth)
                setCurrentChart('daily')
                setAnimating(false)
            })
        }
    }

    // Двигает карусель графиков влево.
    const moveChartsLeft = () => {
        if (animating) { return }
        setAnimating(true)

        if (currentChart === 'daily') {
            weeklyChartShiftValue.setValue(windowWidth)
            Animated.parallel([
                Animated.timing(dailyChartShiftValue, { 
                    toValue: -windowWidth, 
                    useNativeDriver: true, 
                    duration: 250
                }),
                Animated.timing(weeklyChartShiftValue, { 
                    toValue: 0, 
                    useNativeDriver: true, 
                    duration: 250
                })
            ]).start(() => {
                setCurrentChart('weekly')
                setAnimating(false)
            })
        } else {
            dailyChartShiftValue.setValue(windowWidth)
            Animated.parallel([
                Animated.timing(weeklyChartShiftValue, { 
                    toValue: -windowWidth, 
                    useNativeDriver: true, 
                    duration: 250
                }),
                Animated.timing(dailyChartShiftValue, { 
                    toValue: 0, 
                    useNativeDriver: true, 
                    duration: 250
                })
            ]).start(() => {
                setCurrentChart('daily')
                setAnimating(false)
            })
        }
    }

    // Элемент истории наблюдений.
    const renderHistoryItem = (item) => {
        return (
            <View style={styles.historyItem}>
                <Text style={styles.historyItemValue}>{item.value}</Text>
                <Text style={styles.historyItemDate}>{item.date.toDateString()}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Header title={'stats'}/>

            <View style={styles.chartContainer}>
                <Animated.View style={[
                    styles.chartWrapper, { transform: [{translateX: dailyChartShiftValue}]}
                ]}><DailyChart /></Animated.View>
                <Animated.View style={[
                    styles.chartWrapper, { transform: [{translateX: weeklyChartShiftValue}]}
                ]}><WeeklyChart /></Animated.View>
            </View>

            <InfoBar 
                title={currentChart} 
                onPressLeft={() => moveChartsLeft()} 
                onPressRight={() => moveChartsRight()} />

            <View style={styles.separator} />
            <Text style={styles.historyTitle}>history</Text>
            <FlatList style={styles.historyList} data={history} renderItem={({ item }) => {
                return renderHistoryItem(item)
            }}/>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        opacity: 0.25
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    chartContainer: {
        position: 'relative',
        width: '100%',
        height: 300
    },
    chartWrapper: {
        position: 'absolute'
    },
    testButton: {
        margin: 50,
        height: 50,
        width: 50,
        backgroundColor: '#f00'
    },
    historyTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 28,
        textAlign: 'center',
        opacity: 0.75,
        marginTop: 24
    },
    historyList: {
        flex: 1,
        paddingTop: 16,
        marginBottom: 64
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 32,
        marginRight: 32,
        height: 56,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 28,
        margin: 4
    },
    historyItemValue: {
        fontFamily: 'Roboto-Bold',
        fontSize: 28,
        opacity: 0.75
    },
    historyItemDate: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        opacity: 0.75,
        textAlign: 'center'
    }
});