'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

module.exports = yeoman.Base.extend({

  /**
   * Ask general questions to generate the flowbot app.
   */
  prompting: function () {
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
  },

  /**
   * Grite the files from the template folder.
   */
  writing: function () {
    var done = this.async();
    var root = path.join(this.destinationRoot(), this.props.appName);
    if (!fs.existsSync(root)) {
      this.log.create(this.props.appName + '/');
      fs.mkdirSync(root);
    }
    this.destinationRoot(root);
    this.log();
    glob('**', {dot:true, cwd: this.sourceRoot()}, function (er, files) {
      for (var i = 0; i < files.length; i++) {
        var fileName = files[i];
        var targetName = fileName.replace(/^_/, '');
        if (fileName.startsWith('_')) {
          this.template(fileName, targetName, this.props);
        } else {
          this.fs.copy(
            this.templatePath(fileName),
            this.destinationPath(targetName));
        }
      }
      done();
    }.bind(this));
  },

  /**
   * Install dependencies.
   */
  install: function () {
    this.installDependencies({ bower: false, npm: true, callback: function() {
      this.log('\r\n');
      this.log('Your flowbot project is now created. You can use the following commands to get going');
      this.log(chalk.green('    cd "'+this.props.appFolder+'"'));
      this.log(chalk.green('    npm start'));
    }.bind(this) });
  }

});
