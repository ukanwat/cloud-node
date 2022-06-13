
import { v1 } from '@authzed/authzed-node';


import { ClientSecurity } from '@authzed/authzed-node/dist/src/util.js';
import jwt from 'jsonwebtoken'

const client = v1.NewClient('Tc_coplanedev_default_token_1b16666f23867c5c66711dc709d877dc9e4e5b0a8567fd2c6fd69b4b7eb26262f599ef754866c0448f046ee8bcf110249fe75b65c7866d608db89e0fb759ce23'
    , "grpc.authzed.com", ClientSecurity.SECURE
)



async function checkProjectPermission(ctx, projId) {






    var decoded = jwt.decode(ctx.get('Authorization').substring(7))
    console.log(projId)
    const checkPermissionRequest = v1.CheckPermissionRequest.create({
        resource: v1.ObjectReference.create({
            objectId: projId,
            objectType: 'coplanedev/project'
        }),
        permission: "owner",
        subject: v1.SubjectReference.create({
            object: v1.ObjectReference.create({
                objectId: decoded.entity_id,
                objectType: 'coplanedev/user'
            })
        }),
    });



    let promise = new Promise((resolve, reject) =>

        client.checkPermission(checkPermissionRequest, (err, response) => {
            if (err) {
                return reject(err)
            }
            resolve(response)
        }))



    const res = await promise
    if (res.permissionship == 2) {
        return true
    } else {
        false
    }

}
export { checkProjectPermission }