import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const key = "OBSERAVTIONS_KEY";

// Observarion functions.

// Добавляет в базу данных новое наблюдение.
export async function addObservation(value) {
    const date = new Date()
    const observations = await getData(key)
    if (observations === null) {
        await storeData([{
            value: value,
            date: date.getTime()
        }], key);
    } else {
        await storeData([{
            value: value,
            date: date.getTime()
        }, ...observations], key);
    }
}

// Возвращает последние count наблюдений.
export async function getLastObservations(count) {
    const observations = await getData(key)
    if (observations === null) {
        return [];
    } else {
        return observations.slice(0, count).map(observation => {
            return {
                ...observation,
                date: new Date(observation.date)
            }
        })
    }
}

// Возвращает средний уровень энергии для часа hour. Если 
export async function getAverageObservationForHour(hour, defaultValue) {
    const observations = await getData(key)
    if (observations === null) {
        return defaultValue
    } else {
        let sum = 0
        let count = 0
        for (const observation of observations) {
            const date = new Date(observation.date)
            if (date.getHours() === hour) {
                sum += observation.value
                count += 1
            }
        }
        if (count === 0) {
            return defaultValue
        } else {
            return sum / count
        }
    }
}

// Возвращвет массив координат для построения графика средних уравней энергии каждый час.
export async function getAverageObservationsForTimePeriod(from, to, defaultValue) {
    let answer = []
    for (var hour = from; hour <= to; hour++) {
        answer.push({
            x: hour,
            y: await getAverageObservationForHour(hour, defaultValue)
        })
    }
    return answer
}

// Получает средний уровень энергии для дня недели.
export async function getAverageObservationForDay(day, defaultValue) {
    day = (day === 6) ? 0 : day + 1
    const observations = await getData(key)
    if (observations === null) {
        return defaultValue
    } else {
        let sum = 0
        let count = 0
        for (const observation of observations) {
            const date = new Date(observation.date)
            if (date.getDay() === day) {
                sum += observation.value
                count += 1
            }
        }
        if (count === 0) {
            return defaultValue
        } else {
            return sum / count
        }
    }
}

// Cloud functions.

// Сохраняет все хранилище в облаке.
export async function saveStorageInCloud() {
    const storage = await exportStorage();
    await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        { data: storage }
    )
}

// Скачивает все хранилище с облака.
export async function loadStorageFromCloud() {
    const querySnapshot = await getDoc(
        doc(db, 'users', auth.currentUser.uid)
    );
    if (querySnapshot.exists()) {
        importStorage(querySnapshot.data().data)
    }
}

// Очищает хранилище.
export async function clearStorage() {
    await importStorage(null)
}

async function exportStorage() {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log("Error while reading values in AsyncStorage");
        return null;
    }
}

async function importStorage(json) {
    try {
        const jsonValue = JSON.stringify(json);
        await AsyncStorage.setItem(key, jsonValue);
        return true
    } catch (e) {
        console.log("Error while saving values in AsyncStorage");
        return false
    }
}

// System functions.

async function storeData(value, key) {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true
    } catch (e) {
        console.log("Error while saving values in AsyncStorage");
        return false
    }
}

async function getData(key) {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log("Error while reading values in AsyncStorage");
        return null;
    }
}