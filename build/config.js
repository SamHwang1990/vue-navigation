/**
 * Created by zhiyuan.huang@ddder.net on 17/7/5.
 */

'use strict';

const babel = require('rollup-plugin-babel');
const node = require('rollup-plugin-node-resolve');
const cjs = require('rollup-plugin-commonjs');

module.exports = {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel(),
    node({ main: true }),
    cjs({
      namedExports: {
        'node_modules/path-to-regexp/index.js': 'path-to-regexp'
      }
    })
  ],
  dest: 'dist/index.js'
}