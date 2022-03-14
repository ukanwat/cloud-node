
import Koa from 'koa';

import cors from '@koa/cors'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import bodyParser from 'koa-bodyparser';
import router from './router/index.js';
import userRouter from './router/deployment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Koa()



app.use(bodyParser())

app.use(cors());


app.use(router.routes(), router.allowedMethods())

app.use(userRouter.routes(), userRouter.allowedMethods())



app.listen(3000, () => {
    console.log(`koa server is running at http://localhost:3000`)
})