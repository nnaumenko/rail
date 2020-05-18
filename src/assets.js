/*import passenger_locomotives_3 from "./assets/passenger_locomotives/loco_3.png";
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
*/
class Inventory {
    constructor() {

    }
    #nextId = 0;
    #idMap = new Map();
    #pathMap = new Map();
    #categoryMap = new Map();
    #typeMap = new Map();
    #variantMap = new Map();
    #attributeMap = new Map();

    getId(category, type, variant) {
        const c = this.#idMap.get(category);
        if (c === undefined) return c;
        return c[type][variant];
    }

    getPathById(id) {
        return this.#pathMap.get(id);
    }

    getCategoryById(id) {
        return this.#categoryMap.get(id);
    }

    getTypeById(id) {
        return this.#typeMap.get(id);
    }

    getVariantById(id) {
        return this.#variantMap.get(id);
    }

    countTypesInCategory(category) {
        const c = this.#idMap.get(category);
        if (c === undefined) return c;
        return c.length;
    }

    getAttributes(id) {
        return this.#attributeMap.get(id);
    }

    countVariantsInType(category, type) {
        const c = this.#idMap.get(category);
        if (c === undefined) return c;
        const t = c[type];
        if (t === undefined) return t;
        return t.length;
    }

    addType(category, paths, attributes) {
        if (!Array.isArray(paths)) {
            console.error("Inventory.addType", "not an array", paths);
            return;
        }
        let cat = this.#idMap.get(category);
        if (cat === undefined) {
            cat = new Array();
        }
        let t = new Array();
        paths.forEach(function (item, index, array) {
            if (typeof item != "string") {
                console.error("Inventory.addType", "not a string", item, "at index", index);
            } else {
                t.push(this.#nextId);
                this.#pathMap.set(this.#nextId, item);
                this.#categoryMap.set(this.#nextId, category);
                this.#typeMap.set(this.#nextId, cat.length);
                this.#variantMap.set(this.#nextId, index);
                this.#attributeMap.set(this.#nextId, attributes);
                this.#nextId++;
            }
        }, this);
        cat.push(t);
        this.#idMap.set(category, cat);
    }

    randomInCategory(category, rng) {
        const types = this.countTypesInCategory(category);
        if (types === undefined) return undefined;
        return this.randomInType(category, rng.range(0, types), rng);
    }
    
    randomInType(category, type, rng) {
        const variants = this.countVariantsInType(category, type);
        if (variants === undefined) return undefined;
        const v = rng.range(0, variants);
        return this.getId(category, type, v);
    }
    
    randomOtherVariant(id, rng) {
        const t = this.getTypeById(id);
        const c = this.getCategoryById(id);
        return this.randomInType(c, t, rng);
    }
};


function initImageInventory() {
    var img = new Inventory();

    img.addType("passenger_locomotive", [
        "assets/passenger_locomotives/loco_3.png"
    ], { leftCoupling: 12, rightCoupling: 12 })
    img.addType("passenger_locomotive", [
        "assets/passenger_locomotives/loco_3_blue.png"
    ], { leftCoupling: 12, rightCoupling: 12 })
    img.addType("passenger_locomotive", [
        "assets/passenger_locomotives/loco_3_green.png"
    ], { leftCoupling: 12, rightCoupling: 12 })
    img.addType("passenger_locomotive", [
        "assets/passenger_locomotives/loco_3_red.png"
    ], { leftCoupling: 12, rightCoupling: 12 })
    img.addType("passenger_locomotive", [
        "assets/passenger_locomotives/loco_3_tan.png"
    ], { leftCoupling: 12, rightCoupling: 12 })

    img.addType("freight_locomotives", [
        "assets/freight_locomotives/loco_freight_1_2_blue.png"
    ])
    img.addType("freight_locomotives", [
        "assets/freight_locomotives/loco_freight_1_2_gray.png"
    ])
    img.addType("freight_locomotives", [
        "assets/freight_locomotives/loco_freight_1_2_green.png"
    ])
    img.addType("freight_locomotives", [
        "assets/freight_locomotives/loco_freight_1_2_red.png"
    ])
    img.addType("freight_locomotives", [
        "assets/freight_locomotives/loco_freight_1_2_yellow.png"
    ])
    img.addType("freight_locomotives", [
        "assets/freight_locomotives/loco_freight_2_blue.png"
    ])
    img.addType("freight_locomotives", [
        "assets/freight_locomotives/loco_freight_2_green.png"
    ])
    img.addType("freight_locomotives", [
        "assets/freight_locomotives/loco_freight_2_tan.png"
    ])

    img.addType("passenger_wagon", [
        "assets/passenger_wagons/passenger_wagon_1a.png",
        "assets/passenger_wagons/passenger_wagon_1b.png",
        "assets/passenger_wagons/passenger_wagon_1c.png",
        "assets/passenger_wagons/passenger_wagon_1d.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("container_wagon", [
        "assets/containter_wagons/container-blue.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("container_wagon", [
        "assets/containter_wagons/container-brown.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("container_wagon", [
        "assets/containter_wagons/container-green.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("container_wagon", [
        "assets/containter_wagons/container-purple.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("container_wagon", [
        "assets/containter_wagons/container-red.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("container_wagon", [
        "assets/containter_wagons/container-tan.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("container_wagon", [
        "assets/containter_wagons/container-white.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("container_wagon", [
        "assets/containter_wagons/container-yellow.png"
    ], { leftCoupling: 8, rightCoupling: 5 })


    img.addType("car_wagon", [
        "assets/freight_wagons/car_transporter-empty.png"
    ], { leftCoupling: 8, rightCoupling: 5 })

    img.addType("covered_wagon", [
        "assets/freight_wagons/covered_wagon-blue.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("covered_wagon", [
        "assets/freight_wagons/covered_wagon-brown.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("covered_wagon", [
        "assets/freight_wagons/covered_wagon-green.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("covered_wagon", [
        "assets/freight_wagons/covered_wagon-red.png"
    ], { leftCoupling: 8, rightCoupling: 5 })

    img.addType("gondola_wagon", [
        "assets/freight_wagons/gondola-blue.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("gondola_wagon", [
        "assets/freight_wagons/gondola-brown.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("gondola_wagon", [
        "assets/freight_wagons/gondola-green.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("gondola_wagon", [
        "assets/freight_wagons/gondola-red.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("hopper_wagon", [
        "assets/freight_wagons/hopper-blue.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("hopper_wagon", [
        "assets/freight_wagons/hopper-red.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("hopper_wagon", [
        "assets/freight_wagons/hopper-tan.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("hopper_wagon", [
        "assets/freight_wagons/hopper-white.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("hopper_wagon", [
        "assets/freight_wagons/hopper-yellow.png"
    ], { leftCoupling: 8, rightCoupling: 5 })

    img.addType("open_wagon", [
        "assets/freight_wagons/open_wagon-blue.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("open_wagon", [
        "assets/freight_wagons/open_wagon-gray.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("open_wagon", [
        "assets/freight_wagons/open_wagon-green.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("open_wagon", [
        "assets/freight_wagons/open_wagon-red.png"
    ], { leftCoupling: 8, rightCoupling: 5 })

    img.addType("refrigerator_wagon", [
        "assets/freight_wagons/refrigerator_long-white.png"
    ], { leftCoupling: 8, rightCoupling: 5 })
    img.addType("refrigerator_wagon", [
        "assets/freight_wagons/refrigerator-white.png"
    ], { leftCoupling: 8, rightCoupling: 5 })

    img.addType("skeleton_wagon", [
        "assets/freight_wagons/skeleton-empty.png"
    ], { leftCoupling: 8, rightCoupling: 5 })

    return img
}

module.exports = {
    initImageInventory
};
