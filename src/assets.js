///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 Nick Naumenko (https://gitlab.com/nnaumenko, 
// https:/github.com/nnaumenko)
// All rights reserved.
// This software may be modified and distributed under the terms of the MIT 
// license. See the LICENSE file for details.
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// class Inventory
//
// An inventory of assets, such as image or sound.
// 
// Inventory groups assets into categories, types and variants so that the 
// procedural generators can easily pick random assets within the same 
// categories or types to produce the desired level of variance.
//
// Each item in inventory has and ID. The id is unique within inventory.
//
// Inventory consists of asset categories, each category has a string name.
//
// Each asset category consists of asset types. It is assumed that all types 
// within the single category are interchangeable; procedural generator may 
// pick any type within the category and use it exactly the same way as any 
// other type within this category. Types have numeric identifiers.
//
// Each asset type further consists of asset variants. Variants are individual
// assets within the same asset type which have minor diffirences. Variants
// also have numeric identifiers.
//
// Assets are added into the inventory by category and type. Use addType() 
// method and provide category string, and array of the individual assets;
// identifiers of type, asset, and variant are assigned automatically.
///////////////////////////////////////////////////////////////////////////////

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
        let ids = new Array();
        let cat = this.#idMap.get(category);
        if (cat === undefined) {
            cat = new Array();
        }
        let t = new Array();
        paths.forEach(function (item, index, array) {
            if (typeof item != "string") {
                console.error("Inventory.addType", "not a string", item, "at index", index);
            } else {
                ids.push(this.#nextId);
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
        return ids;
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

    getAllIdsInType(category, type) {
        const variants = this.countVariantsInType(category, type);
        let result = [];
        for (let i=0; i<variants; i++)
            result.push(this.getId(category, type, i));
        return result;
    }

    getAllIdsInCategory(category) {
        const types = this.countTypesInCategory(category);
        let result = [];
        for (let i=0; i<types; i++)
            result = result.concat(this.getAllIdsInType(category, i));
        return result;
    }
};

module.exports = {
    Inventory: Inventory
};