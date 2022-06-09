import Router from '@koa/router'
import { v1 } from '@authzed/authzed-node';



const projectRouter = new Router({ prefix: '/project' })



const client = v1.NewClient('Tc_coplanedev_default_token_1b16666f23867c5c66711dc709d877dc9e4e5b0a8567fd2c6fd69b4b7eb26262f599ef754866c0448f046ee8bcf110249fe75b65c7866d608db89e0fb759ce23', "grpc.authzed.com:443")
// Tc_coplanedev_default_token_1b16666f23867c5c66711dc709d877dc9e4e5b0a8567fd2c6fd69b4b7eb26262f599ef754866c0448f046ee8bcf110249fe75b65c7866d608db89e0fb759ce23

// Coplane (production) -
// tc_coplane_default_token_8206b2bd06170275d60b91c1d6c2f99a0daf4c0b8bec57c43eacd009c0c750e9ef5ab9130fd1ddf7ae7a83ee21e18a0e5d3084d7e3da2bde66e3d9954f5094c9


// Create the relationship between the resource and the user.
// const firstPost = v1.ObjectReference.create({
//     objectType: "blog/post",
//     objectId: "1",
// });

// // Create the user reference.
// const emilia = v1.ObjectReference.create({
//     objectType: "blog/user",
//     objectId: "emilia",
// });

// const subject = v1.SubjectReference.create({
//     object: userref,
// });

// const checkPermissionRequest = v1.CheckPermissionRequest.create({
//     resource: firstPost,
//     permission: "read",
//     subject,
// });

// client.checkPermission(checkPermissionRequest, (err, response) => {
//     console.log(response);
//     console.log(err);
// });


const system = "coplanedev/"

projectRouter.post('/create', async function (ctx, next) {






    const relationshipRequest = v1.WriteRelationshipsRequest.create({
        updates: v1.RelationshipUpdate.create({
            operation: v1.RelationshipUpdate_Operation.TOUCH,
            relationship: v1.Relationship.create({
                resource: v1.ObjectReference.create({
                    objectType: system + "project",
                    objectId: "456e45",
                }),
                relation: "owner",
                subject: v1.SubjectReference.create({
                    object: v1.ObjectReference.create({
                        objectType: system + "user",
                        objectId: "123egf",
                    })
                })
            })
        })




    });

    client.writeRelationships(relationshipRequest, (err, response) => {
        console.log(response);
        console.log(err);
        if (err == null) {
            ctx.status = 200
            ctx.body = JSON.stringify(response)
        } {
            ctx.status = 409
            ctx.body = JSON.stringify(err)
        }

    });



})


export default projectRouter