///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 Nick Naumenko (https://gitlab.com/nnaumenko, 
// https:/github.com/nnaumenko)
// All rights reserved.
// This software may be modified and distributed under the terms of the MIT 
// license. See the LICENSE file for details.
///////////////////////////////////////////////////////////////////////////////

import Phaser from "phaser";
import Random from "rng";
import Assets from "./assets.js";
import Train from "./train.js";
import Landscape from "./landscape.js";

const screenLayout = {
    width: 1024,
    height: 576,
    groundHeight: 480,
    railHeight: 8
}

///////////////////////////////////////////////////////////////////////
// Import of all images and sounds used by this animation.
// initImageInventory and initSoundInventory both return an 
// Assets.Inventory object
///////////////////////////////////////////////////////////////////////

import passenger_locomotives_3 from "./assets/passenger_locomotives/loco_3.png";
import passenger_locomotives_3_blue from "./assets/passenger_locomotives/loco_3_blue.png";
import passenger_locomotives_3_green from "./assets/passenger_locomotives/loco_3_green.png";
import passenger_locomotives_3_red from "./assets/passenger_locomotives/loco_3_red.png";
import passenger_locomotives_3_tan from "./assets/passenger_locomotives/loco_3_tan.png";

import freight_locomotives_1_2_blue from "./assets/freight_locomotives/loco_freight_1_2_blue.png";
import freight_locomotives_1_2_gray from "./assets/freight_locomotives/loco_freight_1_2_gray.png";
import freight_locomotives_1_2_green from "./assets/freight_locomotives/loco_freight_1_2_green.png";
import freight_locomotives_1_2_red from "./assets/freight_locomotives/loco_freight_1_2_red.png";
import freight_locomotives_1_2_yellow from "./assets/freight_locomotives/loco_freight_1_2_yellow.png";
import freight_locomotives_2_blue from "./assets/freight_locomotives/loco_freight_2_blue.png";
import freight_locomotives_2_green from "./assets/freight_locomotives/loco_freight_2_green.png";
import freight_locomotives_2_tan from "./assets/freight_locomotives/loco_freight_2_tan.png";

import passenger_wagons_1a from "./assets/passenger_wagons/passenger_wagon_1a.png";
import passenger_wagons_1b from "./assets/passenger_wagons/passenger_wagon_1b.png";
import passenger_wagons_1c from "./assets/passenger_wagons/passenger_wagon_1c.png";
import passenger_wagons_1d from "./assets/passenger_wagons/passenger_wagon_1d.png";

import containter_wagons_blue from "./assets/containter_wagons/container-blue.png";
import containter_wagons_brown from "./assets/containter_wagons/container-brown.png";
import containter_wagons_green from "./assets/containter_wagons/container-green.png";
import containter_wagons_purple from "./assets/containter_wagons/container-purple.png";
import containter_wagons_red from "./assets/containter_wagons/container-red.png";
import containter_wagons_tan from "./assets/containter_wagons/container-tan.png";
import containter_wagons_white from "./assets/containter_wagons/container-white.png";
import containter_wagons_yellow from "./assets/containter_wagons/container-yellow.png";

import car_wagons_empty from "./assets/freight_wagons/car_transporter-empty.png";

import covered_wagon_blue from "./assets/freight_wagons/covered_wagon-blue.png";
import covered_wagon_brown from "./assets/freight_wagons/covered_wagon-brown.png";
import covered_wagon_green from "./assets/freight_wagons/covered_wagon-green.png";
import covered_wagon_red from "./assets/freight_wagons/covered_wagon-red.png";

import gondola_wagon_blue from "./assets/freight_wagons/gondola-blue.png";
import gondola_wagon_brown from "./assets/freight_wagons/gondola-brown.png";
import gondola_wagon_green from "./assets/freight_wagons/gondola-green.png";
import gondola_wagon_red from "./assets/freight_wagons/gondola-red.png";

import hopper_wagon_blue from "./assets/freight_wagons/hopper-blue.png";
import hopper_wagon_red from "./assets/freight_wagons/hopper-red.png";
import hopper_wagon_tan from "./assets/freight_wagons/hopper-tan.png";
import hopper_wagon_white from "./assets/freight_wagons/hopper-white.png";
import hopper_wagon_yellow from "./assets/freight_wagons/hopper-yellow.png";

import open_wagon_blue from "./assets/freight_wagons/open_wagon-blue.png";
import open_wagon_gray from "./assets/freight_wagons/open_wagon-gray.png";
import open_wagon_green from "./assets/freight_wagons/open_wagon-green.png";
import open_wagon_red from "./assets/freight_wagons/open_wagon-red.png";

import refrigerator_wagon_long_white from "./assets/freight_wagons/refrigerator_long-white.png";
import refrigerator_wagon_white from "./assets/freight_wagons/refrigerator-white.png";

import skeleton_wagon from "./assets/freight_wagons/skeleton-empty.png";

function initImageInventory() {
    var img = new Assets.Inventory();

    img.addType("passenger_locomotive", [
        passenger_locomotives_3
    ], { leftCoupling: 12, rightCoupling: 12 });
    img.addType("passenger_locomotive", [
        passenger_locomotives_3_blue,
    ], { leftCoupling: 12, rightCoupling: 12 });
    img.addType("passenger_locomotive", [
        passenger_locomotives_3_green,
    ], { leftCoupling: 12, rightCoupling: 12 });
    img.addType("passenger_locomotive", [
        passenger_locomotives_3_red,
    ], { leftCoupling: 12, rightCoupling: 12 });
    img.addType("passenger_locomotive", [
        passenger_locomotives_3_tan,
    ], { leftCoupling: 12, rightCoupling: 12 });

    img.addType("freight_locomotives", [
        freight_locomotives_1_2_blue
    ]);
    img.addType("freight_locomotives", [
        freight_locomotives_1_2_gray
    ]);
    img.addType("freight_locomotives", [
        freight_locomotives_1_2_green
    ]);
    img.addType("freight_locomotives", [
        freight_locomotives_1_2_red
    ]);
    img.addType("freight_locomotives", [
        freight_locomotives_1_2_yellow
    ]);
    img.addType("freight_locomotives", [
        freight_locomotives_2_blue
    ]);
    img.addType("freight_locomotives", [
        freight_locomotives_2_green
    ]);
    img.addType("freight_locomotives", [
        freight_locomotives_2_tan
    ]);

    img.addType("passenger_wagon", [
        passenger_wagons_1a,
        passenger_wagons_1b,
        passenger_wagons_1c,
        passenger_wagons_1d
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("container_wagon", [
        containter_wagons_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("container_wagon", [
        containter_wagons_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("container_wagon", [
        containter_wagons_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("container_wagon", [
        containter_wagons_purple
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("container_wagon", [
        containter_wagons_red
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("container_wagon", [
        containter_wagons_tan
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("container_wagon", [
        containter_wagons_white
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("container_wagon", [
        containter_wagons_yellow
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("car_wagon", [
        car_wagons_empty
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("covered_wagon", [
        covered_wagon_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_red
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("gondola_wagon", [
        gondola_wagon_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("gondola_wagon", [
        gondola_wagon_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("gondola_wagon", [
        gondola_wagon_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("gondola_wagon", [
        gondola_wagon_red
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("hopper_wagon", [
        hopper_wagon_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("hopper_wagon", [
        hopper_wagon_red
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("hopper_wagon", [
        hopper_wagon_tan
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("hopper_wagon", [
        hopper_wagon_white
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("hopper_wagon", [
        hopper_wagon_yellow
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("open_wagon", [
        open_wagon_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_gray
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_red
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("refrigerator_wagon", [
        refrigerator_wagon_long_white
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("refrigerator_wagon", [
        refrigerator_wagon_white
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("skeleton_wagon", [
        skeleton_wagon
    ], { leftCoupling: 8, rightCoupling: 5 });

    return img;
};

import snd_locomotive_1 from "./assets/train_sounds/train_in_out1.mp3";
import snd_train_inout_1 from "./assets/train_sounds/train_in_out1.mp3";
import snd_train_inout_2 from "./assets/train_sounds/train_in_out2.mp3";
import snd_train_loop_1 from "./assets/train_sounds/train_loop1.mp3";
import snd_wheels_1 from "./assets/train_sounds/wheels_5a.mp3";
import snd_wheels_2 from "./assets/train_sounds/wheels_5b.mp3";
import snd_wheels_3 from "./assets/train_sounds/wheels_5c.mp3";
import snd_wheels_4 from "./assets/train_sounds/wheels_5d.mp3";
import snd_wheels_5 from "./assets/train_sounds/wheels_5e.mp3";
import snd_wheels_6 from "./assets/train_sounds/wheels_5f.mp3";
import snd_wheels_7 from "./assets/train_sounds/wheels_5g.mp3";
import snd_wheels_inout_1 from "./assets/train_sounds/wheels2_5a.mp3";
import snd_wheels_inout_2 from "./assets/train_sounds/wheels2_5b.mp3";
import snd_wheels_inout_3 from "./assets/train_sounds/wheels2_5c.mp3";
import snd_wheels_inout_4 from "./assets/train_sounds/wheels2_5d.mp3";
import snd_wheels_inout_5 from "./assets/train_sounds/wheels2_5e.mp3";
import snd_wheels_inout_6 from "./assets/train_sounds/wheels2_5f.mp3";
import snd_wheels_inout_7 from "./assets/train_sounds/wheels2_5g.mp3";

function initSoundInventory() {
    var snd = new Assets.Inventory();

    snd.addType("locomotive", [
        snd_locomotive_1
    ]);

    snd.addType("train_inout", [
        snd_train_inout_1,
        snd_train_inout_2
    ]);

    snd.addType("train_loop", [
        snd_train_loop_1
    ]);

    snd.addType("wheels", [
        snd_wheels_1,
        snd_wheels_2,
        snd_wheels_3,
        snd_wheels_4,
        snd_wheels_5,
        snd_wheels_6,
        snd_wheels_7
    ]);

    snd.addType("wheels_inout", [
        snd_wheels_inout_1,
        snd_wheels_inout_2,
        snd_wheels_inout_3,
        snd_wheels_inout_4,
        snd_wheels_inout_5,
        snd_wheels_inout_6,
        snd_wheels_inout_7
    ]);

    return snd;
};


var timerText

///////////////////////////////////////////////////////////////////////
// class Train
// A train running once across screen on fire-and-forget principle
// Train is run horizontally at specified vertical position, with 
// specified speed, scale, and Z-depth, after specified delay.
// Automatically loads assets and sets up sprites.
// When it is detected that the train is out of the screen, the  
// sprites/groups are automatically deleted and assetes are removed 
// from memory
///////////////////////////////////////////////////////////////////////

class TrainAnimation {
    constructor(scene, img) {
        this.#scene = scene;
        this.#imageInventory = img;
        this.#trainActive = false;
        this.#loadedImages = new Set();
        this.#loadedSounds = new Set();
        this.#playingSounds = new Array();
    }
    get active() { return this.#trainActive; }
    get timer() {
        if (this.timedEvent === undefined) return undefined
        return this.timedEvent.getProgress();
    }
    set railsPosition(pos) { this.#screenLayout.posRailsY = pos; }
    get railsPosition() { return this.#screenLayout.posRailsY; }
    set leftPosition(pos) { this.#screenLayout.posLeftX = pos; }
    get leftPosition() { return this.#screenLayout.posLeftX; }
    set rightPosition(pos) { this.#screenLayout.posRightX = pos; }
    get rightPosition() { return this.#screenLayout.posRightX; }

    #scene;
    #imageInventory;
    #trainGroup;
    //#triggerGroup;
    #timedEvent;
    #trainActive;
    #screenLayout = {
        posRailsY: 576,
        posLeftX: 0,
        posRightX: 1024,
        scale: 1,
    };
    #sndLoop;
    #loadedImages;
    #playingSounds;
    #loadedSounds;

    setup(trainConfig) {
        console.debug("Setting up train")
        if (this.active) this.remove()
        this.#trainActive = true;

        console.debug("Train configuration", trainConfig);

        const scale = this.#screenLayout.scale;
        const posY = this.#screenLayout.posRailsY;
        const posX1 = this.#screenLayout.posLeftX;
        const posX2 = this.#screenLayout.posRightX;
        const sizeX = posX2 - posX1;

        let playsound = function (snd) {
            //this.playingSounds.push(snd);
            snd.play();
        }

        let stopsound = function (snd) {
            snd.stop();
        }

        let playOutroSound = function () {
            console.debug('Playing outro sound');
            let snd = this.#scene.sound.add('train_in_out2');
            snd.once('complete', this.remove, this);
            snd.play();
        }

        let createTrainInScene = function () {

            console.debug('Creating train');

            this.#trainGroup = this.#scene.physics.add.group();

            let trainLen = 0;
            let previousCoupling = 0;

            let sndFirst = this.#scene.sound.add('wheels0');
            sndFirst.rate = trainConfig.speed / 750;
            playsound(sndFirst);

            trainConfig.train.forEach(function (id, i, arr) {
                const sprName = 'tr_img_' + String(id);
                const attr = this.#imageInventory.getAttributes(id);
                const sprWidth = this.#scene.textures.get(sprName).source[0].width;
                if (trainConfig.direction) {
                    this.#trainGroup.create(posX2 + 1 + trainLen, posY, sprName);
                }
                trainLen += (sprWidth - attr.leftCoupling - previousCoupling) * scale;
                if (!trainConfig.direction) {
                    this.#trainGroup.create(posX1 - 1 - trainLen, posY, sprName);
                }

                previousCoupling = attr.rightCoupling;

                if (i != (arr.length - 1)) {
                    var snd = this.#scene.sound.add('wheels1');
                } else {
                    var snd = this.#scene.sound.add('wheels3');
                }
                snd.rate = trainConfig.speed / 750;
                let soundDelay = (trainLen - sizeX / 2) / trainConfig.speed / scale * 1000;
                this.#scene.time.delayedCall(soundDelay, playsound, [snd], this);
                if (this.#imageInventory.getCategoryById(id) == 'passenger_locomotive' ||
                    this.#imageInventory.getCategoryById(id) == 'freight_locomotive') {
                    let sndLoco = this.#scene.sound.add('locomotive1');
                    let soundLocoDelay = soundDelay - sprWidth * scale;
                    if (soundLocoDelay < 0) soundLocoDelay = 0;
                    this.#scene.time.delayedCall(soundLocoDelay, playsound, [sndLoco], this);
                }
            }.bind(this));
            this.#scene.time.delayedCall((trainLen - sizeX / 2) / trainConfig.speed / scale * 1000, stopsound, [this.sndLoop], this);
            this.#scene.time.delayedCall((trainLen - sizeX / 2) / trainConfig.speed / scale * 1000, playOutroSound, [], this);

            Phaser.Actions.Call(this.#trainGroup.getChildren(), function (spr) {
                if (!trainConfig.direction) {
                    spr.setVelocity(trainConfig.speed, 0);
                    spr.setScale(scale);
                    spr.setOrigin(0, 1);
                } else {
                    spr.setVelocity(-trainConfig.speed, 0);
                    spr.setScale(-scale, scale);
                    spr.setOrigin(1, 1);
                }
            })

            //this.triggerGroup = this.scene.physics.add.staticGroup();
            //this.triggerGroup.create(posX2 + 1 + trainLen, posY, 'placeholder');
            //this.triggerGroup.onOverlap = true;

            //this.scene.physics.add.overlap(this.triggerGroup, this.trainGroup, playOutroSound, null, this);
        }

        function playIntroSound() {
            console.debug('Playing intro sound');
            this.sndLoop = this.#scene.sound.add('trainloop', { loop: true });
            let snd = this.#scene.sound.add('train_in_out1');
            snd.once('complete', createTrainInScene, this);
            snd.play();
            this.timedEvent = this.#scene.time.delayedCall(3000, playsound, [this.sndLoop], this);
        }

        this.#scene.load.once('complete', function () {
            console.debug('Load complete');
            this.#timedEvent = this.#scene.time.delayedCall(
                trainConfig.delay,
                playIntroSound,
                [],
                this);
        }, this);

        //Phaser does not care if the same image is loaded multiple times
        console.debug('Loading train images');
        trainConfig.train.forEach(id => {
            const imgPath = this.#imageInventory.getPathById(id);
            this.#scene.load.image("tr_img_" + String(id), imgPath);
            this.#loadedImages.add("tr_img_" + String(id));
        });

        console.debug('Loading train sounds');
        this.#scene.load.audio('wheels0', ['assets/train_sounds/wheels2_5d.mp3']);
        this.#scene.load.audio('wheels1', ['assets/train_sounds/wheels_5a.mp3']);
        this.#scene.load.audio('wheels2', ['assets/train_sounds/wheels_5b.mp3']);
        this.#scene.load.audio('wheels3', ['assets/train_sounds/wheels2_5c.mp3']);
        this.#scene.load.audio('trainloop', ['assets/train_sounds/train_loop1.mp3']);
        this.#scene.load.audio('train_in_out1', ['assets/train_sounds/train_in_out1.mp3']);
        this.#scene.load.audio('train_in_out2', ['assets/train_sounds/train_in_out2.mp3']);
        this.#scene.load.audio('locomotive1', ['assets/train_sounds/locomotive1.mp3']);
        this.#scene.load.start();
    }

    remove() {
        console.debug("Removing train")
        if (this.#trainGroup !== undefined) this.#trainGroup.clear(true, true)
        //if (this.#triggerGroup !== undefined) this.#triggerGroup.clear(true, true)
        if (this.#timedEvent !== undefined) this.#timedEvent.remove()
        if (this.#sndLoop !== undefined) this.#sndLoop.stop();
        this.#loadedImages.forEach(imgId => this.#scene.textures.remove(imgId));
        this.#loadedImages = new Set();
        this.#playingSounds.forEach(snd => snd.stop());
        this.#playingSounds = new Array();
        this.#loadedSounds.forEach(sndId => this.#scene.sound.removeByKey(sndId));
        this.#loadedSounds = new Set();

        this.#scene.sound.removeByKey('wheels1');
        this.#scene.sound.removeByKey('wheels2');
        this.#scene.sound.removeByKey('wheels3');
        this.#scene.sound.removeByKey('trainloop');
        this.#scene.sound.removeByKey('train_in_out1');
        this.#scene.sound.removeByKey('train_in_out2');
        this.#scene.sound.removeByKey('locomotive1');
        this.#trainActive = false;
    };

};

///////////////////////////////////////////////////////////////////////
// class MainScene
// Glues together individual visual and auto elements
///////////////////////////////////////////////////////////////////////

class MainScene extends Phaser.Scene {
    constructor(img, seed) {
        super({
            key: 'MainScene',
            active: true,
            physics:
            {
                default: 'arcade',
                arcade: { debug: false }
            },
        });
        this.#imgInventory = img;

        //var seedsRandGen = new RNG(getSeed());
        let seedsRandGen = new Random.MT(getSeed());
        this.#sceneRandGen = new Random.MT(seedsRandGen.range(0, 0x7fffffff));
        this.#trainRandGen = new Random.MT(seedsRandGen.range(0, 0x7fffffff));

        this.#train = new TrainAnimation(this, this.#imgInventory)
        this.#train.leftPosition = 0;
        this.#train.rightPosition = screenLayout.width;
        this.#train.railsPosition = 480;
    };
    #imgInventory;
    #sceneRandGen;
    #trainRandGen;
    #train;

    preload() {
        this.load.image('placeholder', 'assets/misc/placeholder.png')
    }

    create() {
        const groundY = screenLayout.groundHeight + screenLayout.railHeight
        this.add.rectangle(0,
            0,
            screenLayout.width,
            screenLayout.height,
            0x3498d8).setOrigin(0, 0);
        this.add.rectangle(0,
            groundY,
            screenLayout.width,
            screenLayout.height - groundY,
            0xa04000).setOrigin(0, 0);
        this.add.rectangle(0,
            screenLayout.groundHeight + 1,
            screenLayout.width,
            screenLayout.railHeight,
            0x333344).setOrigin(0, 0);

        this.#train.setup(Train.generateTrain(this.#imgInventory, this.#trainRandGen));
        timerText = this.add.text(32, 32);
    }

    update() {
        const t = this.#train.timer;
        if (t !== undefined) {
            timerText.setText('Train timer progress: ' + t.toString().substr(0, 4));
        } else {
            timerText.setText('Train timer progress: undefined');
        }

        if (!this.#train.active) {
            this.#train.setup(Train.generateTrain(this.#imgInventory, this.#trainRandGen));
        }
    }

};
///////////////////////////////////////////////////////////////////////
// main program
///////////////////////////////////////////////////////////////////////

console.info("Starting up");

console.debug("Initialising images");
var img = initImageInventory();

console.debug("Initialising sounds");
var snd = initSndInventory();

function getSeed() {
    const n = parseInt(window.location.hash.substring(1), 10);
    if (isNaN(n)) {
        const nrand = Math.round(Math.random() * 0x7fffffff);
        window.location.hash = '#' + nrand;
        return nrand;
    }
    return n;
}

console.debug("Generating landscape");
let landscape = Landscape.generateLandscape();

console.debug("Initialising engine");
var config = {
    type: Phaser.AUTO,
    width: screenLayout.width,
    height: screenLayout.height,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade'
    },
    scene: new MainScene(img, getSeed()),
};
var gm = new Phaser.Game(config);