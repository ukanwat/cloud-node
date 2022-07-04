
import jwt from 'jsonwebtoken'

import * as verifer from './verifier.js'



import { checkProjectPermission } from '../functions/spicedb.js';




import { createLogger, format, transports } from "winston";
import LokiTransport from "winston-loki";





function logging({ entityId, entityType, url, request, projectId }) {



    // const { combine, timestamp, label, printf, prettyPrint } = format;


    const options = {
        // format: combine(
        //     label({ label: 'right meow!' }),
        //     timestamp(),
        //     prettyPrint()
        //   ),

        transports: [
            new LokiTransport({
                host: "https://loki.corp.coplane.co",
                json: true,
                basicAuth: '698295:GJhf39H12KjdwbHhFj179gPnwd139nH3K1h5GJhv13hs92gubfdKbwfh3ydbnK3G3dji9Fdn',
                labels: { job: 'node-server', entity_id: entityId, entity_type: entityType, project_id: projectId }

            })
        ]
    };





    const log = createLogger(options);

    log.log('info', { url: url, entity_id: entityId, entity_type: entityType, request: request });
}



function authz() {
    var entityId;
    var entityType;

    return async function (ctx, next) {
        var token;
        try {
            token = ctx.get('Authorization').substring(7)
        } catch (e) {

            ctx.throw('401', 'Invalid Request')
        }

        if (token == null) {
            ctx.throw('401', 'Invalid Request')

        }

        var verified = false;



        try {
            const verify =

                jwt.verify(token, 'wzkuU2qQrbYHVNnBI2s759j57LRzJAr5', { algorithms: ['RS256'] }, function (err, payload) {

                })

            verified = true

            var decoded = jwt.decode(token)
            entityId = decoded.entityId
            entityType = 'service'

        }
        catch (e) {




        }

        if (verified == false) {

            try {



                await verifer.validate(token, 'net-inc')

                var decoded = jwt.decode(token)
                entityId = decoded.entityId
                entityType = 'user'


            }
            catch (e) {



                ctx.throw('401', 'Invalid Request')


            }
        }













        const url = ctx.request.url
        const request = ctx.request








        const projectId = request.body.projectId ?? request.query.projectId ?? 'null'





        //check permission
        if (projectId != 'null' && false) {
            const permission = await checkProjectPermission(ctx, projectId)
        }

        logging({ entityId, entityType, url, request, projectId });


        await next();
    };
}







function logs() {


    return async function (ctx, next) {

        const url = ctx.request.url
        const request = ctx.request



        const projectId = request.body.projectId ?? request.query.projectId ?? 'null'


        logging({ entityId, entityType, url, request, projectId });


        await next();
    };
}




export { authz }