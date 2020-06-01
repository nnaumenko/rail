///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 Nick Naumenko (https://gitlab.com/nnaumenko, 
// https:/github.com/nnaumenko)
// All rights reserved.
// This software may be modified and distributed under the terms of the MIT 
// license. See the LICENSE file for details.
///////////////////////////////////////////////////////////////////////////////

function generate(img, snd, rng) {
    const trainType = rng.range(0, 100);
    if (trainType < 5) return generateSingleLocomotive(img, snd, rng);
    if (trainType < 25) return generatePassengerTrain(img, snd, rng);
    if (trainType < 35) return generateSmallContainerTrain(img, snd, rng);
    return generateSmallFreightTrain(img, snd, rng);
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
        type: "passenger_train",
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

function generateSmallContainerTrain(img, snd, rng) {
    const config = {
        minSpeedPx: 550,
        maxSpeedPx: 900,
        maxContainerWagons: 20,
        minContainerWagons: 10,
        minDelayMs: 7000,
        maxDelayMs: 15000
    };
  
    const variousContainerTypes = rng.range(0, 2);
    const trainDelay = rng.range(config.minDelayMs, config.maxDelayMs);
    const trainDirection = rng.range(0, 2);
    const trainSpeed = rng.range(config.minSpeedPx, config.maxSpeedPx);
    const wagonNumber = rng.range(config.minContainerWagons, config.maxContainerWagons);
    const locoId = img.randomInCategory("passenger_locomotive", rng);

    const introSnd = snd.randomInCategory("train_inout", rng);
    const outroSnd = snd.randomOtherVariant(introSnd, rng);
    const loopSnd = snd.randomInCategory("train_loop", rng);
    const locoSnd = snd.randomInCategory("locomotive", rng);
    const wheelsFirstSnd = snd.randomInCategory("wheels_inout", rng);
    const wheelsLastSnd = snd.randomOtherVariant(wheelsFirstSnd, rng);

    const containerWagon = img.randomInCategory("container_wagon", rng);

    let trainLayout = new Array();
    let trainSounds = new Array();
    trainLayout.push(locoId);
    trainSounds.push([locoSnd, wheelsFirstSnd]);
    for (let i = 0; i < wagonNumber; i++) {
        if (variousContainerTypes > 0) {
            trainLayout.push(img.randomInCategory("container_wagon", rng));
        } else {
            trainLayout.push(img.randomOtherVariant(containerWagon, rng));
        }
        trainSounds.push([snd.randomInCategory("wheels", rng)]);
    }
    trainSounds.push([wheelsLastSnd]);
    return {
        type: "small_container_train",
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

function randomCategory(categories, rng) {
    const cat = rng.range(0, categories.length);
    return categories[cat];
}

function generateSmallFreightTrain(img, snd, rng) {
    const config = {
        minSpeedPx: 550,
        maxSpeedPx: 900,
        maxWagons: 12,
        minWagons: 5,
        maxWagonsMixed: 12,
        minWagonsMixed: 5,
        minDelayMs: 7000,
        maxDelayMs: 15000
    };
  
    const trainMixed = rng.range(0, 2);

    const trainDelay = rng.range(config.minDelayMs, config.maxDelayMs);
    const trainDirection = rng.range(0, 2);
    const trainSpeed = rng.range(config.minSpeedPx, config.maxSpeedPx);
    const minWagons = (trainMixed > 0) ? config.minWagonsMixed : config.minWagons;
    const maxWagons = (trainMixed > 0) ? config.maxWagonsMixed : config.maxWagons;
    const wagonNumber = rng.range(minWagons, maxWagons);
    const locoId = img.randomInCategory("passenger_locomotive", rng);

    const introSnd = snd.randomInCategory("train_inout", rng);
    const outroSnd = snd.randomOtherVariant(introSnd, rng);
    const loopSnd = snd.randomInCategory("train_loop", rng);
    const locoSnd = snd.randomInCategory("locomotive", rng);
    const wheelsFirstSnd = snd.randomInCategory("wheels_inout", rng);
    const wheelsLastSnd = snd.randomOtherVariant(wheelsFirstSnd, rng);

    const wagonCategories = [
        "container_wagon",
        "car_wagon",
        "covered_wagon",
        "gondola_wagon",
        "hopper_wagon",
        "open_wagon",
        "refrigerator_wagon",
        "skeleton_wagon",
        "tank_wagon",
    ];

    let wagonCategory = randomCategory(wagonCategories, rng);
    let wagonId = img.randomInCategory(wagonCategory, rng);

    let trainLayout = new Array();
    let trainSounds = new Array();
    trainLayout.push(locoId);
    trainSounds.push([locoSnd, wheelsFirstSnd]);
    for (let i = 0; i < wagonNumber; i++) {
        if (trainMixed > 0) {
            wagonCategory = randomCategory(wagonCategories, rng);
            wagonId = img.randomInCategory(wagonCategory, rng);
        } else {
            wagonId = img.randomOtherVariant(wagonId, rng);
        }
        trainLayout.push(wagonId);
        trainSounds.push([snd.randomInCategory("wheels", rng)]);
    }
    trainSounds.push([wheelsLastSnd]);

    const trainTypeStr = (trainMixed > 0) ? "mixed" : wagonCategory;

    return {
        type: "small_" + trainTypeStr + "_train",
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

function generateSingleLocomotive(img, snd, rng) {
    const config = {
        minSpeedPx: 450,
        maxSpeedPx: 1300,
        minDelayMs: 7000,
        maxDelayMs: 15000
    };
    const locoCategories = [
        "passenger_locomotive",
        "freight_locomotive"
    ];
    let locoCategory = randomCategory(locoCategories, rng);
    let locoId = img.randomInCategory(locoCategory, rng);

    const trainDelay = rng.range(config.minDelayMs, config.maxDelayMs);
    const trainDirection = rng.range(0, 2);
    const trainSpeed = rng.range(config.minSpeedPx, config.maxSpeedPx);

    const introSnd = snd.randomInCategory("train_inout", rng);
    const outroSnd = snd.randomOtherVariant(introSnd, rng);
    const loopSnd = snd.randomInCategory("train_loop", rng);
    const locoSnd = snd.randomInCategory("locomotive", rng);
    const wheelsFirstSnd = snd.randomInCategory("wheels_inout", rng);
    const wheelsLastSnd = snd.randomOtherVariant(wheelsFirstSnd, rng);

    let trainLayout = new Array();
    let trainSounds = new Array();
    trainLayout.push(locoId);
    trainSounds.push([locoSnd, wheelsFirstSnd]);
    trainSounds.push([wheelsLastSnd]);

    return {
        type: "single_" + locoCategory,
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

}


module.exports = {
    generate
};