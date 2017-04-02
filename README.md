# generator-flowbot [![NPM version][npm-image]][npm-url] [![Dependency Status](https://david-dm.org/jseijas/generator-flowbot/status.svg)](https://david-dm.org/jseijas/generator-flowbot)

> Generates flow chatbots in an easy way.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-flowbot using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-flowbot
```

Then generate your new project:

```bash
yo flowbot
```

Then you'll be able to create cards. A card is an interaction with the user:

```bash
yo flowbot:card
```

You can also create actions. An action is a javascript function that can be executed in a dialog pipeline:

```bash
yo flowbot:action
```

You can also create plugins. A plugin is a class that is instantiated as a singleton, and can be used by all the actions of the bot:

```bash
yo flowbot:plugin
```

## About flow-bot

Flow-Bot is a Framework to build bots based on the Microsoft Bot Framework, but including some cool features and a way of defining the bots only describing the cards to the user and the dialog flow.

You can see all the information of Flow-Bot at https://github.com/jseijas/flow-bot


## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Jesus Seijas]()


[npm-image]: https://badge.fury.io/js/generator-flowbot.svg
[npm-url]: https://npmjs.org/package/generator-flowbot
[travis-image]: https://travis-ci.org/nodejsbcn/generator-flowbot.svg?branch=master
[travis-url]: https://travis-ci.org/nodejsbcn/generator-flowbot
[daviddm-image]: https://david-dm.org/nodejsbcn/generator-flowbot.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/nodejsbcn/generator-flowbot
