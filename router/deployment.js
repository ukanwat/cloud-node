import Router from '@koa/router'
import { k8sApi } from '../conf/k8s.js'
import * as  got from 'got';
const router = new Router({ prefix: '/deployment' })

router.post('/create', async (ctx, next) => {


    const req = ctx.request
    const defMaxScale = 10;
    const defMinScale = 0;
    const defEnv = [];
    const defRam = 512;
    const defCpu = 500;
    const defPort = 8080;
    const defH2c = false;
    const defTimeout = 600;





    const body = req.body


    const name = body.name ?? "test"
    const image = body.image ?? 'docker.io/_/hello-world'
    const env = body.env ?? defEnv
    const team_id = body.team_id
    const max_scale = body.max_instances ?? defMaxScale
    const min_scale = body.min_instances ?? defMinScale
    const ram = body.ram ?? defRam
    const cpu = body.cpu ?? defCpu
    const h2c = body.http2 ?? defH2c
    const port = body.port ?? defPort
    const concurrency = body.concurrency ?? 100
    const timeoutSeconds = body.timeout ?? defTimeout









    var deployment = {
        "apiVersion": "serving.knative.dev/v1",
        "kind": "Service",
        "metadata": {
            "name": name,
            "namespace": "default",
        },
        "spec": {
            "template": {
                "metadata": {
                    "annotations": {
                        "autoscaling.knative.dev/max-scale": max_scale.toString(),
                        "autoscaling.knative.dev/min-scale": min_scale.toString()
                    }
                },
                "spec": {
                    "timeoutSeconds": timeoutSeconds,
                    "containerConcurrency": concurrency,
                    "containers": [
                        {
                            "image": image,
                            "env": env,
                            "ports": [
                                {
                                    "name": h2c ? "h2c" : "http1",
                                    "containerPort": port
                                }
                            ],
                            "resources": {
                                "limits": {
                                    "cpu": `${cpu}m`,
                                    "memory": `${ram}Mi`
                                }
                            }
                        }
                    ]
                }
            }
        }
    };
    try {
        await k8sApi.createNamespacedCustomObject("serving.knative.dev", "v1", "default", "services", deployment);
    }
    catch (e) {
        ctx.status = 409
        ctx.body = JSON.stringify(e)
    }


    try {
        await got.default.post('https://graphqlapi.netinc.io/api/rest/service/create', {
            body: JSON.stringify({
                'name': name, 'team_id': team_id, 'image': image, 'env': JSON.stringify(env), 'max_scale': max_scale,
                'ram': ram, 'cpu': cpu, 'h2c': h2c, 'port': port,
                'min_scale': min_scale, 'timeout': timeoutSeconds, 'concurrency': concurrency
            }),
            headers: {
                'Content-Type': 'application/json', 'x-hasura-admin-secret': 'Tay13Utk12'
            },
        }).json();
    }
    catch (e) {
        ctx.status = 409
        ctx.body = JSON.stringify(e)
    }


    ctx.status = 200
    ctx.body = 'ok'
})


export default router