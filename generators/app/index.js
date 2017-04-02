'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

module.exports = class extends Generator{

  /**
   * Ask general questions to generate the flowbot app.
   */
  prompting() {
    this.log(yosay(
      'Welcome to the stupendous ' + chalk.red('generator-flowbot') + ' generator!'
    ));

    var defAppName = path.basename(process.cwd());

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What\'s the name of your application?',
      default: defAppName
    },{
      type: 'input',
      name: 'appFolder',
      message: 'What\'s the name of the folder? (Will be created)',
      default: defAppName
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  }

  /**
   * Grite the files from the template folder.
   */
  writing () {
    var done = this.async();
    var root = path.join(this.destinationRoot(), this.props.appFolder);
    if (!fs.existsSync(root)) {
      this.log.create(this.props.appFolder + '/');
      fs.mkdirSync(root);
    }
    this.destinationRoot(root);
    this.log();
    glob('**', {dot:true, cwd: this.sourceRoot()}, function (er, files) {
      for (var i = 0; i < files.length; i++) {
        var fileName = files[i];
        var targetName = fileName.replace(/^_/, '');
        if (fileName.startsWith('_')) {
          this.fs.copyTpl(this.templatePath(fileName), this.destinationPath(targetName), this.props);
        } else {
          this.fs.copy(
            this.templatePath(fileName),
            this.destinationPath(targetName));
        }
      }
      done();
    }.bind(this));
  }

  /**
   * Install dependencies.
   */
  install () {
    this.installDependencies({ bower: false, npm: true, callback: function() {
      this.log('\r\n');
      this.log('Your flowbot project is now created. You can use the following commands to get going');
      this.log(chalk.green('    cd "'+this.props.appFolder+'"'));
      this.log(chalk.green('    npm start'));
      this.log('You can create cards:');
      this.log(chalk.green('    yo flowbot:card'));
      this.log('You can create actions:');
      this.log(chalk.green('    yo flowbot:action'));
      this.log('You can create plugins:');
      this.log(chalk.green('    yo flowbot:plugin'));
    }.bind(this) });
  }

};
