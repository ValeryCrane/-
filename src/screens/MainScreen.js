import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { VictoryLine, VictoryGroup } from 'victory-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getAverageObservationsForTimePeriod } from '../models/Storage';
import { predictLevelOfEnergy } from '../models/Predictor';

// Главный экран приложения.
export default function MainScreen({ navigation }) {
    const [energyLevel, setEnergyLevel] = useState(0)
    const [chartData, setChartData] = useState([])

    // Обновляем при попадпнии в фокус.
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            predictLevelOfEnergy(null).then((prediction) => {
                setEnergyLevel(Math.round(prediction))
            })
            getAverageObservationsForTimePeriod(10, 22, 5).then(observations =>{
                setChartData(observations)
            })
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
        <LinearGradient 
            style={styles.background}
            colors={['#fff', '#fff', '#78BCC1']}>
            <Header />
            <View style={styles.predictionWrapper}>
                <Text style={styles.predictionDigit}>{energyLevel}</Text>
                <Text style={styles.predictionDescriptionLabel}>predicted level of energy</Text>
                <TouchableOpacity 
                    style={styles.predictionIsWrongButton}
                    onPress={() => navigation.navigate('Ask')}
                >
                    <Text style={styles.predictionIsWrongLabel}>prediction is wrong</Text>
                </TouchableOpacity>
            </View>
            <Chart data={chartData}/>
        </LinearGradient>
        </View>
      );
}

// График на фоне.
function Chart({ data }) {
    return (
        <View style={styles.chartWrapper}>
            <VictoryGroup domain={{x: [10, 22], y: [0, 15]}} padding={0} height={500}>
                <VictoryLine 
                    x={() => (new Date().getHours())} 
                    domain={{y: [0, 15]}} 
                    style={{data: {strokeDasharray: 5, strokeWidth: 3}}}
                    color={'#fff'}/>
                <VictoryLine 
                    data={data} 
                    color={"#00B9C5"} 
                    interpolation={'natural'} 
                    style={{strokeWidth: 3}}/>
            </VictoryGroup>
        </View>
    )
}

// Заголовок с переходам к настройкам и статистике.
function Header() {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.headerWrapper}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.navigationButton} 
                    onPress={() => navigation.navigate('Settings')}
                >
                    <AntDesign name="setting" size={36} color="black" />
                    <Text style={styles.navigationButtonText}>settings</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.navigationButton}
                    onPress={() => navigation.navigate('Stats')}
                >
                    <Text style={styles.navigationButtonText}>stats</Text>
                    <AntDesign name="barschart" size={36} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    chartWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 500,
      zIndex: 0
    },
    predictionWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      marginLeft: 32,
      marginRight: 32,
      zIndex: 1
    },
    predictionDigit: {
      fontFamily: 'Roboto-Black',
      fontSize: 128,
      opacity: 0.75
    },
    predictionDescriptionLabel: {
      textAlign: 'center',
      fontFamily: 'Roboto-Black',
      fontSize: 32,
      opacity: 0.75,
      marginBottom: 12
    },
    predictionIsWrongButton: {
      height: 32,
      borderRadius: 18,
      backgroundColor: '#700000',
      opacity: 0.25,
      justifyContent: 'center',
      alignItems: 'center'
    },
    predictionIsWrongLabel: {
      textAlign: 'center',
      color: '#fff',
      marginLeft: 36,
      marginRight: 36,
      fontFamily: 'Roboto-Bold',
      fontSize: 18
    },
    headerWrapper: {
        position: 'absolute',
        top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        left: 0,
        right: 0,
    },
    header: {
        padding: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    navigationButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navigationButtonText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24,
        marginLeft: 8,
        marginRight: 8
    }
  });