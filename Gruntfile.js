module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    manifest: grunt.file.readJSON('src/manifest.json'),
    target: 'target/<%= pkg.name %>-<%= manifest.version %>',
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'src/**/*.json',
        '!src/vendor/**/*.js',
        '!src/vendor/**/*.json'
      ]
    },
    compress: {
      zip: {
        options: {
          archive: '<%= target %>.zip',
          mode: 'zip'
        },
        files: [{
          cwd: 'src',
          src: '**/*',
          dest: '<%= pkg.name %>-<%= manifest.version %>',
          expand: true
        }]
      }
    },
  });

  require('matchdep').filterDev(['grunt-*']).forEach(grunt.loadNpmTasks);

  grunt.registerTask('lint', 'jshint');

  grunt.registerTask('build', ['bump:cmd', 'default', 'compress']);

  grunt.registerTask('default', ['lint']);

  /* Using the version format <major>.<minor>.<patch>: grunt bump:[major|minor|patch] */
  grunt.registerTask('bump', function (ver) {
    if (!ver.match('major|minor|patch|cmd')) {
      grunt.log.error('Please use as: Grunt bump:[major|minor|patch]');
      return true;
    }

    if (ver === 'cmd') {
      if (grunt.option('no-bump')) {
        grunt.log.writeln('Not bumping version');
        return true;
      }
      else if (grunt.option('major')) {
        ver = 'major';
      }
      else if (grunt.option('minor')) {
        ver = 'minor';
      }
      else if (grunt.option('patch')) {
        ver = 'patch';
      }
      else {
        grunt.log.writeln('No bump flag passed. Not bumping version.');
        return true;
      }
    }

    grunt.log.subhead('Bumping version');

    var manifestFile = 'src/manifest.json';
    if (!grunt.file.exists(manifestFile)) {
      grunt.log.error('No manifest found at: ' + manifestFile);
      return true;
    }
    var manifest = grunt.file.readJSON(manifestFile);
    var pkg = grunt.file.readJSON('package.json');

    if (pkg.version !== manifest.version) {
      grunt.log.error('Package and manifest versions do not currently match.');
      return true;
    }

    if (!pkg.version.match(/^([0-9]+.[0-9]+.[0-9]+)$/)) {
      grunt.log.error('Version is in the wrong format. Must be <major>.<minor>.<patch>');
      return true;
    }

    grunt.log.writeln('Old version: ' + pkg.version);

    var matched = pkg.version.match(/^([0-9]+).([0-9]+).([0-9]+)$/);
    var major = parseInt(matched[1]);
    var minor = parseInt(matched[2]);
    var patch = parseInt(matched[3]);

    switch (ver) {
      case 'major':
        major++;
        minor = patch = 0;
        break;
      case 'minor':
        minor ++;
        patch = 0;
        break;
      case 'patch':
        patch++;
        break;
    }

    var newVersion = major + '.' + minor + '.' + patch;

    pkg.version = manifest.version = newVersion;

    grunt.file.write(manifestFile, JSON.stringify(manifest, null, 2));
    grunt.file.write('package.json', JSON.stringify(pkg, null, 2));

    grunt.log.oklns('New version: ' + newVersion);
    grunt.config.set('pkg', pkg);
    grunt.config.set('manifest', manifest);
  });
};
