import Router from '@koa/router'
const router = new Router()


router.get('/', (ctx, next) => {
    ctx.body = 'v1'
})



router.get('/user', function (ctx, next) {
    ctx.body = ''
})




export default router;

