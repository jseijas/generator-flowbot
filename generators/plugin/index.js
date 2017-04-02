'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var fs = require('fs');

module.exports = class extends Generator{

  prompting() {
    this.log('\r\n');
    this.log('Generator of flowbot plugins');
    this.log('\r\n');

    var prompts = [{
      type: 'input',
      name: 'pluginName',
      message: 'What\'s the name of the plugin?'
    }];

    function uncapitalize(s) {
      return s.charAt(0).toLowerCase() + s.slice(1);
    }

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      this.props.pluginNameUn = uncapitalize(this.props.pluginName);
    }.bind(this));
  }

  writing() {
    var root = path.join(this.destinationRoot(), 'bot/plugins');
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }
    this.destinationRoot(root);
    console.log(root);
    var source = '_plugin.js';
    var target = this.props.pluginNameUn + '.js';
    this.fs.copyTpl(this.templatePath(source), this.destinationPath(target), this.props);
  }
};
