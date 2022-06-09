import Router from '@koa/router'
import { k8sApi } from '../conf/k8s.js'
import * as  got from 'got';
import client from 'prom-client'
const router = new Router({ prefix: '/metrics' })

router.post('/', async (ctx, next) => {



    ctx.status = 200
    ctx.body = 'okay'
})


export default router