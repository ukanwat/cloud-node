import Router from '@koa/router'
import { v1 } from '@authzed/authzed-node';

import { client as graphqlClient } from '../client/graphql.js';
import { ClientSecurity } from '@authzed/authzed-node/dist/src/util.js';
import * as env from '../conf/env.js'
import jwt from 'jsonwebtoken';
import { checkProjectPermission } from '../functions/spicedb.js';
const projectRouter = new Router({ prefix: '/project' })



const client = v1.NewClient('Tc_coplanedev_default_token_1b16666f23867c5c66711dc709d877dc9e4e5b0a8567fd2c6fd69b4b7eb26262f599ef754866c0448f046ee8bcf110249fe75b65c7866d608db89e0fb759ce23'
    , "grpc.authzed.com", ClientSecurity.SECURE
)
// Tc_coplanedev_default_token_1b16666f23867c5c66711dc709d877dc9e4e5b0a8567fd2c6fd69b4b7eb26262f599ef754866c0448f046ee8bcf110249fe75b65c7866d608db89e0fb759ce23

// Coplane (production) -
// tc_coplane_default_token_8206b2bd06170275d60b91c1d6c2f99a0daf4c0b8bec57c43eacd009c0c750e9ef5ab9130fd1ddf7ae7a83ee21e18a0e5d3084d7e3da2bde66e3d9954f5094c9



const system = "coplanedev/"

projectRouter.post('/create', async function (ctx, next) {
    const body = ctx.request.body
    var decoded = jwt.decode(ctx.get('Authorization').substring(7))




    if (body.projectName == null) {


        ctx.throw('401', 'Invalid Request')
    }


    const proj = await graphqlClient.request(`
    mutation{
  insert_projects_one(object:{project_name:"${body.projectName}"}){
    __typename
    project_id
    updated_at
  }
}
`)



    const relationshipRequest = v1.WriteRelationshipsRequest.create({
        updates: [v1.RelationshipUpdate.create({
            operation: v1.RelationshipUpdate_Operation.CREATE,
            relationship: v1.Relationship.create({
                resource: v1.ObjectReference.create({
                    objectType: system + "project",
                    objectId: proj.insert_projects_one.project_id,
                }),
                relation: "owner",
                subject: v1.SubjectReference.create({
                    object: v1.ObjectReference.create({
                        objectType: system + "user",
                        objectId: decoded.entity_id
                        ,
                    })
                })
            })
        })],




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



projectRouter.get('/check', async function (ctx, next) {
    const body = ctx.request.body
    const permission = await checkProjectPermission(ctx, body.projectId)
    ctx.body = permission
    ctx.status = 200
})





projectRouter.get('/list', async function (ctx, next) {
    const body = ctx.request.body
    client.readRelationships(v1.ReadRelationshipsRequest.create({
        relationshipFilter: v1.RelationshipFilter.create({
            resourceType: system + 'project',
            optionalRelation: 'owner',
            optionalSubjectFilter: v1.SubjectFilter.create({
                optionalSubjectId: body.userId
            })
        })
    }))
    ctx.body = permission
    ctx.status = 200
})


export default projectRouter