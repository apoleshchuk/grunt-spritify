/**
 * Task for generate sprite from retina-size images
 */
module.exports = function(grunt) {
	'use strict';
	var gm = require('gm');
	var async = require('async');
	var path = require('path');
	var _ = require('lodash');

	function generateImage(image, path, resize, done) {
		if (resize) {
			image.resize.apply(image, resize);
		}
		image.toBuffer(function (err, buffer) {
			if (err) {
				grunt.fatal(err);
				return done(err);
			}

			grunt.file.write(path, buffer);
			grunt.verbose.writeln('File ' + path.cyan + ' created.');
			done(null, path);
		});
	}

	grunt.registerTask('spritify', 'Complex task for optimize, retinafy and spritify', function (dir) {
		var done = this.async();
		
		var targetName = 'spritify_' + Date.now();
		var options = this.options({
			src: 'origin/*.png',
			dest: 'src',
			destSprite: function(dir) {
				var dirList = dir.replace(/\/$/, '').split('/');
				var result = [];
				while (result.splice(0,0, dirList.pop())) {
					if (result[0].charAt(0) != '_') {
						break;
					}
				}
				return result.join('') + '__7up.png';
			},
			sprite: {
				destStyl: false
			},
			imgo: {},
			gm: {
				imageMagick: true
			}
		});
		var taskList = ['sprite'];
		var gruntConfig = {}, spriteConfig = {}, imgoConfig = {}, destSprite;

		destSprite = options.destSprite;
		dir = path.resolve(dir);
		
		if (typeof destSprite == 'function') {
			destSprite = destSprite(dir);
		}

		destSprite = path.resolve(dir, destSprite || '7up.png');
		spriteConfig[targetName] = _.extend({}, options.sprite, {
			src: path.resolve(dir, options.dest, '*.png'),
			dest: destSprite
		});

		gruntConfig = {
			sprite: spriteConfig
		};

		if (options.imgo !== false) {
			imgoConfig[targetName] = _.extend({}, options.imgo, {
				src: [
					destSprite, 
					path.resolve(
						path.dirname(destSprite), 
						path.basename(destSprite, path.extname(destSprite)) + '@2x' + path.extname(destSprite)
					)
				]
			});
			gruntConfig.imgo = imgoConfig;
			taskList.push('imgo');
		}

		grunt.config.merge(gruntConfig);

		async.map(grunt.file.expand({cwd: dir}, options.src), function(file, callback) {
			var extname = path.extname(file);
			var basename = path.basename(file, extname);
			var destDir = path.resolve(dir, options.dest);
			var image = gm(path.resolve(dir, file)).options(options.gm);
			image.size(function(err, size) {
				if (size) {
					size.width = Math.ceil(size.width/2)*2;
					size.height = Math.ceil(size.height/2)*2;

					image
						.gravity('NorthWest')
						.extent(size.width, size.height)
						.transparent('white');

					async.series([
						generateImage.bind(null, image, path.resolve(destDir, basename + '@2x' + extname), false),
						generateImage.bind(null, image, path.resolve(destDir, basename + extname), [50, 50, '%']),
					], callback);
				}
			});
		}, function(err, results) {
			grunt.log.writeln('Files for sprite created.');
			grunt.task.run(taskList.map(function(taskName) {
				return [taskName, targetName].join(':');
			}));
			done();
		});
	});
};