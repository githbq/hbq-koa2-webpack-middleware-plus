import * as  webpackDevMiddleware from 'webpack-dev-middleware'

export const devMiddleware = (compiler, opts) => {
  const expressMiddleware = webpackDevMiddleware(compiler, opts)
  async function middleware(ctx, next) {
    await expressMiddleware(ctx.req, {
      end: (content) => {
        ctx.body = content
      },
      setHeader: (name, value) => {
        ctx.set(name, value)
      }
    }, next)
  }
  const mw: any = middleware
  //解决无法获取到原始 dev-middleWare对象问题
  mw.origin = expressMiddleware
  // mw.getFilenameFromUrl = expressMiddleware.getFilenameFromUrl
  // mw.waitUntilValid = expressMiddleware.waitUntilValid
  // mw.invalidate = expressMiddleware.invalidate
  // mw.close = expressMiddleware.close
  // mw.fileSystem = expressMiddleware.fileSystem
  return middleware
}
