///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 Nick Naumenko (https://gitlab.com/nnaumenko, 
// https:/github.com/nnaumenko)
// All rights reserved.
// This software may be modified and distributed under the terms of the MIT 
// license. See the LICENSE file for details.
///////////////////////////////////////////////////////////////////////////////

function generate(img, snd, rng) {
    const trainType = rng.range(0, 100);
    if (trainType < 10) return generateSingleLocomotive(img, snd, rng);
    if (trainType < 30) return generatePassengerTrain(img, snd, rng);
    if (trainType < 50) return generateContainerTrain(img, snd, rng);
    return generateFreightTrain(img, snd, rng);
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
    return { "trainImg": trainImg, "trainSnd": trainSnd };
}

function generateLocomotives(config, img, snd, rng) {
    let trainImg = new Array();
    let trainSnd = new Array();
    let loco = config.imageLocoId;
    if (loco === undefined) {
        loco = img.randomInCategory(randomCategory(config.imageLocoCategories, rng), rng);
    }
    const firstLocoId = loco;
    const onlyForwardLocos = rng.range(0, 2);
    const locoSnd = snd.randomInCategory(randomCategory(config.soundLocoCategories, rng), rng);
    for (let i = 0; i < config.locoNumber; i++) {
        trainImg.push(img.randomOtherVariant(loco, rng));
        let wheelSound = snd.randomInCategory(config.soundCategoryWheelsMiddle, rng);
        if (config.trainBegin && !i) {
            wheelSound = snd.randomInCategory(config.soundCategoryWheelsBegin, rng);
        }
        trainSnd.push([snd.randomOtherVariant(locoSnd, rng), wheelSound]);

        const attr = img.getAttributes(loco);
        const locosToGenerate = config.locoNumber - i - 1;
        if (locosToGenerate >= 2 && (attr.sectionB !== undefined)) {
            // Next locomotive will be section B of the current locomotive
            loco = attr.sectionB[0];
            continue;
        }
        if ((attr.reverse !== undefined && !onlyForwardLocos) || attr.isSectionA) {
            // Next locomotive will be reversed version of the current locomotive
            loco = attr.reverse[0];
            continue;
        }
        if (attr.isSectionB) {
            // This locomotive was a section B, the next one must be reverse section
            loco = attr.reverse[0];
            continue;
        }
        if (attr.isReverse) {
            // This locomotive was a reverse section, the next one must be forward section 
            loco = firstLocoId;
            continue;
        }
    }
    if (config.trainEnd) {
        trainSnd.push([snd.randomInCategory(config.soundCategoryWheelsEnd, rng)]);
    }
    return { "trainImg": trainImg, "trainSnd": trainSnd };
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
        minSimilarWagons: (numberOfWagons + 1),
        maxSimilarWagons: (numberOfWagons + 2),
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

function generateSingleLocomotive(img, snd, rng) {
    // Generate general train info
    const trainConfig = {
        trainType: "single_locomotive",
        minDelayMs: 7000,
        maxDelayMs: 15000,
        minSpeedPx: 450,
        maxSpeedPx: 1300,
        soundIntroCategories: ["train_inout"],
        soundOutroCategories: ["train_inout"],
        soundLoopCategories: ["train_loop"]
    };
    let train = generateTrainTemplate(trainConfig, img, snd, rng);
    // Generate locomotive
    const locoNumber = rng.range(1, 4);
    const locoConfig = {
        imageLocoCategories: [
            "passenger_locomotive",
            "freight_locomotive",
            "freight_locomotive_section_a"
        ],
        soundLocoCategories: ["locomotive"],
        soundCategoryWheelsBegin: "wheels_inout",
        soundCategoryWheelsMiddle: "wheels",
        soundCategoryWheelsEnd: "wheels_inout",
        locoNumber: locoNumber,
        trainBegin: true,
        trainEnd: true
    };
    const loco = generateLocomotives(locoConfig, img, snd, rng);
    train.train = train.train.concat(loco.trainImg);
    train.sounds.train = train.sounds.train.concat(loco.trainSnd);
    return train;
}

function generateContainerTrain(img, snd, rng) {
    // Establish configurations for large and small trains
    const largeTrainConfig = {
        minWagons: 30,
        maxWagons: 120,
        maxSimilarWagons: 15,
        trainType: "large_container_train",
        locoCategories: ["freight_locomotive", "freight_locomotive_reverse_section_a"],
        wagonsPerLocomotive: 50,
        minSpeed: 650,
        maxSpeed: 1000
    };
    const smallTrainConfig = {
        minWagons: 10,
        maxWagons: 20,
        maxSimilarWagons: 2,
        trainType: "small_container_train",
        locoCategories: ["passenger_locomotive", "freight_locomotive"],
        wagonsPerLocomotive: 15,
        minSpeed: 450,
        maxSpeed: 1300
    };
    // Generate train size, number of wagons / locos, container type variation...
    const trainSize = rng.range(0, 2);
    const trainCfg = trainSize ? largeTrainConfig : smallTrainConfig;
    const numberOfWagons = rng.range(trainCfg.minWagons, trainCfg.maxWagons);
    const variousContainerTypes = trainSize ? 1 : rng.range(0, 2);
    const minSimilarWagons = variousContainerTypes ? 1 : (numberOfWagons + 1);
    const maxSimilarWagons =
        variousContainerTypes ? trainCfg.maxSimilarWagons : (numberOfWagons + 2);
    const numberOfLocomotives = Math.ceil(numberOfWagons / trainCfg.wagonsPerLocomotive);
    // Generate general train info
    const trainConfig = {
        trainType: trainCfg.trainType,
        minDelayMs: 7000,
        maxDelayMs: 15000,
        minSpeedPx: trainCfg.minSpeed,
        maxSpeedPx: trainCfg.maxSpeed,
        soundIntroCategories: ["train_inout"],
        soundOutroCategories: ["train_inout"],
        soundLoopCategories: ["train_loop"]
    };
    let train = generateTrainTemplate(trainConfig, img, snd, rng);
    // Generate locomotive
    const locoConfig = {
        imageLocoCategories: trainCfg.locoCategories,
        soundLocoCategories: ["locomotive"],
        soundCategoryWheelsBegin: "wheels_inout",
        soundCategoryWheelsMiddle: "wheels",
        soundCategoryWheelsEnd: "wheels_inout",
        locoNumber: numberOfLocomotives,
        trainBegin: true,
        trainEnd: false
    };
    const loco = generateLocomotives(locoConfig, img, snd, rng);
    train.train = train.train.concat(loco.trainImg);
    train.sounds.train = train.sounds.train.concat(loco.trainSnd);
    // Generate wagons
    const wagonConfig = {
        imageWagonCategories: ["container_wagon"],
        soundCategoryWheelsBegin: "wheels_inout",
        soundCategoryWheelsMiddle: "wheels",
        soundCategoryWheelsEnd: "wheels_inout",
        wagonNumber: numberOfWagons,
        minSimilarWagons: minSimilarWagons,
        maxSimilarWagons: maxSimilarWagons,
        trainBegin: false,
        trainEnd: true
    };
    const wagons = generateWagons(wagonConfig, img, snd, rng);
    train.train = train.train.concat(wagons.trainImg);
    train.sounds.train = train.sounds.train.concat(wagons.trainSnd);
    return train;
}

function generateFreightTrain(img, snd, rng) {
    // Establish configurations for large and small trains
    const largeTrainConfig = {
        minWagons: 30,
        maxWagons: 120,
        maxSimilarWagons: 15,
        locoCategories: ["freight_locomotive", "freight_locomotive_section_a"],
        wagonsPerLocomotive: 50,
        minSpeed: 650,
        maxSpeed: 1000
    };
    const smallTrainConfig = {
        minWagons: 10,
        maxWagons: 20,
        maxSimilarWagons: 2,
        locoCategories: ["passenger_locomotive", "freight_locomotive"],
        wagonsPerLocomotive: 15,
        minSpeed: 550,
        maxSpeed: 900
    };
    const cargoWagonCategories = [
        "container_wagon",
        "car_wagon",
        "covered_wagon",
        "flat_wagon",
        "hopper_wagon",
        "open_wagon",
        "refrigerator_wagon",
        "skeleton_wagon",
        "tank_wagon",
    ];
    // Generate train size, number of wagons / locos, container type variation...
    const trainSize = rng.range(0, 2);
    const trainCfg = trainSize ? largeTrainConfig : smallTrainConfig;
    const numberOfWagons = rng.range(trainCfg.minWagons, trainCfg.maxWagons);
    const mixedCargo = trainSize ? 1 : rng.range(0, 2);
    const minSimilarWagons = mixedCargo ? 1 : (numberOfWagons + 1);
    const maxSimilarWagons = mixedCargo ? trainCfg.maxSimilarWagons : (numberOfWagons + 2);
    const numberOfLocomotives = Math.ceil(numberOfWagons / trainCfg.wagonsPerLocomotive);
    const wagonCategories =
        mixedCargo ? cargoWagonCategories : [randomCategory(cargoWagonCategories, rng)];
    const trainType =
        (trainSize ? "large_" : "small_") + (mixedCargo ? "mixed" : wagonCategories[0]) + "_train";
    // Generate general train info
    const trainConfig = {
        trainType: trainType,
        minDelayMs: 7000,
        maxDelayMs: 15000,
        minSpeedPx: trainCfg.minSpeed,
        maxSpeedPx: trainCfg.maxSpeed,
        soundIntroCategories: ["train_inout"],
        soundOutroCategories: ["train_inout"],
        soundLoopCategories: ["train_loop"]
    };
    let train = generateTrainTemplate(trainConfig, img, snd, rng);
    // Generate locomotive
    const locoConfig = {
        imageLocoCategories: trainCfg.locoCategories,
        soundLocoCategories: ["locomotive"],
        soundCategoryWheelsBegin: "wheels_inout",
        soundCategoryWheelsMiddle: "wheels",
        soundCategoryWheelsEnd: "wheels_inout",
        locoNumber: numberOfLocomotives,
        trainBegin: true,
        trainEnd: false
    };
    const loco = generateLocomotives(locoConfig, img, snd, rng);
    train.train = train.train.concat(loco.trainImg);
    train.sounds.train = train.sounds.train.concat(loco.trainSnd);
    // Generate wagons
    const wagonConfig = {
        imageWagonCategories: wagonCategories,
        soundCategoryWheelsBegin: "wheels_inout",
        soundCategoryWheelsMiddle: "wheels",
        soundCategoryWheelsEnd: "wheels_inout",
        wagonNumber: numberOfWagons,
        minSimilarWagons: minSimilarWagons,
        maxSimilarWagons: maxSimilarWagons,
        trainBegin: false,
        trainEnd: true
    };
    const wagons = generateWagons(wagonConfig, img, snd, rng);
    train.train = train.train.concat(wagons.trainImg);
    train.sounds.train = train.sounds.train.concat(wagons.trainSnd);
    return train;
};

module.exports = {
    generate
};