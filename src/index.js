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
      this.scene = scene;
      this.img = img;
      this.trainActive = false;
      this.loadedImages = new Set();
      this.loadedSounds = new Set();
      this.playingSounds = new Array();
  }
  get active() { return this.trainActive; }
  get timer() {
      if (this.timedEvent === undefined) return undefined
      return this.timedEvent.getProgress();
  }
  set railsPosition(pos) { this.screenLayout.posRailsY = pos; }
  get railsPosition() { return this.screenLayout.posRailsY; }
  set leftPosition(pos) { this.screenLayout.posLeftX = pos; }
  get leftPosition() { return this.screenLayout.posLeftX; }
  set rightPosition(pos) { this.screenLayout.posRightX = pos; }
  get rightPosition() { return this.screenLayout.posRightX; }
  //TODO: convert to private fields
  scene;
  img;
  trainGroup;
  triggerGroup;
  timedEvent;
  trainActive;
  screenLayout = {
      posRailsY: 576,
      posLeftX: 0,
      posRightX: 1024,
      scale: 1,
  };
  sndLoop;
  loadedImages;
  playingSounds;
  loadedSounds;

setup(trainConfig) {
  console.debug("Setting up train")
  if (this.active) this.remove()
  this.trainActive = true;

  console.log(trainConfig);

  const scale = this.screenLayout.scale;
  const posY = this.screenLayout.posRailsY;
  const posX1 = this.screenLayout.posLeftX;
  const posX2 = this.screenLayout.posRightX;
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
      let snd = this.scene.sound.add('train_in_out2');
      snd.once('complete', this.remove, this);
      snd.play();
  }

  let createTrainInScene = function () {

      console.debug('Creating train');

      this.trainGroup = this.scene.physics.add.group();

      let trainLen = 0;
      let previousCoupling = 0;

      let sndFirst = this.scene.sound.add('wheels0');
      sndFirst.rate = trainConfig.speed / 750;
      playsound(sndFirst);

      trainConfig.train.forEach(function(id, i, arr) {
          const sprName = 'tr_img_' + String(id);
          const attr = img.getAttributes(id);
          const sprWidth = this.scene.textures.get(sprName).source[0].width;
          if (trainConfig.direction) {
              this.trainGroup.create(posX2 + 1 + trainLen, posY, sprName);
          }
          trainLen += (sprWidth - attr.leftCoupling - previousCoupling) * scale;
          if (!trainConfig.direction) {
              this.trainGroup.create(posX1 - 1 - trainLen, posY, sprName);
          }
          
          previousCoupling = attr.rightCoupling;

          if (i != (arr.length - 1)) {
              var snd = this.scene.sound.add('wheels1');
          } else {
              var snd = this.scene.sound.add('wheels3');
          }
          snd.rate = trainConfig.speed / 750;
          let soundDelay = (trainLen - sizeX / 2) / trainConfig.speed / scale * 1000;
          this.scene.time.delayedCall(soundDelay, playsound, [snd], this);
          if (img.getCategoryById(id) == 'passenger_locomotive' ||
              img.getCategoryById(id) == 'freight_locomotive')
          {
              let sndLoco = this.scene.sound.add('locomotive1');
              let soundLocoDelay = soundDelay - sprWidth * scale;
              if (soundLocoDelay < 0) soundLocoDelay = 0;
              this.scene.time.delayedCall(soundLocoDelay, playsound, [sndLoco], this);
          }
      }.bind(this));
      this.scene.time.delayedCall((trainLen - sizeX / 2) / trainConfig.speed / scale * 1000, stopsound, [this.sndLoop], this);
      this.scene.time.delayedCall((trainLen - sizeX / 2) / trainConfig.speed / scale * 1000, playOutroSound, [], this);

      Phaser.Actions.Call(this.trainGroup.getChildren(), function (spr) {
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

      //                this.scene.physics.add.overlap(this.triggerGroup, this.trainGroup, playOutroSound, null, this);
  }

  function playIntroSound() {
    console.debug('Playing intro sound');
      this.sndLoop = this.scene.sound.add('trainloop', { loop: true });
      let snd = this.scene.sound.add('train_in_out1');
      snd.once('complete', createTrainInScene, this);
      snd.play();
      this.timedEvent = this.scene.time.delayedCall(3000, playsound, [this.sndLoop], this);
  }

  this.scene.load.once('complete', function () {
    console.debug('Load complete');
    this.timedEvent = this.scene.time.delayedCall(
          trainConfig.delay,
          playIntroSound,
          [],
          this);
  }, this);

  //Phaser does not care if the same image is loaded repeatedly
  console.debug('Loading train images');
  trainConfig.train.forEach(id => {
      this.scene.load.image("tr_img_" + String(id), img.getPathById(id));
      this.loadedImages.add("tr_img_" + String(id));
  })

  console.debug('Loading train sounds');
  this.scene.load.audio('wheels0', ['assets/train_sounds/wheels2_5d.mp3']);
  this.scene.load.audio('wheels1', ['assets/train_sounds/wheels_5a.mp3']);
  this.scene.load.audio('wheels2', ['assets/train_sounds/wheels_5b.mp3']);
  this.scene.load.audio('wheels3', ['assets/train_sounds/wheels2_5c.mp3']);
  this.scene.load.audio('trainloop', ['assets/train_sounds/train_loop1.mp3']);
  this.scene.load.audio('train_in_out1', ['assets/train_sounds/train_in_out1.mp3']);
  this.scene.load.audio('train_in_out2', ['assets/train_sounds/train_in_out2.mp3']);
  this.scene.load.audio('locomotive1', ['assets/train_sounds/locomotive1.mp3']);
  this.scene.load.start();
}

remove() {
  console.debug("Removing train")
  if (this.trainGroup !== undefined) this.trainGroup.clear(true, true)
  if (this.triggerGroup !== undefined) this.triggerGroup.clear(true, true)
  if (this.timedEvent !== undefined) this.timedEvent.remove()
  if (this.sndLoop !== undefined) this.sndLoop.stop();
  this.loadedImages.forEach(imgId => this.scene.textures.remove(imgId));
  this.loadedImages = new Set();
  this.playingSounds.forEach(snd => snd.stop());
  this.playingSounds = new Array();
  this.loadedSounds.forEach(sndId => this.scene.sound.removeByKey(sndId));
  this.loadedSounds = new Set();

  this.scene.sound.removeByKey('wheels1');
  this.scene.sound.removeByKey('wheels2');
  this.scene.sound.removeByKey('wheels3');
  this.scene.sound.removeByKey('trainloop');
  this.scene.sound.removeByKey('train_in_out1');
  this.scene.sound.removeByKey('train_in_out2');
  this.scene.sound.removeByKey('locomotive1');
  this.trainActive = false;
}

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
      this.imgInventory = img;

      //var seedsRandGen = new RNG(getSeed());
      let seedsRandGen = new Random.MT(getSeed());
      this.sceneRandGen = new Random.MT(seedsRandGen.range(0, 0x7fffffff));
      this.trainRandGen = new Random.MT(seedsRandGen.range(0, 0x7fffffff));

      this.train = new TrainAnimation(this, this.imgInventory)
      this.train.leftPosition = 0;
      this.train.rightPosition = screenLayout.width;
      this.train.railsPosition = 480;
  }
  //TODO: convert to private fields
  //#imgInventory;
  imgInventory;
  sceneRandGen;
  trainRandGen;


  train;
}

MainScene.prototype.preload = function () {
  this.load.image('placeholder', 'assets/misc/placeholder.png')
}

MainScene.prototype.create = function () {
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

  this.train.setup(Train.generateTrain(this.imgInventory, this.trainRandGen));
  timerText = this.add.text(32, 32);
}

MainScene.prototype.update = function () {
  const t = this.train.timer;
  if (t !== undefined) {
      timerText.setText('Train timer progress: ' + t.toString().substr(0, 4));
  } else {
      timerText.setText('Train timer progress: undefined');
  }

  if (!this.train.active) {
      this.train.setup(Train.generateTrain(this.imgInventory, this.trainRandGen));
  }
}

///////////////////////////////////////////////////////////////////////
// main program
///////////////////////////////////////////////////////////////////////

console.info("Starting up")

console.debug("Initialising images")
var img = Assets.initImageInventory()

function getSeed() {
  const n = parseInt(window.location.hash.substring(1), 10)
  if (isNaN(n)) {
      const nrand = Math.round(Math.random() * 0x7fffffff)
      window.location.hash = '#' + nrand
      return nrand
  }
  return n
}

console.debug("Generating landscape");
let landscape = Landscape.generateLandscape();

console.debug("Initialising engine")
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























/*
var rng = new Random.MT( getSeed() );

console.debug("Generating landscape");
let landscape = Landscape.generateLandscape(img, rng);

import logoImg from "./assets/logo.png";

var train = Train.generateTrain(img, rng);
console.log(train);

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("logo", logoImg);
}

function create() {
  const logo = this.add.image(400, 150, "logo");

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });
}
*/