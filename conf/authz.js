
import jwt from 'jsonwebtoken'

import * as verifer from './verifier.js'








import { createLogger, transports } from "winston";
import LokiTransport from "winston-loki";





const options = {

    transports: [
        new LokiTransport({
            host: "https://loki.corp.coplane.co",
            json: true,
            basicAuth: '698295:GJhf39H12KjdwbHhFj179gPnwd139nH3K1h5GJhv13hs92gubfdKbwfh3ydbnK3G3dji9Fdn',

        })
    ]
};









const log = createLogger(options);




function logging({ entityId, entityType, url }) {
    log.log('info', { url: url, entityId: entityId, entityType: entityType, });
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

        logging({ entityId, entityType, url });


        await next();
    };
}




export { authz }