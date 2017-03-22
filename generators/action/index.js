'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var fs = require('fs');

module.exports = class extends Generator{

  prompting() {
    this.log('\r\n');
    this.log('Generator of flowbot actions');
    this.log('\r\n');

    var prompts = [{
      type: 'input',
      name: 'actionName',
      message: 'What\'s the name of the action?'
    }];

    function uncapitalize(s) {
      return s.charAt(0).toLowerCase() + s.slice(1);
    }

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      this.props.actionName = uncapitalize(this.props.actionName);
    }.bind(this));
  }

  writing() {
    var root = path.join(this.destinationRoot(), 'bot/actions');
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }
    this.destinationRoot(root);
    console.log(root);
    var source = '_action.js';
    var target = this.props.actionName + '.js';
    this.fs.copyTpl(this.templatePath(source), this.destinationPath(target), this.props);
  }
};
