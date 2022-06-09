
import Koa from 'koa';

import cors from '@koa/cors'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import bodyParser from 'koa-bodyparser';
import router from './router/index.js';
import userRouter from './router/deployment.js';
import appRouter from './router/app.js';
import projectRouter from './router/project.js';
import metricsRouter from './router/metrics.js';

import jwt from 'jsonwebtoken'

import * as verifer from './auth/verifier.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);








function auth(format) {


    return async function (ctx, next) {
        var token;
        try {
            token = ctx.get('Authorization').substring(7)
        } catch (e) {

            ctx.status = 401
            ctx.body = 'Invalid token'
        }

        if (token == null) {
            ctx.status = 401
            ctx.body = 'Invalid token'

        }

        var verified;
        try {



            jwt.verify(token, 'wzkuU2qQrbYHVNnBI2s759j57LRzJAr5')
            verified = true
        }
        catch (e) {




        }

        if (verified != true) {

            try {



                await verifer.validate(token, 'net-inc')
            }
            catch (e) {




                ctx.status = 401
                ctx.body = 'Invalid token'


            }
        }





















        await next();
    };
}








const app = new Koa()






app.use(cors(
    //     {
    //     origin: '*',
    //     credentials: true,
    // }
));





app.use(bodyParser())





app.use(projectRouter.routes(), projectRouter.allowedMethods())


app.use(appRouter.routes(), appRouter.allowedMethods())
app.use(router.routes(), router.allowedMethods())

app.use(userRouter.routes(), userRouter.allowedMethods())



app.use(metricsRouter.routes(), metricsRouter.allowedMethods())



app.listen(5000, () => {
    console.log(`koa server is running at http://localhost:5000`)
})






