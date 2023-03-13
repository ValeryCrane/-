import { VictoryLine, VictoryChart, VictoryBar, VictoryAxis} from 'victory-native';
import { useEffect, useRef, useState } from 'react';
import { getAverageObservationForDay, getAverageObservationsForTimePeriod } from '../../models/Storage';

const week = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
]

// График, выводящий средний показатель энергии по дням недели
export function WeeklyChart() {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var data = []
        for (var day = 0; day < week.length; day++) {
            data.push({
                x: day + 1,
                y: await getAverageObservationForDay(day, 5)
            })
        }
        setData(data)
    }

    return (
        <VictoryChart domain={{x: [0.5, 7.5], y: [0, 10]}}>
            <VictoryBar
                barRatio={0.9}
                data={data}
                style={{ data: { fill: "#00B9C5" } }}
                labels={({ datum }) => `${week[datum.x - 1]}`}
                />
            <VictoryAxis dependentAxis />
        </VictoryChart>
    )
}

// График с предсказанием уровня энергии в течение дня.
export function DailyChart() {
    const [data, setData] = useState(null)

    useEffect(() => {
        getAverageObservationsForTimePeriod(10, 22, 5).then(result => {
            setData(result)
        })
    }, [])

    return (
        <VictoryChart domain={{x: [10, 22], y: [0, 10]}}>
            <VictoryLine
                interpolation={'natural'}
                color={"#00B9C5"}
                data={data}
                style={{ data: { stroke: "#00B9C5" } }}
            />
            <VictoryAxis dependentAxis
                label={'energy'}
            />
            <VictoryAxis
                label={'hours'}
            />
        </VictoryChart>
    )
}
