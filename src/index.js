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
    horizonHeight: 199,
    railHeight1: 452,
    railScale1: 1.4,
    trainWheelHeight: 455,
    clouds: {
        amount: 20,
        ymin: 40,
        ymax: 180,
        szmin: 75,
        szmax: 125,
        speedfactor: 1.0,
    }
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

import freight_locomotives_1_A_blue from "./assets/freight_locomotives/loco_freight_1_A_blue.png";
import freight_locomotives_1_A_gray from "./assets/freight_locomotives/loco_freight_1_A_gray.png";
import freight_locomotives_1_A_green from "./assets/freight_locomotives/loco_freight_1_A_green.png";
import freight_locomotives_1_A_red from "./assets/freight_locomotives/loco_freight_1_A_red.png";
import freight_locomotives_1_A_yellow from "./assets/freight_locomotives/loco_freight_1_A_yellow.png";
import freight_locomotives_1_B_blue from "./assets/freight_locomotives/loco_freight_1_B_blue.png";
import freight_locomotives_1_B_gray from "./assets/freight_locomotives/loco_freight_1_B_gray.png";
import freight_locomotives_1_B_green from "./assets/freight_locomotives/loco_freight_1_B_green.png";
import freight_locomotives_1_B_red from "./assets/freight_locomotives/loco_freight_1_B_red.png";
import freight_locomotives_1_B_yellow from "./assets/freight_locomotives/loco_freight_1_B_yellow.png";
import freight_locomotives_1_A_reverse_blue from "./assets/freight_locomotives/loco_freight_1_A_reverse_blue.png";
import freight_locomotives_1_A_reverse_gray from "./assets/freight_locomotives/loco_freight_1_A_reverse_gray.png";
import freight_locomotives_1_A_reverse_green from "./assets/freight_locomotives/loco_freight_1_A_reverse_green.png";
import freight_locomotives_1_A_reverse_red from "./assets/freight_locomotives/loco_freight_1_A_reverse_red.png";
import freight_locomotives_1_A_reverse_yellow from "./assets/freight_locomotives/loco_freight_1_A_reverse_yellow.png";

import freight_locomotives_2_blue from "./assets/freight_locomotives/loco_freight_2_blue.png";
import freight_locomotives_2_gray from "./assets/freight_locomotives/loco_freight_2_gray.png";
import freight_locomotives_2_green from "./assets/freight_locomotives/loco_freight_2_green.png";
import freight_locomotives_2_tan from "./assets/freight_locomotives/loco_freight_2_tan.png";
import freight_locomotives_2_reverse_blue from "./assets/freight_locomotives/loco_freight_2_blue_reverse.png";
import freight_locomotives_2_reverse_gray from "./assets/freight_locomotives/loco_freight_2_gray_reverse.png";
import freight_locomotives_2_reverse_green from "./assets/freight_locomotives/loco_freight_2_green_reverse.png";
import freight_locomotives_2_reverse_tan from "./assets/freight_locomotives/loco_freight_2_tan_reverse.png";

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
import containter_wagons_empty from "./assets/containter_wagons/container-empty.png";

import car_wagons_empty from "./assets/freight_wagons/car_transporter-empty.png";

import covered_wagon_blue from "./assets/freight_wagons/covered_wagon-blue.png";
import covered_wagon_brown from "./assets/freight_wagons/covered_wagon-brown.png";
import covered_wagon_green from "./assets/freight_wagons/covered_wagon-green.png";
import covered_wagon_red from "./assets/freight_wagons/covered_wagon-red.png";
import covered_wagon_long_1_blue from "./assets/freight_wagons/covered_wagon_long_1-blue.png";
import covered_wagon_long_1_brown from "./assets/freight_wagons/covered_wagon_long_1-brown.png";
import covered_wagon_long_1_green from "./assets/freight_wagons/covered_wagon_long_1-green.png";
import covered_wagon_long_1_red from "./assets/freight_wagons/covered_wagon_long_1-red.png";
import covered_wagon_long_2_blue from "./assets/freight_wagons/covered_wagon_long_2-blue.png";
import covered_wagon_long_2_brown from "./assets/freight_wagons/covered_wagon_long_2-brown.png";
import covered_wagon_long_2_green from "./assets/freight_wagons/covered_wagon_long_2-green.png";
import covered_wagon_long_2_red from "./assets/freight_wagons/covered_wagon_long_2-red.png";
import covered_wagon_long_3_blue from "./assets/freight_wagons/covered_wagon_long_3-blue.png";
import covered_wagon_long_3_brown from "./assets/freight_wagons/covered_wagon_long_3-brown.png";
import covered_wagon_long_3_green from "./assets/freight_wagons/covered_wagon_long_3-green.png";
import covered_wagon_long_3_red from "./assets/freight_wagons/covered_wagon_long_3-red.png";

import flat_wagon_blue from "./assets/freight_wagons/flatcar-blue.png";
import flat_wagon_brown from "./assets/freight_wagons/flatcar-brown.png";
import flat_wagon_green from "./assets/freight_wagons/flatcar-green.png";
import flat_wagon_red from "./assets/freight_wagons/flatcar-red.png";
import flat_wagon_medium_blue from "./assets/freight_wagons/flatcar_medium-blue.png";
import flat_wagon_medium_brown from "./assets/freight_wagons/flatcar_medium-brown.png";
import flat_wagon_medium_green from "./assets/freight_wagons/flatcar_medium-green.png";
import flat_wagon_medium_red from "./assets/freight_wagons/flatcar_medium-red.png";
import flat_wagon_long_blue from "./assets/freight_wagons/flatcar_long-blue.png";
import flat_wagon_long_brown from "./assets/freight_wagons/flatcar_long-brown.png";
import flat_wagon_long_green from "./assets/freight_wagons/flatcar_long-green.png";
import flat_wagon_long_red from "./assets/freight_wagons/flatcar_long-red.png";

import hopper_wagon_blue from "./assets/freight_wagons/hopper-blue.png";
import hopper_wagon_red from "./assets/freight_wagons/hopper-red.png";
import hopper_wagon_tan from "./assets/freight_wagons/hopper-tan.png";
import hopper_wagon_white from "./assets/freight_wagons/hopper-white.png";
import hopper_wagon_yellow from "./assets/freight_wagons/hopper-yellow.png";

import hopper_wagon_long_blue from "./assets/freight_wagons/hopper_long-blue.png";
import hopper_wagon_long_red from "./assets/freight_wagons/hopper_long-red.png";
import hopper_wagon_long_green from "./assets/freight_wagons/hopper_long-green.png";
import hopper_wagon_long_white from "./assets/freight_wagons/hopper_long-white.png";

import open_wagon_blue from "./assets/freight_wagons/open_wagon-blue.png";
import open_wagon_gray from "./assets/freight_wagons/open_wagon-gray.png";
import open_wagon_green from "./assets/freight_wagons/open_wagon-green.png";
import open_wagon_red from "./assets/freight_wagons/open_wagon-red.png";
import open_wagon_medium_blue from "./assets/freight_wagons/open_wagon_medium-blue.png";
import open_wagon_medium_gray from "./assets/freight_wagons/open_wagon_medium-gray.png";
import open_wagon_medium_green from "./assets/freight_wagons/open_wagon_medium-green.png";
import open_wagon_medium_red from "./assets/freight_wagons/open_wagon_medium-red.png";
import open_wagon_long_blue from "./assets/freight_wagons/open_wagon_long-blue.png";
import open_wagon_long_gray from "./assets/freight_wagons/open_wagon_long-gray.png";
import open_wagon_long_green from "./assets/freight_wagons/open_wagon_long-green.png";
import open_wagon_long_red from "./assets/freight_wagons/open_wagon_long-red.png";

import refrigerator_wagon_long_white from "./assets/freight_wagons/refrigerator_long-white.png";
import refrigerator_wagon_white from "./assets/freight_wagons/refrigerator-white.png";

import skeleton_wagon from "./assets/freight_wagons/skeleton-empty.png";

import tank_wagon_black from "./assets/tank_wagons/tank-black.png";
import tank_wagon_darkgray from "./assets/tank_wagons/tank-darkgray.png";
import tank_wagon_gray from "./assets/tank_wagons/tank-gray.png";
import tank_wagon_white from "./assets/tank_wagons/tank-white.png";
import tank_wagon_yellow from "./assets/tank_wagons/tank-yellow.png";
import tank_wagon_long_black from "./assets/tank_wagons/tank_long-black.png";

import cloud_white_large_1 from "./assets/clouds/cloud_large_01.png";
import cloud_white_medium_1 from "./assets/clouds/cloud_medium_01.png";
import cloud_white_medium_2 from "./assets/clouds/cloud_medium_03.png";
import cloud_white_medium_3 from "./assets/clouds/cloud_medium_02.png";
import cloud_white_small_1 from "./assets/clouds/cloud_small_01.png";
import cloud_white_small_2 from "./assets/clouds/cloud_small_02.png";
import cloud_white_small_3 from "./assets/clouds/cloud_small_03.png";
import cloud_white_large_windy_1 from "./assets/clouds/cloud_large_windy_01.png";
import cloud_white_medium_windy_1 from "./assets/clouds/cloud_medium_windy_01.png";
import cloud_white_medium_windy_2 from "./assets/clouds/cloud_medium_windy_02.png";
import cloud_white_medium_windy_3 from "./assets/clouds/cloud_medium_windy_03.png";
import cloud_white_medium_windy_4 from "./assets/clouds/cloud_medium_windy_04.png";
import cloud_white_small_windy_1 from "./assets/clouds/cloud_small_windy_01.png";
import cloud_white_small_windy_2 from "./assets/clouds/cloud_small_windy_02.png";
import cloud_white_small_windy_3 from "./assets/clouds/cloud_small_windy_03.png";
import cloud_white_small_windy_4 from "./assets/clouds/cloud_small_windy_04.png";

import cloud_dark_medium_1 from "./assets/clouds-dark/cloud_medium_01.png";
import cloud_dark_medium_2 from "./assets/clouds-dark/cloud_medium_03.png";
import cloud_dark_medium_3 from "./assets/clouds-dark/cloud_medium_02.png";
import cloud_dark_small_1 from "./assets/clouds-dark/cloud_small_01.png";
import cloud_dark_small_2 from "./assets/clouds-dark/cloud_small_02.png";
import cloud_dark_small_3 from "./assets/clouds-dark/cloud_small_03.png";
import cloud_dark_medium_windy_1 from "./assets/clouds-dark/cloud_medium_windy_01.png";
import cloud_dark_medium_windy_2 from "./assets/clouds-dark/cloud_medium_windy_02.png";
import cloud_dark_medium_windy_3 from "./assets/clouds-dark/cloud_medium_windy_03.png";
import cloud_dark_medium_windy_4 from "./assets/clouds-dark/cloud_medium_windy_04.png";
import cloud_dark_medium_windy_5 from "./assets/clouds-dark/cloud_medium_windy_05.png";
import cloud_dark_small_windy_1 from "./assets/clouds-dark/cloud_small_windy_01.png";
import cloud_dark_small_windy_2 from "./assets/clouds-dark/cloud_small_windy_02.png";
import cloud_dark_small_windy_3 from "./assets/clouds-dark/cloud_small_windy_03.png";
import cloud_dark_small_windy_4 from "./assets/clouds-dark/cloud_small_windy_04.png";

import rails_image from "./assets/landscape/rails.png";

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

    {
        const idRevBlue = img.addType("freight_locomotive_reverse_section_a", [
            freight_locomotives_1_A_reverse_blue
        ], { leftCoupling: 7, rightCoupling: 20, isReverse: true });
        const idRevGray = img.addType("freight_locomotive_reverse_section_a", [
            freight_locomotives_1_A_reverse_gray
        ], { leftCoupling: 7, rightCoupling: 20, isReverse: true });
        const idRevGreen = img.addType("freight_locomotive_reverse_section_a", [
            freight_locomotives_1_A_reverse_green
        ], { leftCoupling: 7, rightCoupling: 20, isReverse: true });
        const idRevRed = img.addType("freight_locomotive_reverse_section_a", [
            freight_locomotives_1_A_reverse_red
        ], { leftCoupling: 7, rightCoupling: 20, isReverse: true });
        const idRevYellow = img.addType("freight _locomotive_reverse_section_a", [
            freight_locomotives_1_A_reverse_yellow
        ], { leftCoupling: 7, rightCoupling: 20, isReverse: true });

        const idBlueB = img.addType("freight_locomotive_section_b", [
            freight_locomotives_1_B_blue
        ], { leftCoupling: 7, rightCoupling: 8, isSectionB: true, reverse: idRevBlue });
        const idGrayB = img.addType("freight_locomotive_section_b", [
            freight_locomotives_1_B_gray
        ], { leftCoupling: 7, rightCoupling: 8, isSectionB: true, reverse: idRevGray });
        const idGreenB = img.addType("freight_locomotive_section_b", [
            freight_locomotives_1_B_green
        ], { leftCoupling: 7, rightCoupling: 8, isSectionB: true, reverse: idRevGreen });
        const idRedB = img.addType("freight_locomotive_section_b", [
            freight_locomotives_1_B_red
        ], { leftCoupling: 7, rightCoupling: 8, isSectionB: true, reverse: idRevRed });
        const idYellowB = img.addType("freight_locomotive_section_b", [
            freight_locomotives_1_B_yellow
        ], { leftCoupling: 7, rightCoupling: 8, isSectionB: true, reverse: idRevYellow });

        img.addType("freight_locomotive_section_a", [
            freight_locomotives_1_A_blue
        ], { leftCoupling: 19, rightCoupling: 7, reverse: idRevBlue, sectionB: idBlueB, isSectionA: true });
        img.addType("freight_locomotive_section_a", [
            freight_locomotives_1_A_gray
        ], { leftCoupling: 19, rightCoupling: 7, reverse: idRevGray, sectionB: idGrayB, isSectionA: true });
        img.addType("freight_locomotive_section_a", [
            freight_locomotives_1_A_green
        ], { leftCoupling: 19, rightCoupling: 7, reverse: idRevGreen, sectionB: idGreenB, isSectionA: true });
        img.addType("freight_locomotive_section_a", [
            freight_locomotives_1_A_red
        ], { leftCoupling: 19, rightCoupling: 7, reverse: idRevRed, sectionB: idRedB, isSectionA: true });
        img.addType("freight_locomotive_section_a", [
            freight_locomotives_1_A_yellow
        ], { leftCoupling: 19, rightCoupling: 7, reverse: idRevYellow, sectionB: idYellowB, isSectionA: true });
    }

    {
        const idRevBlue = img.addType("freight_locomotive_reverse", [
            freight_locomotives_2_reverse_blue
        ], { leftCoupling: 14, rightCoupling: 8, isReverse: true });
        const idRevGray = img.addType("freight_locomotive_reverse", [
            freight_locomotives_2_reverse_gray
        ], { leftCoupling: 14, rightCoupling: 8, isReverse: true });
        const idRevGreen = img.addType("freight_locomotive_reverse", [
            freight_locomotives_2_reverse_green
        ], { leftCoupling: 14, rightCoupling: 8, isReverse: true });
        const idRevTan = img.addType("freight_locomotive_reverse", [
            freight_locomotives_2_reverse_tan
        ], { leftCoupling: 14, rightCoupling: 8, isReverse: true });

        img.addType("freight_locomotive", [
            freight_locomotives_2_blue
        ], { leftCoupling: 14, rightCoupling: 8, reverse: idRevBlue });
        img.addType("freight_locomotive", [
            freight_locomotives_2_gray
        ], { leftCoupling: 14, rightCoupling: 8, reverse: idRevGray });
        img.addType("freight_locomotive", [
            freight_locomotives_2_green
        ], { leftCoupling: 14, rightCoupling: 8, reverse: idRevGreen });
        img.addType("freight_locomotive", [
            freight_locomotives_2_tan
        ], { leftCoupling: 14, rightCoupling: 8, reverse: idRevTan });
    }

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
    img.addType("container_wagon", [
        containter_wagons_empty
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
    img.addType("covered_wagon", [
        covered_wagon_long_1_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_1_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_1_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_1_red
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_2_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_2_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_2_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_2_red
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_3_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_3_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_3_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("covered_wagon", [
        covered_wagon_long_3_red
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("flat_wagon", [
        flat_wagon_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_red
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_medium_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_medium_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_medium_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_medium_red
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_long_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_long_brown
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_long_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("flat_wagon", [
        flat_wagon_long_red
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
    img.addType("hopper_wagon", [
        hopper_wagon_long_red
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("hopper_wagon", [
        hopper_wagon_long_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("hopper_wagon", [
        hopper_wagon_long_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("hopper_wagon", [
        hopper_wagon_long_white
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
    img.addType("open_wagon", [
        open_wagon_medium_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_medium_gray
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_medium_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_medium_red
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_long_blue
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_long_gray
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_long_green
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("open_wagon", [
        open_wagon_long_red
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

    img.addType("tank_wagon", [
        tank_wagon_black
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("tank_wagon", [
        tank_wagon_darkgray
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("tank_wagon", [
        tank_wagon_gray
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("tank_wagon", [
        tank_wagon_white
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("tank_wagon", [
        tank_wagon_yellow
    ], { leftCoupling: 8, rightCoupling: 5 });
    img.addType("tank_wagon", [
        tank_wagon_long_black
    ], { leftCoupling: 8, rightCoupling: 5 });

    img.addType("cloud_white_large", [
        cloud_white_large_1
    ], {});
    img.addType("cloud_white_large_windy", [
        cloud_white_large_windy_1
    ], {});
    img.addType("cloud_white_medium", [
        cloud_white_medium_1,
        cloud_white_medium_2,
        cloud_white_medium_3
    ], {});
    img.addType("cloud_white_medium_windy", [
        cloud_white_medium_windy_1,
        cloud_white_medium_windy_2,
        cloud_white_medium_windy_3,
        cloud_white_medium_windy_4
    ], {});
    img.addType("cloud_white_small", [
        cloud_white_small_1,
        cloud_white_small_2,
        cloud_white_small_3
    ], {});
    img.addType("cloud_white_small_windy", [
        cloud_white_small_windy_1,
        cloud_white_small_windy_2,
        cloud_white_small_windy_3,
        cloud_white_small_windy_4
    ], {});

    img.addType("cloud_dark_medium", [
        cloud_dark_medium_1,
        cloud_dark_medium_2,
        cloud_dark_medium_3
    ], {});
    img.addType("cloud_dark_medium_windy", [
        cloud_dark_medium_windy_1,
        cloud_dark_medium_windy_2,
        cloud_dark_medium_windy_3,
        cloud_dark_medium_windy_4,
        cloud_dark_medium_windy_5
    ], {});
    img.addType("cloud_dark_small", [
        cloud_dark_small_1,
        cloud_dark_small_2,
        cloud_dark_small_3
    ], {});
    img.addType("cloud_dark_small_windy", [
        cloud_dark_small_windy_1,
        cloud_dark_small_windy_2,
        cloud_dark_small_windy_3,
        cloud_dark_small_windy_4,
    ], {});

    img.addType("rails", [
        rails_image
    ], {});

    return img;
};

import snd_locomotive_1 from "./assets/train_sounds/locomotive1.mp3";
import snd_locomotive_2 from "./assets/train_sounds/locomotive2.mp3";
import snd_locomotive_3 from "./assets/train_sounds/locomotive3.mp3";
import snd_locomotive_4 from "./assets/train_sounds/locomotive4.mp3";
import snd_locomotive_5 from "./assets/train_sounds/locomotive5.mp3";
import snd_train_inout_1 from "./assets/train_sounds/train_in_out1.mp3";
import snd_train_inout_2 from "./assets/train_sounds/train_in_out2.mp3";
import snd_train_inout_3 from "./assets/train_sounds/train_in_out3.mp3";
import snd_train_inout_4 from "./assets/train_sounds/train_in_out4.mp3";
import snd_train_inout_5 from "./assets/train_sounds/train_in_out5.mp3";
import snd_train_loop_1 from "./assets/train_sounds/train_loop1.mp3";
import snd_train_loop_2 from "./assets/train_sounds/train_loop2.mp3";
import snd_train_loop_3 from "./assets/train_sounds/train_loop3.mp3";
import snd_train_loop_4 from "./assets/train_sounds/train_loop4.mp3";
import snd_train_loop_5 from "./assets/train_sounds/train_loop5.mp3";
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
import { strategy } from "webpack-merge";

function initSoundInventory() {
    var snd = new Assets.Inventory();

    snd.addType("locomotive", [
        snd_locomotive_1,
        snd_locomotive_2,
        snd_locomotive_3,
        snd_locomotive_4,
        snd_locomotive_5
    ]);

    snd.addType("train_inout", [
        snd_train_inout_1
    ], { attack: 3200, decay: 3378 });

    snd.addType("train_inout", [
        snd_train_inout_2
    ], { attack: 2500, decay: 2300 });

    snd.addType("train_inout", [
        snd_train_inout_3
    ], { attack: 3600, decay: 4629 });

    snd.addType("train_inout", [
        snd_train_inout_4
    ], { attack: 3400, decay: 4270 });

    snd.addType("train_inout", [
        snd_train_inout_5
    ], { attack: 2000, decay: 2050 });

    snd.addType("train_loop", [
        snd_train_loop_1,
        snd_train_loop_2,
        snd_train_loop_3,
        snd_train_loop_4,
        snd_train_loop_5
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


//var timerText

///////////////////////////////////////////////////////////////////////
// class TrainAnimation
// A train running once across screen on fire-and-forget principle
// Train is run horizontally at specified vertical position, with 
// specified speed, scale, and Z-depth, after specified delay.
// Automatically loads assets, sets up sprites and sounds.
// When it is detected that the train is out of the screen and/or 
// the sounds are played until the end, the sprites/groups are 
// automatically deleted and assetes are removed from memory
///////////////////////////////////////////////////////////////////////

class TrainAnimation {
    constructor(scene, img, snd) {
        this.#scene = scene;
        this.#imageInventory = img;
        this.#soundInventory = snd;
        this.#trainActive = false;
        this.#loadedImages = new Set();
        this.#loadedSounds = new Set();
        this.#playingSounds = new Array();
        this.#timedEvents = new Array();
    }
    get active() { return this.#trainActive; }
    get timer() {
        if (this.#timedEvent === undefined) return undefined
        return this.#timedEvent.getProgress();
    }
    set railsPosition(pos) { this.#screenLayout.posRailsY = pos; }
    get railsPosition() { return this.#screenLayout.posRailsY; }
    set leftPosition(pos) { this.#screenLayout.posLeftX = pos; }
    get leftPosition() { return this.#screenLayout.posLeftX; }
    set rightPosition(pos) { this.#screenLayout.posRightX = pos; }
    get rightPosition() { return this.#screenLayout.posRightX; }
    set zOrder(z) { this.#screenLayout.z = zOrder; }
    get zOrder() { return this.#screenLayout.zOrder; }

    get constants() {
        return {
            referenceSndSpeedRate: 750
        };
    }

    #scene;
    #imageInventory;
    #soundInventory;
    #config;
    #trainGroup;
    //#triggerGroup;
    #timedEvent;
    #trainActive;
    #screenLayout = {
        posRailsY: screenLayout.railHeight2,
        posLeftX: screenLayout.width,
        posRightX: screenLayout.height,
        scale: 1,
        zOrder: 8
    };
    #sndLoop;
    #loadedImages;
    #playingSounds;
    #loadedSounds;
    #timedEvents;

    #playSound(snd) {
        this.#playingSounds.push(snd);
        snd.play();
    }

    #stopSound(snd) {
        snd.stop();
    }

    #playIntroSound() {
        console.debug('Playing intro sound');
        const sndLoopKey = 'tr_snd_' + String(this.#config.sounds.loop);
        const sndIntroKey = 'tr_snd_' + String(this.#config.sounds.intro);
        this.#sndLoop = this.#scene.sound.add(sndLoopKey, { loop: true });
        let snd = this.#scene.sound.add(sndIntroKey);
        snd.once('complete', function () {
            this.#createTrainInScene();
        }, this);
        this.#playSound(snd);
        const loopDelay = this.#soundInventory.getAttributes(this.#config.sounds.intro).attack;
        this.#timedEvents.push(this.#scene.time.delayedCall(
            loopDelay,
            this.#playSound,
            [this.#sndLoop],
            this));
    }

    #playOutroSound() {
        console.debug('Playing outro sound');
        const sndOutroKey = 'tr_snd_' + String(this.#config.sounds.outro);
        let snd = this.#scene.sound.add(sndOutroKey);
        snd.once('complete', this.remove, this);
        //        snd.play();
        this.#playSound(snd);
    }

    #createTrainInScene() {
        console.debug('Creating train');
        const scale = this.#screenLayout.scale;
        const posY = this.#screenLayout.posRailsY;
        const posX1 = this.#screenLayout.posLeftX;
        const posX2 = this.#screenLayout.posRightX;
        const sizeX = posX2 - posX1;
        const speed = this.#config.speed;
        const msPerSecond = 1000;

        this.#trainGroup = this.#scene.physics.add.group();

        let trainLen = 0;
        let previousCoupling = 0;

        this.#config.train.forEach(function (id, i, arr) {
            const sprName = 'tr_img_' + String(id);
            const attr = this.#imageInventory.getAttributes(id);
            const sprWidth = this.#scene.textures.get(sprName).source[0].width;
            const msPerSecond = 1000;
            const soundDelay = (trainLen - sizeX / 2) / speed / scale * msPerSecond;
            if (this.#config.direction) {
                this.#trainGroup.create(posX2 + 1 + trainLen, posY, sprName);
            }
            trainLen += (sprWidth - attr.leftCoupling - previousCoupling) * scale;
            if (!this.#config.direction) {
                this.#trainGroup.create(posX1 - 1 - trainLen, posY, sprName);
            }
            previousCoupling = attr.rightCoupling;
            this.#config.sounds.train[i].forEach(function (sndId) {
                let snd = this.#scene.sound.add('tr_snd_' + String(sndId));
                snd.rate = speed / this.constants.referenceSndSpeedRate;
                this.#timedEvents.push(this.#scene.time.delayedCall(soundDelay, this.#playSound, [snd], this));
            }, this);
        }, this);

        const lastSoundDelay = (trainLen - sizeX / 2) / speed / scale * msPerSecond;
        const loopSoundStopDelay = lastSoundDelay;
        const outroSoundStopDelay =
            lastSoundDelay - this.#soundInventory.getAttributes(this.#config.sounds.outro).decay;

        + this.constants.loopSndDelayOutMs;
        this.#config.sounds.train[this.#config.train.length].forEach(function (sndId) {
            let snd = this.#scene.sound.add('tr_snd_' + String(sndId));
            snd.rate = speed / this.constants.referenceSndSpeedRate;
            this.#timedEvents.push(this.#scene.time.delayedCall(lastSoundDelay, this.#playSound, [snd], this));
        }, this);
        this.#timedEvents.push(
            this.#scene.time.delayedCall(loopSoundStopDelay, this.#stopSound, [this.#sndLoop], this)
        );
        this.#timedEvents.push(
            this.#scene.time.delayedCall(outroSoundStopDelay, this.#playOutroSound, [], this)
        );

        Phaser.Actions.Call(this.#trainGroup.getChildren(), function (spr) {
            if (!this.#config.direction) {
                spr.setVelocity(speed, 0);
                spr.setScale(scale);
                spr.setOrigin(0, 1);
            } else {
                spr.setVelocity(-speed, 0);
                spr.setScale(-scale, scale);
                spr.setOrigin(1, 1);
            }
            spr.setDepth(this.#screenLayout.zOrder);
        }.bind(this));

        //this.triggerGroup = this.scene.physics.add.staticGroup();
        //this.triggerGroup.create(posX2 + 1 + trainLen, posY, 'placeholder');
        //this.triggerGroup.onOverlap = true;

        //this.scene.physics.add.overlap(this.triggerGroup, this.trainGroup, playOutroSound, null, this);
    }


    setup(trainConfig) {
        console.debug("Setting up train");
        if (this.#trainActive) this.remove();
        this.#trainActive = true;
        this.#config = trainConfig;

        console.debug("Train configuration", this.#config);

        this.#scene.load.once('complete', function () {
            console.debug('Load complete');
            this.#timedEvent = this.#scene.time.delayedCall(
                trainConfig.delay,
                this.#playIntroSound,
                [],
                this);
        }, this);

        console.debug('Loading train images');
        //Phaser does not care if the same image loaded multiple times
        this.#config.train.forEach(id => {
            const imgPath = this.#imageInventory.getPathById(id);
            this.#scene.load.image("tr_img_" + String(id), imgPath);
            this.#loadedImages.add("tr_img_" + String(id));
        });

        console.debug('Loading train sounds');
        let soundsToLoad = new Set();
        soundsToLoad.add(this.#config.sounds.intro);
        soundsToLoad.add(this.#config.sounds.outro);
        soundsToLoad.add(this.#config.sounds.loop);
        this.#config.sounds.train.forEach(snds => {
            snds.forEach(id => {
                soundsToLoad.add(id);
            });
        });
        soundsToLoad.forEach(id => {
            const sndPath = this.#soundInventory.getPathById(id);
            this.#scene.load.audio("tr_snd_" + String(id), sndPath);
            this.#loadedSounds.add("tr_snd_" + String(id));
        });
        this.#scene.load.start();
    }

    remove() {
        console.debug("Removing train")
        if (this.#trainGroup !== undefined) this.#trainGroup.clear(true, true)
        //if (this.#triggerGroup !== undefined) this.#triggerGroup.clear(true, true)
        if (this.#timedEvent !== undefined) this.#timedEvent.remove()
        if (this.#sndLoop !== undefined) this.#sndLoop.stop();
        this.#timedEvents.forEach(te => te.remove());
        this.#timedEvents = new Array();
        this.#loadedImages.forEach(imgId => this.#scene.textures.remove(imgId));
        this.#loadedImages = new Set();
        this.#playingSounds.forEach(snd => snd.stop());
        this.#playingSounds = new Array();
        this.#loadedSounds.forEach(sndId => this.#scene.sound.removeByKey(sndId));
        this.#loadedSounds = new Set();
        this.#trainActive = false;
    };

};

///////////////////////////////////////////////////////////////////////
// class LandscapeAnimation
// Creates and sets up cloud animation, background and foreground of landscape.
// Once created, landscape is operated continuously, assets are 
// kept in memory.
// Currently there is no functionality to remove the landscape.
///////////////////////////////////////////////////////////////////////

class LandscapeAnimation {
    constructor(scene, img, snd, layout, rng) {
        this.#scene = scene;
        this.#imageInventory = img;
        this.#soundInventory = snd;
        this.#screenLayout = layout;
        this.#rng = rng;
        this.#cloudImages = [];
    }

    get isLoading() { return this.#assetsLoading; }

    #loadClouds() {
        let clouds = [];
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_white_large"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_white_large_windy"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_white_medium"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_white_medium_windy"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_white_small"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_white_small_windy"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_dark_medium"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_dark_medium_windy"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_dark_small"));
        clouds = clouds.concat(this.#imageInventory.getAllIdsInCategory("cloud_dark_small_windy"));
        clouds.forEach(id => {
            const imgPath = this.#imageInventory.getPathById(id);
            this.#scene.load.image("cloud_" + String(id), imgPath);
        }, this);
    }

    #loadRails() {
        const ids = this.#imageInventory.getAllIdsInCategory("rails");
        const imgPath = this.#imageInventory.getPathById(ids[0]);
        this.#scene.load.image("rails", imgPath);
    }

    #getCloudSpriteId() {
        // select one option of "large", "medium", "small" as a weighted random 
        // of value with weights config.clouds.large, config.clouds.medium, 
        // config.clouds.small
        const randomCloudSize = this.#rng.range(0,
            this.#config.clouds.large +
            this.#config.clouds.medium +
            this.#config.clouds.small);
        let cloudSize = "medium";
        if (randomCloudSize < this.#config.clouds.large) cloudSize = "large";
        if (randomCloudSize >= this.#config.clouds.large + this.#config.clouds.medium)
            cloudSize = "small";

        // make cloud category string: 
        // cloud_(white|dark)_(large|medium|small)(_windy)?
        const cloudCategory = "cloud_" +
            this.#config.clouds.type + "_" +
            cloudSize +
            (this.#config.windy ? "_windy" : "");

        return this.#imageInventory.randomInCategory(cloudCategory, this.#rng);
    }

    #makeCloud(image, init) {
        const rightToLeft = (this.#config.clouds.speed < 0)
        const w = this.#screenLayout.width;
        const margin = this.#screenLayout.width / 2;
        const xmin = (init || !rightToLeft) ? (-w - margin) : (w + margin);
        const xmax = (init || rightToLeft) ? (w * 2 + margin) : (-margin);

        const id = this.#getCloudSpriteId();
        const name = "cloud_" + id.toString();
        const x = this.#rng.range(xmin, xmax);
        const y = this.#rng.range(this.#screenLayout.clouds.ymin,
            this.#screenLayout.clouds.ymax);
        const sz = this.#rng.range(this.#screenLayout.clouds.szmin,
            this.#screenLayout.clouds.szmax) / 100.0;
        const speed = this.#config.clouds.speed * this.#screenLayout.clouds.speedfactor * this.#rng.range(90, 110) / 100.0;;
        image.setTexture(name);
        image.setX(x);
        image.setY(y);
        image.setScale(sz);
        image.setVelocity(speed, 0);
        image.setOrigin(0.5, 1);
        //        this.#scene.physics.add.image(x, y, name).setScale(sz).setVelocity(speed, 0);
        //        console.log(id, name, x, y, sz, speed);
    }

    loadAssets() {
        this.#assetsLoading = true;

        console.debug("Loading landscape images");
        this.#loadClouds();
        this.#loadRails();

        console.debug("Loading landscape sounds");

        this.#scene.load.start();
    }

    setup(cfg) {
        console.debug("Setting up landscape");
        this.#config = cfg;
        this.loadAssets();

        console.debug("Landscape configuration", this.#config);

        this.#scene.load.once('complete', function () {
            console.debug("Landscape assets loaded");
            this.#assetsLoading = false;
            this.#createForegroundInScene();
            this.#createBackgroundInScene();
            console.debug("Landscape setup complete");
        }, this);
    }

    #createForegroundInScene() {
        console.debug("Creating landscape foreground");

    }

    #createBackgroundInScene() {
        console.debug("Creating landscape background");
        // Sky
        var graphics = this.#scene.add.graphics();
        graphics.fillGradientStyle(
            this.#config.colours.sky, this.#config.colours.sky,
            this.#config.colours.horizon, this.#config.colours.horizon, 1);
        graphics.fillRect(0, 0,
            this.#screenLayout.width, this.#screenLayout.height);
        // Clouds
        for (let i = 0; i < this.#screenLayout.clouds.amount; i++) {
            let img = this.#scene.physics.add.image(0, 0, "placeholder");
            this.#makeCloud(img, true);
            this.#cloudImages.push(img);
        }
        this.#scene.time.addEvent(
            {
                delay: 100,
                callback: this.#updateClouds,
                callbackScope: this,
                loop: true
            });
        // Ground
        this.#scene.add.rectangle(0, this.#screenLayout.horizonHeight,
            this.#screenLayout.width,
            this.#screenLayout.height - this.#screenLayout.horizonHeight,
            this.#config.colours.ground).setOrigin(0, 0);
        // Rails
        this.#scene.add.image(this.#screenLayout.width / 2,
            this.#screenLayout.railHeight1,
            "rails").setScale(this.#screenLayout.railScale1);
    }

    #updateClouds() {
        const rightToLeft = (this.#config.clouds.speed < 0);
        const w = this.#screenLayout.width;
        this.#cloudImages.forEach(function (item, index, array) {
            if ((rightToLeft && item.x < -w) || (!rightToLeft && item.x > w * 2)) {
                this.#makeCloud(array[index], false);
                //console.log("redraw cloud", index);
            }
        }, this);
    }

    #scene;
    #imageInventory;
    #soundInventory;
    #screenLayout;
    #config;
    #assetsLoading;
    #rng;
    #cloudImages;
};

///////////////////////////////////////////////////////////////////////
// class MainScene
// Glues together individual visual and auto elements
///////////////////////////////////////////////////////////////////////

class MainScene extends Phaser.Scene {
    constructor(img, snd, seed) {
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
        this.#sndInventory = snd;

        let seedsRandGen = new Random.MT(getSeed());
        this.#landscapeRandGen = new Random.MT(seedsRandGen.range(0, 0x7fffffff));
        this.#trainRandGen = new Random.MT(seedsRandGen.range(0, 0x7fffffff));

        this.#train = new TrainAnimation(
            this,
            this.#imgInventory,
            this.#sndInventory);
        this.#train.leftPosition = 0;
        this.#train.rightPosition = screenLayout.width;
        this.#train.railsPosition = screenLayout.trainWheelHeight;

        this.#landscape = new LandscapeAnimation(
            this,
            this.#imgInventory,
            this.#sndInventory,
            screenLayout,
            this.#landscapeRandGen
        );
    };
    #imgInventory;
    #sndInventory;
    #landscapeRandGen;
    #trainRandGen;
    #train;
    #landscape;

    preload() {
        this.load.image('placeholder', 'assets/misc/placeholder.png')
    }

    create() {
        const landscapeConfig = Landscape.generate(
            this.#imgInventory,
            this.#sndInventory,
            this.#landscapeRandGen
        );

        this.#landscape.setup(landscapeConfig);

        const trainConfig = Train.generate(
            this.#imgInventory,
            this.#sndInventory,
            this.#trainRandGen);
        trainConfig.delay = 1500; // Much shorter delay for first train

        this.#train.setup(trainConfig);
        //timerText = this.add.text(32, 32);
    }

    update() {
        const t = this.#train.timer;
        //if (t !== undefined) {
        //    timerText.setText('Train timer progress: ' + t.toString().substr(0, 4));
        //} else {
        //    timerText.setText('Train timer progress: undefined');
        //}

        if (!this.#train.active) {
            this.#train.setup(Train.generate(
                this.#imgInventory,
                this.#sndInventory,
                this.#trainRandGen));
        }
    }
};

///////////////////////////////////////////////////////////////////////
// main program
///////////////////////////////////////////////////////////////////////

console.info("Starting up");

console.debug("Initialising image inventory");
var img = initImageInventory();

console.debug("Initialising sound inventory");
var snd = initSoundInventory();

function getSeed() {
    const n = parseInt(window.location.hash.substring(1), 10);
    if (isNaN(n)) {
        const nrand = Math.round(Math.random() * 0x7fffffff);
        window.location.hash = '#' + nrand;
        return nrand;
    }
    return n;
}

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
    scene: new MainScene(img, snd, getSeed()),
};
var gm = new Phaser.Game(config);