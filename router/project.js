import Router from '@koa/router'
import { v1 } from '@authzed/authzed-node';

import { graphqlClient as graphqlClient } from '../client/graphql.js';
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
    var data = await new Promise((resolve, reject) => {
        client.writeRelationships(relationshipRequest, (err, response) => {
            console.log(response);
            console.log(err);
            if (err == null) {
                resolve(response)
            } {
                ctx.throw('401', 'Invalid Request')
            }
        });
    })
    ctx.body = data
    ctx.status = 200

})



projectRouter.get('/check', async function (ctx, next) {
    const body = ctx.request.body
    const permission = await checkProjectPermission(ctx, body.projectId)
    ctx.body = permission
    ctx.status = 200
})





projectRouter.get('/list', async function (ctx, next) {
    const body = ctx.request.body
    var decoded = jwt.decode(ctx.get('Authorization').substring(7))
    const stream = client.readRelationships(v1.ReadRelationshipsRequest.create({

        relationshipFilter: v1.RelationshipFilter.create({
            resourceType: system + 'project',
            // optionalRelation: 'owner',

            optionalSubjectFilter: v1.SubjectFilter.create({
                optionalSubjectId: decoded.entity_id,
                subjectType: system + 'user',

            })
        })
    }))



    var data = await new Promise((resolve, reject) => {

        const dataArray = []
        console.log(dataArray)
        stream.on('data', function (data) {

            console.log(data)
            console.log(dataArray)
            dataArray.push(data)





        })



        stream.on('end', function (data) {



            resolve(dataArray)


        })
    }

    )

    data = data.map(x => `{ project_id:  { _eq: "${x.relationship.resource.objectId}" }}`)



    var q = ''
    data.forEach((d) => {

        q = q + d + ','
    })

    const projects = await graphqlClient.request(`
    query {
        projects(where:{_or:[${q}]}){
          project_id
         project_name
         created_at
        }
      }
      
`)


    ctx.body = JSON.stringify(projects.projects)
    ctx.status = 200

})








projectRouter.get('/members', async function (ctx, next) {
    const body = ctx.request.body
    var decoded = jwt.decode(ctx.get('Authorization').substring(7))


    var data = await new Promise((resolve, reject) =>


        client.expandPermissionTree(v1.ExpandPermissionTreeRequest.create({
            permission: 'owner',
            resource: v1.ObjectReference.create({ objectId: ctx.request.query.projectId, objectType: system + 'project' })
        }),

            (err, response) => {
                console.log(response);
                console.log(err);
                if (err == null) {
                    resolve(response)
                } {
                    ctx.status = 409
                    reject(err)
                }



            })
    )
















    data = data.treeRoot.treeType.leaf.subjects;

    data = data.map(x => `{ user_id:  { _eq: "${x.object.objectId}" }}`)



    var q = ''
    data.forEach((d) => {

        q = q + d + ','
    })

    const users = await graphqlClient.request(`
    query {
        users(where:{_or:[${q}]}){
            username
            user_id
            photo_url
            name
            joined_at
            email
        }
      }
      
`)

    ctx.body = JSON.stringify(users.users)
    ctx.status = 200
})





// Permission tree
// const data = await new Promise((resolve, reject) =>


// client.expandPermissionTree(v1.ExpandPermissionTreeRequest.create({
//     permission: 'owner',
//     resource: v1.ObjectReference.create({ objectId: decoded.entity_id, objectType: system + 'user' })
// }),

//     (err, response) => {
//         console.log(response);
//         console.log(err);
//         if (err == null) {
//             resolve(response)
//         } {
//             ctx.status = 409
//             reject(err)
//         }



//     })
// )

export default projectRouter