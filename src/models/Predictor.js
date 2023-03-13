import { getAverageObservationsForTimePeriod } from './Storage';

const START_TIME = 10;
const END_TIME = 22;
const DEFAULT_ENERGY = 5;

// Предсказывает уровень энергии для заданного часа.
export async function predictLevelOfEnergy(hour) {
    hour = hour === null ? (new Date()).getHours() : hour;

    const averageObservations = await getAverageObservationsForTimePeriod(
        START_TIME, 
        END_TIME, 
        DEFAULT_ENERGY
    );
    const x = averageObservations.map(observation => observation.x);
    const y = averageObservations.map(observation => observation.y);

    const Spline = require('cubic-spline');
    const spline = new Spline(x, y);

    return spline.at(hour)
}
