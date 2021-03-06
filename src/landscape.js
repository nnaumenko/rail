///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 Nick Naumenko (https://gitlab.com/nnaumenko, 
// https:/github.com/nnaumenko)
// All rights reserved.
// This software may be modified and distributed under the terms of the MIT 
// license. See the LICENSE file for details.
///////////////////////////////////////////////////////////////////////////////

function generate(img, snd, rng) {
    let landscape = { colours: {}, clouds: {} };
    // Landscape
    landscape.type = generateType(rng);
    // Season: ground colours, tree appearance, etc
    let season = generateSeason(rng);
    landscape.season = season.description;
    landscape.colours.ground = season.ground;
    // Sky: colour, cloud appearance, cloud speed and amount
    let sky = generateSkyAndWind(rng);
    landscape.sky_type = sky.sky;
    landscape.colours.sky = sky.sky_colour;
    landscape.colours.horizon = sky.horizon_colour;
    landscape.clouds.type = sky.clouds;
    landscape.clouds.large = sky.cloud_amount_large;
    landscape.clouds.medium = sky.cloud_amount_medium;
    landscape.clouds.small = sky.cloud_amount_small;
    if (sky.windy) landscape.clouds.windy = true;
    landscape.clouds.speed = sky.wind;
    // Adjust snow colour: snow is very bright in sunny weather
    if (landscape.season == 'winter' && landscape.sky_type == 'blue')
        landscape.colours.ground = 0xffffff;
    return landscape;
}

function generateType(rng) {
    let type = rng.range(0, 3);
    switch (type) {
        case 0: return 'railway';
        case 1: return 'railway_high_speed';
        case 2: return 'railway_crossing';
    }
    return type;
}

function generateSeason(rng) {
    const seasons = [
        {
            description: 'spring',
            ground: 0x32770a
        },
        {
            description: 'summer',
            ground: 0x577713
        },
        {
            description: 'autumn',
            ground: 0x615814
        },
        {
            description: 'winter',
            ground: 0xe0e0e0
        },
    ];
    season = rng.range(0, 4);
    return seasons[season];
}

function generateSkyAndWind(rng) {
    let skyAndWind = {};

    // Wind (cloud direction and speed)
    const minWind = 3;
    const maxWind = 50;
    const wind = rng.range(minWind, maxWind);
    const windDir = rng.range(0, 2);
    skyAndWind.wind = wind;
    if (windDir) skyAndWind.wind = -skyAndWind.wind;

    // 'windy' flag: allows 'windy' cloud appearance
    if (wind >= maxWind/2) skyAndWind.windy = true;

    // Sky colour and type, amount of clouds (in percent), haze/mist...
    skyAndWind.sky = 'blue';
    skyAndWind.clouds = 'white';
    skyAndWind.sky_colour = 0x3498d8;
    skyAndWind.horizon_colour = 0x4fa6de;
    skyAndWind.cloud_amount_large = rng.range(0, 10);
    skyAndWind.cloud_amount_medium = rng.range(0, 100);
    skyAndWind.cloud_amount_small = rng.range(0, 100);
    const skyType = rng.range(0, 2);
    const haze = rng.range(0, 2);
    if (haze) {
        skyAndWind.horizon_colour = 0x8bc4e9;
        skyAndWind.haze = true;
    }
    if (skyType) {
        skyAndWind.sky = 'grey';
        skyAndWind.clouds = 'dark';
        skyAndWind.sky_colour = 0xe0e0ff;
        skyAndWind.horizon_colour = 0xb0b0df;
        skyAndWind.cloud_amount_large = 0;
        skyAndWind.cloud_amount_medium /= 2;
        if (haze) skyAndWind.horizon_colour = 0x808080;
    }
    return skyAndWind; 
}

module.exports = {
    generate
};