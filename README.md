# Generate sprites from retina images
This "Basic" task generate images from large original (@2x) sources, optimize sprite via imgo and fix half-pixel bug (retina-images with odd width/height). 

Inspired by [grunt-tamia-sprite](https://github.com/tamiadev/grunt-tamia-sprite).

## Installation

This plugin requires Grunt 0.4. Uses [grunt-tamia-sprite](https://github.com/tamiadev/grunt-tamia-sprite), [grunt-imgo](https://github.com/sapegin/grunt-imgo) (optional) tasks and [GraphicsMagick for node](https://github.com/aheckmann/gm).

### Install GraphicsMagick
Download and install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

    brew install imagemagick
    brew install graphicsmagick

Then install grunt-spritify and deps tasks:

    npm install -D grunt-tamia-sprite grunt-imgo grunt-spritify

Add to your `Gruntfile.js`:

```javascript
grunt.loadNpmTasks('grunt-tamia-sprite');
grunt.loadNpmTasks('grunt-imgo');
grunt.loadNpmTasks('grunt-spritify');
```

## Usage
Pass folder as argument for task:

    grunt spritify:${PWD}

Use `${PWD}` for generate sprite in current folder.

By default task try to find `<folder>/origin/*.png` original files for sprite.


## Configuration

Then add section named `spritify` inside `grunt.initConfig()`. See next section for details.

### options
Options inside `options` object.

### options.src
Original files for sprite. Support [globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns). Default: `origin/*.png`

### options.dest
Dest folder with generated for `grunt-tamia-sprite` images. Default: `src`

### options.destSprite
Sprite name. Pass string or function (first argument — `dir`, passed in task arguments). Default: bem-liked name notation by path `<folder-name>__7up.png`, support mods: `block_mod__7up.png` for path `block/_mod/`.

### options.gm
Object, passed in gm [options](https://github.com/aheckmann/gm#use-imagemagick-instead-of-gm). Pass the option `{imageMagick: true}` to use ImageMagick instead of gm

### options.sprite
Object passed to `grunt-tamia-sprite` task. Default:

```
{
    destStyl: false
}
```

By default `grunt-tamia-sprite` generate `.json` file with [sprite variables](https://github.com/tamiadev/grunt-tamia-sprite#stylus-example-with-nib--vars-from-json-file)

### options.imgo
Object passed to `grunt-imgo` task. Pass `imgo: false` if need disable imgo optimization.