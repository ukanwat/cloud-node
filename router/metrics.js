import Router from '@koa/router'
import { k8sApi } from '../conf/k8s.js'
import * as  got from 'got';
import client from 'prom-client'
const router = new Router({ prefix: '/metrics' })

router.post('/series', async (ctx, next) => {


    var body = ctx.request.body


    const post = await got.got.post('https://vmselect.corp.coplane.co/select/0/prometheus/api/v1/query_range', {



        form: {
            query: `${body.type}{configuration_name=\"${body.name}\"}`,
            start: body?.start ?? "2022-06-22T18:10:30.781Z",
            stop: body?.end ?? Date(Date.now()),
            step: body?.step ?? "15s"
        },

        headers: {
            "Authorization": "Basic " + Buffer.from("109423" + ":" + "de1bEFG4fKn35HAJDSbC4Hf7XhB02JeO7vF3DRw7YhDCF9hSdH23u6b0dwb31yd6g8e3y2yqwd").toString('base64'),
            "Type": "application/x-www-form-urlencoded"
        }

    }).json()


    ctx.status = 200
    ctx.body = JSON.stringify(post.data.result.length == 0 ? [] : post.data.result[0].values)
})


export default router