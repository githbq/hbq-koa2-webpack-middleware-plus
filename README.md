# koa-webpack-middleware
改进[koa-webpack-middleware](https://www.npmjs.com/package/koa-webpack-hot-middleware)

```javascript
const { devMiddleware, hotMiddleware } = require('koa2-webpack-middleware-plus')
var compiler = webpack(webpackConfig)
const devMiddleware = devMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
//devMiddleware.origin 指向原始的 webpack-dev-middleware 对象
var hotMiddleware = hotMiddleware(compiler, {
  log: false,
  heartbeat: 2000,
  reload: true
})
//hotMiddleware.origin 指向原始的 webpack-hot-middleware 对象
const koa = require('koa')
const app = new koa()
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)


// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    bigLog()
    console.log(`hotMiddleware`, hotMiddleware)
    // 此时可以使用 hotMiddleware.origin 调用 .publish方法 使浏览器重启
    hotMiddleware.origin.publish({ action: 'reload' })
    cb()
  })
})
```

## Install by yarn

```sh
$ yarn add --dev koa2-webpack-middleware-plus
```

## Depends

This middleware designd for koa2 ecosystem, make sure installed the right version:

```sh
yarn add --dev koa
```

## Usage

> See [example/](./example/) for an example of usage.

```js
import webpack from 'webpack'
import { devMiddleware, hotMiddleware } from 'koa2-webpack-middleware-plus'
import devConfig from './webpack.config.dev'
const compile = webpack(devConfig)
app.use(devMiddleware(compile, {
    // display no info to console (only warnings and errors)
    noInfo: false,

    // display nothing to the console
    quiet: false,

    // switch into lazy mode
    // that means no watching, but recompilation on every request
    lazy: true,

    // watch options (only lazy: false)
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },

    // public path to bind the middleware to
    // use the same as in webpack
    publicPath: "/assets/",

    // custom headers
    headers: { "X-Custom-Header": "yes" },

    // options for formating the statistics
    stats: {
        colors: true
    }
}))
app.use(hotMiddleware(compile, {
  // log: console.log,
  // path: '/__webpack_hmr',
  // heartbeat: 10 * 1000
}))
```

## HMR configure

1. webpack `plugins` configure

    ```js
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
    ```
2. webpack `entry` configure

    ```sh
    $ npm i eventsource-polyfill -D
    ```

    ```js
    entry: {
      'index': [
        // For old browsers
        'eventsource-polyfill',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        'index.js']
    },
    ```

3. webpack `loader` configure

    ```sh
    $ npm i babel-preset-es2015 babel-preset-stage-0 -D
    ```

    ```js
    {
      test: /\.js$/,
      loader: 'babel',
      query: {
        'presets': ['es2015', 'stage-0']
        }
      },
      include: './src'
    }
    ```

    > HMR for react project

    ```sh
    $ npm i babel-preset-react babel-preset-react-hmre -D
    ```

    ```js
    {
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        'presets': ['es2015', 'stage-0', 'react'],
        'env': {
          'development': {
            'presets': ['react-hmre']
          }
        }
      },
      include: './src'
    }
    ```

4. put the code in your entry file to enable HMR

    > React project do not need

    ```js
    if (module.hot) {
      module.hot.accept()
    }
    ```

That's all, you're all set!

