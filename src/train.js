///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 Nick Naumenko (https://gitlab.com/nnaumenko, 
// https:/github.com/nnaumenko)
// All rights reserved.
// This software may be modified and distributed under the terms of the MIT 
// license. See the LICENSE file for details.
///////////////////////////////////////////////////////////////////////////////

function generateTrain(img, snd, rng) {
    const trainType = rng.range(0, 1);
    switch (trainType) {
        case 0: return generatePassengerTrain(img, snd, rng);
        default: return {}
    }
}

function generatePassengerTrain(img, snd, rng) {
    const config = {
        minSpeedPx: 550,
        maxSpeedPx: 900,
        maxPassengerWagons: 15,
        minPassengerWagons: 2,
        minDelayMs: 7000,
        maxDelayMs: 15000
    };
    const trainDelay = rng.range(config.minDelayMs, config.maxDelayMs);
    const trainDirection = rng.range(0, 2);
    const trainSpeed = rng.range(config.minSpeedPx, config.maxSpeedPx);
    const hasRearLocomotive = rng.range(0, 2);
    const passengerWagonNumber = rng.range(config.minPassengerWagons, config.maxPassengerWagons);
    const frontLocoId = img.randomInCategory("passenger_locomotive", rng);
    const rearLocoId = img.randomOtherVariant(frontLocoId, rng);

    const introSnd = snd.randomInCategory("train_inout", rng);
    const outroSnd = snd.randomOtherVariant(introSnd, rng);
    const loopSnd = snd.randomInCategory("train_loop", rng);
    const frontLocoSnd = snd.randomInCategory("locomotive", rng);
    const rearLocoSnd = snd.randomOtherVariant(frontLocoSnd, rng);
    const rearLocoWheelsSnd = snd.randomInCategory("wheels", rng);
    const wheelsFirstSnd = snd.randomInCategory("wheels_inout", rng);
    const wheelsLastSnd = snd.randomOtherVariant(wheelsFirstSnd, rng);
  
    let trainLayout = new Array();
    let trainSounds = new Array();
    trainLayout.push(frontLocoId);
    trainSounds.push([frontLocoSnd, wheelsFirstSnd]);
    for (let i = 0; i < passengerWagonNumber; i++) {
        trainLayout.push(img.randomInCategory("passenger_wagon", rng));
        trainSounds.push([snd.randomInCategory("wheels", rng)]);
    }
    if (hasRearLocomotive) {
        trainLayout.push(rearLocoId);
        trainSounds.push([rearLocoSnd, rearLocoWheelsSnd]);
    }
    trainSounds.push([wheelsLastSnd]);
    return {
        delay: trainDelay,
        direction: trainDirection,
        speed: trainSpeed, 
        train: trainLayout,
        sounds: {
            intro: introSnd,
            outro: outroSnd,
            loop: loopSnd,
            train: trainSounds
        }
    };
};

module.exports = {
    generateTrain
};