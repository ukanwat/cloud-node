
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


import * as auth from './conf/authz.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);














const app = new Koa()




app.use(cors(
));








app.use(bodyParser())



app.use(auth.authz());


app.use(projectRouter.routes(), projectRouter.allowedMethods())


app.use(appRouter.routes(), appRouter.allowedMethods())
app.use(router.routes(), router.allowedMethods())

app.use(userRouter.routes(), userRouter.allowedMethods())



app.use(metricsRouter.routes(), metricsRouter.allowedMethods())



app.listen(5000, () => {
    console.log(`koa server is running at http://localhost:5000`)
})






