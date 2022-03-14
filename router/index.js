import Router from '@koa/router'
const router = new Router()


router.get('/', (ctx, next) => {
    ctx.body = 'hello koa'
})


router.get('/user', function (ctx, next) {
    ctx.body = 'hello koa /user'
})




export default router;

