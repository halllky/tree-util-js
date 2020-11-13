const path = require('path');

/** @type { import('webpack').Configuration } */
module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'development', // 'production' | 'development' | 'none'

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: './src/index.ts',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },

  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      options: {
        compilerOptions: {
          declaration: true,
          declarationDir: './dist',
          downlevelIteration: true, // for-of 構文でインデックスの値をとれるようにする @es5
          files: ['./src/*.ts']
        },
      },
    }]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    modules: [
      'node_modules', // node_modules 内も対象とする
    ],
    extensions: [
      '.ts',
      '.js' // node_modulesのライブラリ読み込みに必要
    ]
  }
};
