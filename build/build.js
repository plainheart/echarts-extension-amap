const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const commander = require('commander');
const rollup = require('rollup');
const config = require('./config');
const { name, version } = require('../package.json');

function run() {
  const descIndent = '                                   ';
  const egIndent = '    ';

  commander
    .usage('[options]')
    .description([
      `Build ${name} and generate result files in directory \`dist\`.`,
      '',
      '  For example:',
      '',
      egIndent + 'node build/build.js --release'
        + '\n' + descIndent + '# Build all to `dist` folder.',
      egIndent + 'node build/build.js'
        + '\n' + descIndent + `# Only generate \`dist/${name}.js\`.`,
      egIndent + 'node build/build.js --min'
        + '\n' + descIndent + `# Only generate \`dist/${name}.min.js\`.`,
    ].join('\n'))
    .option(
      '-w, --watch', [
      'Watch modifications of files and auto-compile to dist file. For example,',
      descIndent + `\`dist/${name}.js\`.`
    ].join('\n'))
    .option(
      '--release',
      'Build all for release'
    )
    .option(
      '--min',
      'Whether to compress the output file'
    )
    .parse(process.argv);

  const isWatch = !!commander.watch;
  const isRelease = !!commander.release;

  const opt = {
    min: commander.min,
    addBundleVersion: isWatch
  };

  if (isRelease) {
    fsExtra.emptyDirSync(path.resolve(__dirname, '../dist'));
  }

  if (isWatch) {
    watch(config(opt));
  }
  else if (isRelease) {
    const configs = [
      { min: false },
      { min: true }
    ].map(function (conf) {
      return config(conf);
    });

    build(configs).then(function () {
      generateExamples();
      console.log(
        color('fgGreen', 'dim')('\nBuild completely')
      );
    }).catch(function (err) {
      console.error(err);
    });
  }
  else {
    build([config(opt)]).then(function () {
      console.log(
        color('fgGreen', 'dim')('\nBuild completely')
      );
    })
    .catch(function (err) {
      console.error(err);
    });
  }
}

function generateExamples() {
  const exampleDir = path.resolve(__dirname, '../examples');
  const libVersionMap = {};
  [['', version], ['amap', '1.4.15'], ['echarts', 'latest']].forEach(function (lib) {
    const libName = lib[0];
    const libVersion = lib[1];
    const formattedLibName = ((libName ? libName + '_' : '') + 'version').toUpperCase();
    libVersionMap[formattedLibName] = (
      libName
        ? fs.readFileSync(
            exampleDir + '/' + libName + '.version',
            { encoding: 'utf-8' }
          ) || lib[1]
        : libVersion
    ).trim();
  });
  const exampleTypes = ['scatter', 'heatmap', 'lines'];
  [['en', false], ['zh_CN']].forEach(function (lang) {
    lang = `${lang[1] === false ? '' : '_' + lang[0]}`;
    exampleTypes.forEach(function (type) {
      const fileName = `${type}${lang}.html`;
      const dest = path.resolve(exampleDir, './', fileName);
      console.log(
        color('fgCyan', 'dim')('\nGenerating example'),
        color('fgCyan')(fileName),
        color('fgCyan', 'dim')('=>'),
        color('fgCyan')(dest),
        color('fgCyan', 'dim')(' ...')
      );
      const tpl = fs.readFileSync(
        dest + '.tpl',
        { encoding: 'utf-8' }
      );
      let example = tpl;
      Object.keys(libVersionMap).forEach(function (libVer) {
        example = example.replace(
          new RegExp(`{${libVer}}`, 'g'),
          libVersionMap[libVer].trim()
        )
      });
      fs.writeFileSync(
        dest,
        example,
        { encoding: 'utf-8' }
      );
      console.log(
        color('fgGreen', 'dim')('\nGenerated '),
        color('fgGreen')(dest),
        color('fgGreen', 'dim')(' successfully.')
      );
    })
  });
}

function build(configs) {
  return new Promise(function (resolve, reject) {
    let index = 0;

    buildSingle();

    function buildSingle() {
      const config = configs[index++];

      if (!config) {
        resolve();
        return;
      }

      console.log(
        color('fgCyan', 'dim')('\nBundling '),
        color('fgCyan')(config.input),
        color('fgCyan', 'dim')('=>'),
        color('fgCyan')(config.output.file),
        color('fgCyan', 'dim')(' ...')
      );

      rollup.rollup(config).then(function (bundle) {
        return bundle.write(config.output);
      })
      .then(function () {
        console.log(
          color('fgGreen', 'dim')('\nCreated '),
          color('fgGreen')(config.output.file),
          color('fgGreen', 'dim')(' successfully.')
        );
        buildSingle();
      })
      .catch(function (err) {
        console.error(err)
        reject();
      });
    }
  });
};

function watch(config) {
  const watcher = rollup.watch(config);

  watcher.on('event', function (event) {
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    //   FATAL        — encountered an unrecoverable error
    if (event.code !== 'START' && event.code !== 'END') {
      console.log(
        color('fgBlue')('[' + getTimeString() + ']'),
        color('dim')('build'),
        event.code.replace(/_/g, ' ').toLowerCase()
      );
    }
    if (event.code === 'ERROR' || event.code === 'FATAL') {
      printCodeError(event.error);
    }
    if (event.code === 'BUNDLE_END') {
      printWatchResult(event);
    }
  });
}

function printWatchResult(event) {
  console.log(
    color('fgGreen', 'dim')('Created'),
    color('fgGreen')(event.output.join(', ')),
    color('fgGreen', 'dim')('in'),
    color('fgGreen')(event.duration),
    color('fgGreen', 'dim')('ms.')
  );
}

function printCodeError(error) {
  console.log('\n' + color()(error.code));
  if (error.code === 'PARSE_ERROR') {
    console.log(
      color()('line'),
      color('fgCyan')(error.loc.line),
      color()('column'),
      color('fgCyan')(error.loc.column),
      color()('in'),
      color('fgCyan')(error.loc.file)
    );
  }
  if (error.frame) {
    console.log('\n' + color('fgRed')(error.frame));
  }
  console.log(color('dim')('\n' + error.stack));
}

function getTimeString() {
  return (new Date()).toLocaleString();
}

const COLOR_RESET = '\x1b[0m';
const COLOR_MAP = {
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    fgBlack: '\x1b[30m',
    fgRed: '\x1b[31m',
    fgGreen: '\x1b[32m',
    fgYellow: '\x1b[33m',
    fgBlue: '\x1b[34m',
    fgMagenta: '\x1b[35m',
    fgCyan: '\x1b[36m',
    fgWhite: '\x1b[37m',

    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

/**
 * Print colored text with `console.log`.
 *
 * Usage:
 * let color = require('colorConsole');
 * color('fgCyan')('some text'); // cyan text.
 * color('fgCyan', 'bright')('some text'); // bright cyan text.
 * color('fgCyan', 'bgRed')('some text') // cyan text and red background.
 */
function color() {
  const prefix = [];
  for (let i = 0, len = arguments.length, color; i < len; i++) {
    color = COLOR_MAP[arguments[i]];
    color && prefix.push(color);
  }

  return function (text) {
    return prefix.join('') + text + COLOR_RESET;
  };
};

run();
