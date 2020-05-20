///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 Nick Naumenko (https://gitlab.com/nnaumenko, 
// https:/github.com/nnaumenko)
// All rights reserved.
// This software may be modified and distributed under the terms of the MIT 
// license. See the LICENSE file for details.
///////////////////////////////////////////////////////////////////////////////

function generateTrain(img, rng) {
    const trainType = rng.range(0, 1);
    switch (trainType) {
        case 0: return generatePassengerTrain(img, rng);
        default: return {}
    }
}

function generatePassengerTrain(img, rng) {
    const config = {
        minSpeedPx: 650,
        maxSpeedPx: 850,
        maxPassengerWagons: 15,
        minPassengerWagons: 2,
        minDelayMs: 7000,
        maxDelayMs: 15000
    };
    let trainLayout = new Array();
    const trainDelay = rng.range(config.minDelayMs, config.maxDelayMs);
    const trainDirection = rng.range(0, 2);
    const trainSpeed = rng.range(config.minSpeedPx, config.maxSpeedPx);
    const hasRearLocomotive = rng.range(0, 2);
    const passengerWagonNumber = rng.range(config.minPassengerWagons, config.maxPassengerWagons);
    const frontLocoId = img.randomInCategory("passenger_locomotive", rng, img);
    const rearLocoId = img.randomOtherVariant(frontLocoId, rng);
    trainLayout.push(frontLocoId);
    let wagonId = img.randomInCategory("passenger_wagon", rng);
    for (let i = 0; i < passengerWagonNumber; i++) {
        trainLayout.push(wagonId);
        wagonId = img.randomOtherVariant(wagonId, rng);
    }
    if (hasRearLocomotive) trainLayout.push(rearLocoId);
    return {
        delay: trainDelay,
        direction: trainDirection,
        speed: trainSpeed, 
        train: trainLayout
    };
};

module.exports = {
    generateTrain
};