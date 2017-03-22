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
    return done();
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
      return done();
    });
  },
  checkName: function () {
    var done = this.async();
    for (var i = 0; i < this.data.cards.length; i++) {
      if (this.data.cards[i].name.toLowerCase() === this.data.card.name.toLowerCase()) {
        this.env.error("Sorry. A card with the same name already exists");
      }
    }
    return done();
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
      return done();
    });
  },
  inputPromptType: function() {
    var done = this.async();
    var validTypes = ['prompt'];
    if (validTypes.indexOf(this.data.card.type) < 0) {
      return done();
    }
    var prompts = [{
      type: 'list',
      name: 'promptType',
      message: 'Choose a prompt type:',
      choices: ['Text', 'Number', 'Time', 'Attachment', 'Choice', 'Menu']
    }];
    this.prompt(prompts).then((answers) => {
      this.data.card.prompt = answers.promptType.toLowerCase();
      if (this.data.card.prompt === 'menu') {
        this.data.card.isMenu = true;
        this.data.card.prompt = 'choice';
      }
      return done();
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
        return done();
      });
    } else {
      return done();
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
        return done();
      });
    } else {
      return done();
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
        return done();
      });
    } else {
      return done();
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
        return done();
      });
    } else {
      return done();
    }
  },
  inputButton: function() {
    var done = this.async();
    var validTypes = ['hero'];
    if (validTypes.indexOf(this.data.card.type) < 0) {
      return done();
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
        return done();
      }
    });
  },
  inputCarouselCard: function() {
    var done = this.async();
    var validTypes = ['carousel'];
    if (validTypes.indexOf(this.data.card.type) < 0) {
      return done();
    }
    var prompt = {
      type: 'list',
      name: 'card',
      message: 'Choose a card to add to the Carousel: ',
      choices: ['Finish choosing cards']
    }
    for (var i = 0; i < this.data.cards.length; i++) {
      prompt.choices.push(this.data.cards[i].name);
    }
    this.prompt([prompt]).then((answers) => {
      if (answers.card === 'Finish choosing cards') {
        return done();
      }
      if (!this.data.card.cards) {
        this.data.card.cards = [];
      }
      this.data.card.cards.push(answers.card);
      this.inputCarouselCard();
    });
  },
  inputVariableName: function () {
    var done = this.async();
    var validTypes = ['prompt'];
    console.log(this.data.card.type);
    if (validTypes.indexOf(this.data.card.type) < 0) {
      return done();
    }
    this.prompt([{
      type: 'input',
      name: 'variableName',
      message: 'Tell me the variable name (user.name if is stored for the user, dialog.name if is temporal for this dialog):'
    }]).then((answers) => {
      this.data.card.variable = answers.variableName;
      return done();
    });
  },
  inputChoice: function() {
    var done = this.async();
    if (this.data.card.prompt && this.data.card.prompt === 'choice' && !this.data.card.isMenu) {
      var prompts = [{
        type: 'text',
        name: 'choiceCaption',
        message: 'Caption of the choice (Enter to finish): '
      }];
      this.prompt(prompts).then((answers) => {
        if (!answers.choiceCaption || answers.choiceCaption === '') {
          return done();
        }
        this.data.currentOption = { text: answers.choiceCaption }
        var prompts2 = [{
          type: 'text',
          name: 'choiceValue',
          message: 'Value returned by this choice: '
        }];
        this.prompt(prompts2).then((answers) => {
          if (!this.data.card.options) {
            this.data.card.options = [];
          }
          this.data.currentOption.tag = answers.choiceValue;
          this.data.card.options.push(this.data.currentOption);
          return this.inputChoice();
        });
      });
    } else {
      return done();
    }
  },
  inputMenu: function() {
    var done = this.async();
    if (this.data.card.prompt && this.data.card.prompt === 'choice' && this.data.card.isMenu) {
      var prompts = [{
        type: 'text',
        name: 'choiceCaption',
        message: 'Caption of the choice (Enter to finish): '
      }];
      this.prompt(prompts).then((answers) => {
        if (!answers.choiceCaption || answers.choiceCaption === '') {
          return done();
        }
        this.data.currentOption = { text: answers.choiceCaption }
        var prompts2 = [{
          type: 'text',
          name: 'choiceValue',
          message: 'Dialog to be executed by this choice (endDialog means that this is a quit menu option): '
        }];
        this.prompt(prompts2).then((answers) => {
          if (!this.data.card.options) {
            this.data.card.options = [];
          }
          this.data.currentOption.tag = answers.choiceValue;
          this.data.card.options.push(this.data.currentOption);
          return this.inputMenu();
        });
      });
    } else {
      return done();
    }
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
