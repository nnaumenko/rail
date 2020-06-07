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
    if (trainType < 20) return generatePassengerTrain(img, snd, rng);
    if (trainType < 35) return generateSmallContainerTrain(img, snd, rng);
    if (trainType < 50) return generateLargeContainerTrain(img, snd, rng);
    if (trainType < 75) return generateSmallFreightTrain(img, snd, rng);
    return generateLargeMixedTrain(img, snd, rng);
}

function randomCategory(categories, rng) {
    const cat = rng.range(0, categories.length);
    return categories[cat];
}

function generateWagons(config, img, snd, rng) {
    let trainImg = new Array();
    let trainSnd = new Array();
    let wagon = img.randomInCategory(randomCategory(config.imageWagonCategories, rng), rng);
    let similarWagons = rng.range(config.minSimilarWagons, config.maxSimilarWagons);
    for (let i = 0; i < config.wagonNumber; i++) {
        trainImg.push(img.randomOtherVariant(wagon, rng));
        let wheelSound = snd.randomInCategory(config.soundCategoryWheelsMiddle, rng);
        if (config.trainBegin && !i) {
            wheelSound = snd.randomInCategory(config.soundCategoryWheelsBegin, rng);
        }
        trainSnd.push([wheelSound]);
        similarWagons--;
        if (similarWagons < 1) {
            wagon = wagon = img.randomInCategory(randomCategory(config.imageWagonCategories, rng), rng);
            similarWagons = rng.range(config.minSimilarWagons, config.maxSimilarWagons);
        }
    }
    if (config.trainEnd) {
        trainSnd.push([snd.randomInCategory(config.soundCategoryWheelsEnd, rng)]);
    }
    return {"trainImg": trainImg, "trainSnd": trainSnd};
}

function generateLocomotives(config, img, snd, rng) {
    let trainImg = new Array();
    let trainSnd = new Array();
    let loco = config.imageLocoId;
    if (loco === undefined) {
        loco = img.randomInCategory(randomCategory(config.imageLocoCategories, rng), rng);
    }
    const locoSnd = snd.randomInCategory(randomCategory(config.soundLocoCategories, rng), rng);
    for (let i = 0; i < config.locoNumber; i++) {
        trainImg.push(img.randomOtherVariant(loco, rng));
        let wheelSound = snd.randomInCategory(config.soundCategoryWheelsMiddle, rng);
        if (config.trainBegin && !i) {
            wheelSound = snd.randomInCategory(config.soundCategoryWheelsBegin, rng);
        }
        trainSnd.push([snd.randomOtherVariant(locoSnd, rng), wheelSound]);
    }
    if (config.trainEnd) {
        trainSnd.push([snd.randomInCategory(config.soundCategoryWheelsEnd, rng)]);
    }
    return {"trainImg": trainImg, "trainSnd": trainSnd};
}

function generateTrainTemplate(config, img, snd, rng) {
    const trainDelay = rng.range(config.minDelayMs, config.maxDelayMs);
    const trainDirection = rng.range(0, 2);
    const trainSpeed = rng.range(config.minSpeedPx, config.maxSpeedPx);
    const introSnd = snd.randomInCategory(randomCategory(config.soundIntroCategories, rng), rng);
    const loopSnd = snd.randomInCategory(randomCategory(config.soundLoopCategories, rng), rng);
    const outroSnd = snd.randomInCategory(randomCategory(config.soundOutroCategories, rng), rng);
    return {
        type: config.trainType,
        delay: trainDelay,
        direction: trainDirection,
        speed: trainSpeed, 
        train: new Array(),
        sounds: {
            intro: introSnd,
            loop: loopSnd,
            outro: outroSnd,
            train: new Array()
        }
    };
}

function generatePassengerTrain(img, snd, rng) {
    // Generate number of wagons and whether train has rear locomotive
    const minWagons = 2;
    const maxWagons = 15;
    const numberOfWagons = rng.range(minWagons, maxWagons);
    const hasRearLocomotive = rng.range(0, 2);
    // Generate general train info
    const trainConfig = {
        trainType: "passenger_train",
        minDelayMs: 7000,
        maxDelayMs: 15000,
        minSpeedPx: 550,
        maxSpeedPx: 900,
        soundIntroCategories: ["train_inout"],
        soundOutroCategories: ["train_inout"],
        soundLoopCategories: ["train_loop"]
    };
    let train = generateTrainTemplate(trainConfig, img, snd, rng);
    // Generate front locomotive
    const frontLocoConfig = {
        imageLocoCategories: ["passenger_locomotive"],
        soundLocoCategories: ["locomotive"],
        soundCategoryWheelsBegin: "wheels_inout",
        soundCategoryWheelsMiddle: "wheels",
        soundCategoryWheelsEnd: "wheels_inout",
        locoNumber: 1,
        trainBegin: true,
        trainEnd: false
    };
    const frontLoco = generateLocomotives(frontLocoConfig, img, snd, rng);
    const frontLocoId = frontLoco.trainImg[0];
    train.train = train.train.concat(frontLoco.trainImg);
    train.sounds.train = train.sounds.train.concat(frontLoco.trainSnd);
    // Generate wagons
    const wagonConfig = {
        imageWagonCategories: ["passenger_wagon"],
        soundCategoryWheelsBegin: "wheels_inout",
        soundCategoryWheelsMiddle: "wheels",
        soundCategoryWheelsEnd: "wheels_inout",
        wagonNumber: numberOfWagons,
        minSimilarWagons: (wagons + 1),
        maxSimilarWagons: (wagons + 2),
        trainBegin: false,
        trainEnd: (!hasRearLocomotive)
    };
    const wagons = generateWagons(wagonConfig, img, snd, rng);
    train.train = train.train.concat(wagons.trainImg);
    train.sounds.train = train.sounds.train.concat(wagons.trainSnd);
    // Generate rear locomotive (if present)
    const rearLocoConfig = {
        imageLocoCategories: ["passenger_locomotive"],
        soundLocoCategories: ["locomotive"],
        soundCategoryWheelsBegin: "wheels_inout",
        soundCategoryWheelsMiddle: "wheels",
        soundCategoryWheelsEnd: "wheels_inout",
        locoId: frontLocoId,
        locoNumber: 1,
        trainBegin: false,
        trainEnd: true
    };
    if (hasRearLocomotive) {
        const rearLoco = generateLocomotives(rearLocoConfig, img, snd, rng);
        train.train = train.train.concat(rearLoco.trainImg);
        train.sounds.train = train.sounds.train.concat(rearLoco.trainSnd);
    }
    return train;
}

/*
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
*/
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

function generateLargeContainerTrain(img, snd, rng) {
    const config = {
        minSpeedPx: 650,
        maxSpeedPx: 1000,
        maxContainerWagons: 120,
        minContainerWagons: 30,
        maxSimilarWagons: 15,
        wagonsPerLocomotive: 50,
        minDelayMs: 7000,
        maxDelayMs: 15000
    };
  
    const trainDelay = rng.range(config.minDelayMs, config.maxDelayMs);
    const trainDirection = rng.range(0, 2);
    const trainSpeed = rng.range(config.minSpeedPx, config.maxSpeedPx);
    const wagonNumber = rng.range(config.minContainerWagons, config.maxContainerWagons);
    const locoNumber = Math.ceil(wagonNumber / config.wagonsPerLocomotive);
    const locoId = img.randomInCategory("freight_locomotive", rng);

    const introSnd = snd.randomInCategory("train_inout", rng);
    const outroSnd = snd.randomOtherVariant(introSnd, rng);
    const loopSnd = snd.randomInCategory("train_loop", rng);
    const locoSnd = snd.randomInCategory("locomotive", rng);
    const wheelsFirstSnd = snd.randomInCategory("wheels_inout", rng);
    const wheelsLastSnd = snd.randomOtherVariant(wheelsFirstSnd, rng);

    var containerWagon = img.randomInCategory("container_wagon", rng);
    var similarWagons = rng.range(1, config.maxSimilarWagons);
    
    let trainLayout = new Array();
    let trainSounds = new Array();
    trainLayout.push(locoId);
    trainSounds.push([locoSnd, wheelsFirstSnd]);
    for (let i = 0; i < (locoNumber-1); i++) {
        trainLayout.push(img.randomOtherVariant(locoId, rng));
        trainSounds.push([
            snd.randomOtherVariant(locoSnd, rng),
            snd.randomInCategory("wheels", rng)
        ]);
    }
    for (let i = 0; i < wagonNumber; i++) {
        trainLayout.push(img.randomOtherVariant(containerWagon, rng));
        trainSounds.push([snd.randomInCategory("wheels", rng)]);
        similarWagons--;
        if (similarWagons < 1) {
            containerWagon = img.randomInCategory("container_wagon", rng);
            similarWagons = rng.range(1, config.maxSimilarWagons);
        }
    }
    trainSounds.push([wheelsLastSnd]);
    return {
        type: "large_container_train",
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

function generateLargeMixedTrain(img, snd, rng) {
    const config = {
        minSpeedPx: 650,
        maxSpeedPx: 1000,
        maxContainerWagons: 120,
        minContainerWagons: 30,
        minSimilarWagons: 4,
        maxSimilarWagons: 12,
        wagonsPerLocomotive: 50,
        minDelayMs: 7000,
        maxDelayMs: 15000
    };

    const wagonCategories = [
        "container_wagon",
        "car_wagon",
        "covered_wagon",
        "gondola_wagon",
        "hopper_wagon",
        "refrigerator_wagon",
        "skeleton_wagon",
        "tank_wagon"
    ];

    const trainDelay = rng.range(config.minDelayMs, config.maxDelayMs);
    const trainDirection = rng.range(0, 2);
    const trainSpeed = rng.range(config.minSpeedPx, config.maxSpeedPx);
    const wagonNumber = rng.range(config.minContainerWagons, config.maxContainerWagons);
    const locoNumber = Math.ceil(wagonNumber / config.wagonsPerLocomotive);
    const locoId = img.randomInCategory("freight_locomotive", rng);

    const introSnd = snd.randomInCategory("train_inout", rng);
    const outroSnd = snd.randomOtherVariant(introSnd, rng);
    const loopSnd = snd.randomInCategory("train_loop", rng);
    const locoSnd = snd.randomInCategory("locomotive", rng);
    const wheelsFirstSnd = snd.randomInCategory("wheels_inout", rng);
    const wheelsLastSnd = snd.randomOtherVariant(wheelsFirstSnd, rng);

    var wagon = img.randomInCategory(randomCategory(wagonCategories, rng), rng);
    var similarWagons = rng.range(config.minSimilarWagons, config.maxSimilarWagons);
    
    let trainLayout = new Array();
    let trainSounds = new Array();
    trainLayout.push(locoId);
    trainSounds.push([locoSnd, wheelsFirstSnd]);
    for (let i = 0; i < (locoNumber-1); i++) {
        trainLayout.push(img.randomOtherVariant(locoId, rng));
        trainSounds.push([
            snd.randomOtherVariant(locoSnd, rng),
            snd.randomInCategory("wheels", rng)
        ]);
    }
    for (let i = 0; i < wagonNumber; i++) {
        trainLayout.push(img.randomOtherVariant(wagon, rng));
        trainSounds.push([snd.randomInCategory("wheels", rng)]);
        similarWagons--;
        if (similarWagons < 1) {
            wagon = wagon = img.randomInCategory(randomCategory(wagonCategories, rng), rng);
            similarWagons = rng.range(config.minSimilarWagons, config.maxSimilarWagons);
        }
    }
    trainSounds.push([wheelsLastSnd]);
    return {
        type: "large_mixed_train",
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