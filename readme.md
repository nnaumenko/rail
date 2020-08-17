# Railway watching animation for children

[![pipeline status](https://gitlab.com/nnaumenko/rail/badges/master/pipeline.svg)](https://gitlab.com/nnaumenko/rail/-/commits/master)
[![MIT license](https://img.shields.io/github/license/nnaumenko/rail)](LICENSE.md)
[![Live demo](https://img.shields.io/badge/live-demo-blue)](https://nnaumenko.gitlab.io/rail)

This is the simple procedurally generated animation of train passing by.

[Watch live demo.](https://nnaumenko.gitlab.io/rail)

## Why?

Because my child loves watching trains.

Unfortunately since COVID-19 epidemic we have to keep away from railway stations, and train videos & animations is the solution for now. While train videos are plentiful, the cartoons and animations are not.

So we have discussed the idea and developed a procedurally generated train animation which can play for a long time without repeating itself. The deal was that I implement the requested features and little project manager learns to put together consistent detailed descriptions and to prioritise requests, and so far it seems to work.

I decided to make this project public; if your child loves watching trains too please feel free to use this animation to entertain him or her.

New features are planned but due to the nature of the project no schedule can be set.

## References and attribution

The trains and landscapes are procedurally generated using [seedable pRNG](https://www.npmjs.com/package/rng). The seed value in the URL's hash provides a way to bookmark the particular animation. If no seed value is provided, a random one will be generated.

Animation is rendered using [Phaser 3](https://phaser.io/phaser3). The code is written in ES6 and transpiled using Babel and Webpack, building and deployment performed by Gitlab CI.

The original images used for creating image assets were purchased from [https://freepik.com](https://freepik.com).

The original sounds used for creating sound assets are by [InspectorJ](https://freesound.org/people/InspectorJ/), [mrkva](https://freesound.org/people/mrkva/), [arundasstp](https://freesound.org/people/arundasstp/). The sounds are distributed on the terms of CC-BY license at [https://freesound.org/](https://freesound.org/).