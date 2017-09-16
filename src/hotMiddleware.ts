import * as  webpackHotMiddleware from 'webpack-hot-middleware'
import { PassThrough } from 'stream'

export const hotMiddleware = (compiler, opts) => {
  const expressMiddleware = webpackHotMiddleware(compiler, opts)
  async function middleware(ctx, next) {
    let stream = new PassThrough()
    ctx.body = stream
    await expressMiddleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (status, headers) => {
        ctx.status = status
        ctx.set(headers)
      }
    }, next)
  }
  const mw: any = middleware
  //解决无法获取到原始 hot-middleWare对象问题
  mw.origin = expressMiddleware
  return middleware
}
