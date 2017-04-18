const stylelint = require('stylelint');
const cssLintRules = require('./csslint.json');
const path = require('path');

module.exports = function(entries, output) {
  const babelLoaderConfig = {
    test: /\.jsx?$/,
    loader: 'babel',
    babelrc: false,
    exclude: /node_modules/,
    query: {
      presets: ['es2015', 'react', 'stage-1'],
      cacheDirectory: true
    }
  };

  return {
    entry: entries,
    resolveLoader: {
      root: path.join(__dirname, "..", "node_modules"),
      fallback: path.join(__dirname, "..")
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    output: {
      path: output,
      publicPath: '/',
      filename: 'bundle.js'
    },
    externals: {
      'cheerio': 'window',
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    },
    module: {
      preLoaders: [
        {
          test: /\.css$/,
          loaders: ['postcss']
        }
      ],
      loaders: [
        {
          test: /package\.json$/,
          loader: 'json-loader' // json loader for dependency on any json file
        },
        {
          test: /\.less$/,
          loader: 'style-loader!css-loader!less-loader'
        },
        {
          test: /\.css$/,
          loaders: ['style', 'css']
        },
        { test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=8192' },
        babelLoaderConfig,
        {
          test: /\.(gif|svg|woff|woff2|ttf|eot|html)$/,
          loader: 'file'
        }
      ]
    },
    postcss: function () {
      return [stylelint({
        rules: cssLintRules
      })];
    }
  }
}