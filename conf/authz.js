
import jwt from 'jsonwebtoken'

import * as verifer from './verifier.js'

function authz() {


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


        }
        catch (e) {




        }

        if (verified == false) {

            try {



                await verifer.validate(token, 'net-inc')

            }
            catch (e) {



                ctx.throw('401', 'Invalid Request')


            }
        }


















        await next();
    };
}




export { authz }