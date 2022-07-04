import Router from '@koa/router'
import { k8sApi } from '../conf/k8s.js'
import * as  got from 'got';
import { Console } from 'console';
const router = new Router({ prefix: '/logs' })

router.post('/series', async (ctx, next) => {


    var body = ctx.request.body


    const post = await got.got.get(`https://loki.corp.coplane.co/loki/api/v1/query_range?query={serving_knative_dev_service=\"${body.name}\"}|json|line_format"{{.log}}"|stream="stdout"`
        // +`&start=${body?.start ?? ""}` + 
        // `&end=${body?.end ?? Date.now().toString()}`
        , {




            headers: {
                "Authorization": "Basic " + Buffer.from("698295" + ":" + "GJhf39H12KjdwbHhFj179gPnwd139nH3K1h5GJhv13hs92gubfdKbwfh3ydbnK3G3dji9Fdn").toString('base64'),
                // "Type": "application/x-www-form-urlencoded"
            }

        }).json()

    const logs = post.data.result.map((e) => { return (e.values[0]) })
    ctx.status = 200
    ctx.body = JSON.stringify(post.data.result.length == 0 ? [] : logs)
})


export default router