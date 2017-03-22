'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');

module.exports = yeoman.Base.extend({
  initialize: function () {
    this.data = {};
    this.conflicter.force = true;
  },
  loadCards: function () {
    var done = this.async();
    var cardFileName = path.join(this.destinationRoot(), '/bot/cards/cards.json');
    var cards = require(cardFileName);
    this.data.cards = cards;
    done();
  },
  inputName: function () {
    var done = this.async();
    this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Tell me the card name:'
    }]).then((answers) => {
      this.log(answers.name);
      this.data.card = {};
      this.data.card.name = answers.name;
      done();
    });
  },
  checkName: function () {
    var done = this.async();
    for (var i = 0; i < this.data.cards.length; i++) {
      if (this.data.cards[i].name.toLowerCase() === this.data.card.name.toLowerCase()) {
        this.env.error("Sorry. A card with the same name already exists");
      }
    }
    done();
  },
  inputType: function () {
    var done = this.async();
    var prompts = [{
      type: 'list',
      name: 'cardType',
      message: 'Choose a card type:',
      choices: ['Text', 'Hero', 'Image', 'Carousel', 'Prompt']
    }];
    this.prompt(prompts).then((answers) => {
      this.data.card.type = answers.cardType.toLowerCase();
      done();
    });
  },
  inputTitle: function () {
    var done = this.async();
    var validTypes = ['hero'];
    if (validTypes.indexOf(this.data.card.type) >= 0) {
      var prompts = [{
        type: 'text',
        name: 'title',
        message: 'Title of the card: '
      }];
      this.prompt(prompts).then((answers) => {
        this.data.card.title = answers.title;
        done();
      });
    } else {
      done();
    }
  },
  inputSubtitle: function () {
    var done = this.async();
    var validTypes = ['hero'];
    if (validTypes.indexOf(this.data.card.type) >= 0) {
      var prompts = [{
        type: 'text',
        name: 'subtitle',
        message: 'Subtitle of the card: '
      }];
      this.prompt(prompts).then((answers) => {
        if (answers.subtitle && answers.subtitle !== '') {
          this.data.card.subtitle = answers.subtitle;
        }
        done();
      });
    } else {
      done();
    }
  },
  inputImage: function () {
    var done = this.async();
    var validTypes = ['hero', 'image'];
    if (validTypes.indexOf(this.data.card.type) >=0) {
      var prompts = [{
        type: 'text',
        name: 'image',
        message: 'URL of the image: '
      }];
      this.prompt(prompts).then((answers) => {
        var urllow = answers.image.toLowerCase();
        if (this.data.card.type === 'image') {
          var contentType = 'image/';
          if (urllow.endsWith('png')) {
            contentType += 'png';
          } else if (urllow.endsWith('gif')) {
            contentType += 'gif';
          } else {
            contentType += 'jpeg';
          }
          this.data.card.images = [{ contentType: contentType, contentUrl: answers.image }];
        } else {
          this.data.card.image = answers.image;
        }
        done();
      });
    } else {
      done();
    }
  },
  inputText: function () {
    var done = this.async();
    var validTypes = ['text', 'hero', 'prompt'];
    if (validTypes.indexOf(this.data.card.type) >=0) {
      var prompts = [{
        type: 'text',
        name: 'cardText',
        message: 'Text for the card: '
      }];
      this.prompt(prompts).then((answers) => {
        this.data.card.text = answers.cardText;
        done();
      });
    } else {
      done();
    }
  },
  inputButton: function() {
    var done = this.async();
    var validTypes = ['text', 'hero', 'prompt'];
    if (validTypes.indexOf(this.data.card.type) < 0) {
      done();
    }
    var prompts = [{
      type: 'text',
      name: 'title',
      message: 'Caption of the button (Enter to finish): '
    }];
    this.prompt(prompts).then((answers) => {
      if (answers.title && answers.title !== '') {
        this.data.currentButton = { title: answers.title };
        var prompts2 = [{
          type: 'list',
          name: 'buttonType',
          message: 'What does the button?:',
          choices: ['Open an URL', 'Write something']
        }];
        this.prompt(prompts2).then((answers) => {
          if (answers.buttonType === 'Open an URL') {
            this.data.currentButton.type = 'openurl';
            var prompts3 = [{
              type: 'text',
              name: 'buttonUrl',
              message: 'URL for the button: '
            }];
            this.prompt(prompts3).then((answer) => {
              this.data.currentButton.url = answer.buttonUrl;
              if (!this.data.card.buttons) {
                this.data.card.buttons = [];
              }
              this.data.card.buttons.push(this.data.currentButton);
              this.inputButton();
            })
          } else {
            this.data.currentButton.type = 'imback';
            var prompts4 = [{
              type: 'text',
              name: 'buttonValue',
              message: 'What the button writes: '
            }];
            this.prompt(prompts4).then((answer) => {
              this.data.currentButton.value = answer.buttonValue;
              if (!this.data.card.buttons) {
                this.data.card.buttons = [];
              }
              this.data.card.buttons.push(this.data.currentButton);
              this.inputButton();
            })
          }
        });
      } else {
        done();
      }
    });
  },
  printCards: function () {
    this.data.cards.push(this.data.card);
    console.log(this.data.cards);
  },
  saveCards: function () {
    var cardFileName = path.join(this.destinationRoot(), '/bot/cards/cards.json');
    this.write(cardFileName, JSON.stringify(this.data.cards, null, 2));
  }
});
