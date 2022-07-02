import Router from '@koa/router'
import { k8sApi } from '../conf/k8s.js'
import * as  got from 'got';
import { v4 as uuidv4 } from 'uuid';
const appRouter = new Router({ prefix: '/app' })
import { v1 } from '@authzed/authzed-node';
import { graphqlClient } from '../client/graphql.js';
import * as jsonSchema from 'jsonschema'
import { randomUUID } from 'crypto';
import { system, client } from '../conf/env.js';
import jwt from 'jsonwebtoken';
var Validator = jsonSchema.Validator;
var v = new Validator();



function transformSchema(x) {

    return ({
        app_id: x.app_id,
        created_at: x.created_at,
        updated_at: x.app_versions[0].created_at,
        configuration: {
            scale: {

                max: x.app_versions[0].configuration.spec.template.metadata.annotations["autoscaling.knative.dev/max-scale"],
                min: x.app_versions[0].configuration.spec.template.metadata.annotations["autoscaling.knative.dev/min-scale"]
            },
            timeout: x.app_versions[0].configuration.spec.template.spec.timeoutSeconds,
            concurrency: x.app_versions[0].configuration.spec.template.spec.containerConcurrency,
            container: {
                "image": x.app_versions[0].configuration.spec.template.spec.containers[0].image,
                "env": [],
                "ports": x.app_versions[0].configuration.spec.template.spec.containers[0].ports.map(x => { return ({ port: x.containerPort, protocol: x.name }) })
            }
            ,
            "limits": {

                "cpu": x.app_versions[0].configuration.spec.template.spec.containers[0].resources.limits.cpu,
                "ram": x.app_versions[0].configuration.spec.template.spec.containers[0].resources.limits.memory,
            }
        },




    })

}


// Address, to be embedded on Person
var schema = {
    "id": "/app",
    "type": "object",
    "properties": {
        "projectId": { "type": "string" },
        "name": { "type": "string" },
        "scale": {
            "type": "object",
            "properties": {
                "max": { "type": "integer", "minimum": 1 },
                "min": { "type": "integer", "minimum": 0 },
            }
        },

        "timeout": { "type": "integer", "minimum": 1 },
        "concurrency": { "type": "integer", "minimum": 1 },
        "container": {
            "type": "object",
            "properties": {
                "image": { "type": "string" },
                "env": {
                    "type": "array",
                    "properties": {
                        "key": { "type": "string" },
                        "value": { "type": "string" }
                    }
                },
                "ports": {
                    "type": "array",
                    "properties": {
                        "protocol": { "type": "string" },
                        "port": { "type": "integer", "minimum": 1 },
                    },
                    "required": ["port", "protocol"]
                }
                ,
                "limits": {
                    "type": "object",
                    "properties": {
                        // "cpu": `${cpu}m`,
                        // "memory": `${ram}Mi`
                        "cpu": { "type": "integer", "minimum": 100 },
                        "ram": { "type": "integer", "minimum": 100 },
                    }

                }

            },
            "required": ["image", "limits", "ports", "env"]
        },


    },
    "required": ["name", "projectId"]
};





















appRouter.post('/create', async (ctx, next) => {


    const req = ctx.request

    const body = req.body

    console.log(JSON.stringify(req.body))
    console.log(req.body)
    const val = v.validate(body, schema)
    if (val.valid != true) {

        ctx.throw('401', "Invalid request schema")
    }

    const appId = body.name;



    const versionId = uuidv4();









    const ports = body.container.ports.map(value => {
        return ({
            "name": value.protocol,
            "containerPort": parseInt(value.port)
        })
    })
    var deployment = {
        "apiVersion": "serving.knative.dev/v1",
        "kind": "Service",
        "metadata": {
            "name": body.name,
            "namespace": "default",
        },
        "spec": {
            "template": {
                "metadata": {
                    "annotations": {
                        "autoscaling.knative.dev/max-scale": body.scale.max.toString(),
                        "autoscaling.knative.dev/min-scale": body.scale.min.toString(),
                        "app.coplane.co/project-id": body.projectId
                    }
                },
                "spec": {
                    "timeoutSeconds": body.timeout,
                    "containerConcurrency": body.concurrency,
                    "containers": [
                        {
                            "image": body.container.image,
                            "env": body.container.env,
                            "ports": ports,
                            "resources": {
                                "limits": {
                                    "cpu": `${body.container.limits.cpu}m`,
                                    "memory": `${body.container.limits.ram}Mi`
                                }
                            }
                        }
                    ]
                }
            }
        }
    };






    await graphqlClient.request(`
        mutation($conf: jsonb){
            insert_apps_one(object:{app_id:"${appId}",app_version_id:"${versionId}"}){
              app_id
              id
              created_at
            }
            insert_app_versions_one(object:{app_id:"${appId}", id:"${versionId}",configuration:$conf}){
              app_id
            }
          }
    `, {
        "conf": deployment
    })




    const relationshipRequest = v1.WriteRelationshipsRequest.create({
        updates: [v1.RelationshipUpdate.create({
            operation: v1.RelationshipUpdate_Operation.CREATE,
            relationship: v1.Relationship.create({
                resource: v1.ObjectReference.create({
                    objectType: system + "app",
                    objectId: appId,
                }),
                relation: "project",
                subject: v1.SubjectReference.create({
                    object: v1.ObjectReference.create({
                        objectType: system + "project",
                        objectId: body.projectId
                    })
                })
            })
        })],
    });


    await new Promise((resolve, reject) => {
        client.writeRelationships(relationshipRequest, (err, response) => {
            console.log(response);
            console.log(err);
            if (err == null) {
                resolve(response)
            } else {
                ctx.throw('401', err)
            }
        });
    })




    try {
        await k8sApi.createNamespacedCustomObject("serving.knative.dev", "v1", "default", "services", deployment);
    }
    catch (e) {
        console.log(e)
        ctx.status = 409
        ctx.body = JSON.stringify(e)
    }

    //use this in '/update'
    //
    //     const id = uuidv4();
    //     const proj = await graphqlClient.request(`
    //     mutation{
    //         update_apps_by_pk(_set:{app_version_id:"${id}",},pk_columns:{app_id:"${appId}"}){
    //           app_id
    //           id
    //           created_at
    //         }
    //         insert_app_versions_one(object:{app_id:"${appId}",configuration:"${JSON.stringify(deployment)}",id:"${id}"}){
    //           app_id
    //         }
    //       }
    // `)



    ctx.status = 200
    ctx.body = 'ok'
})




















appRouter.get('/list', async function (ctx, next) {
    const query = ctx.request.query
    var decoded = jwt.decode(ctx.get('Authorization').substring(7))
    const stream = client.lookupResources(v1.LookupResourcesRequest.create({
        permission: 'edit',
        resourceObjectType: system + 'app',
        subject: v1.SubjectReference.create({
            object: v1.ObjectReference.create({
                objectId: decoded.entity_id,
                objectType: system + 'user'
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




    const stream1 = client.readRelationships(v1.ReadRelationshipsRequest.create({

        relationshipFilter: v1.RelationshipFilter.create({
            resourceType: system + 'app',


            optionalSubjectFilter: v1.SubjectFilter.create({
                optionalSubjectId: query.projectId,
                subjectType: system + 'project',

            })
        })
    }))



    var data1 = await new Promise((resolve, reject) => {
        const dataArray = []
        console.log(dataArray)
        stream1.on('data', function (data) {
            console.log(data)
            console.log(dataArray)
            dataArray.push(data)
        })
        stream1.on('end', function (data) {
            resolve(dataArray)
        })
    }
    )


    data = data.map(x => x.resourceObjectId)

    data1 = data1.map(x => x.relationship.resource.objectId)


    var filteredData = data.filter(value => data1.includes(value));

    filteredData = filteredData.map(x => `{ app_id:  { _eq: "${x}" }}`)



    var q = ''
    filteredData.forEach((d) => {

        q = q + d + ','
    })

    var apps = await graphqlClient.request(`
        query {
           


            apps(where:{_or:[${q}]}){
                app_id
              created_at
              app_versions(order_by:{created_at:desc},limit:1){
              configuration
              created_at
            }
              }
          }
    `)



    apps = apps.apps.map(x => {

        return transformSchema(x)
    })


    ctx.body = JSON.stringify(apps)
    ctx.status = 200

})





appRouter.get('/get', async function (ctx, next) {
    const query = ctx.request.query
    var decoded = jwt.decode(ctx.get('Authorization').substring(7))

    const checkPermissionRequest = v1.CheckPermissionRequest.create({
        resource: v1.ObjectReference.create({
            objectId: query.appId,
            objectType: 'coplanedev/app'
        }),
        permission: "edit",
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


    if (res.permissionship != 2) {
        ctx.throw('401', 'Unauthorized request')
    }



    var app = await graphqlClient.request(`
        query {
           


            apps(where:{app_id:  { _eq: "${query.appId}" }}){
                app_id
                created_at
                app_versions(order_by:{created_at:desc},limit:1){
              configuration
              created_at
              
            }
              }
          }
    `)



    app = transformSchema(app.apps[0])




    ctx.body = JSON.stringify(app)
    ctx.status = 200

})






appRouter.get('/deployments', async function (ctx, next) {
    const query = ctx.request.query
    var decoded = jwt.decode(ctx.get('Authorization').substring(7))

    const checkPermissionRequest = v1.CheckPermissionRequest.create({
        resource: v1.ObjectReference.create({
            objectId: query.appId,
            objectType: 'coplanedev/app'
        }),
        permission: "edit",
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


    if (res.permissionship != 2) {
        ctx.throw('401', 'Unauthorized request')
    }



    var app = await graphqlClient.request(`
        query {
           
 apps(where:{app_id:  { _eq: "${query.appId}" }}){
                app_versions{
                    id
              configuration
              created_at
              
            }
              }
          }
    `)




    app = app.apps[0].app_versions.map(x => {

        return ({
            created_at: x.created_at,
            deployment_id: x.id,
            configuration: {
                scale: {

                    max: x.configuration.spec.template.metadata.annotations["autoscaling.knative.dev/max-scale"],
                    min: x.configuration.spec.template.metadata.annotations["autoscaling.knative.dev/min-scale"]
                },
                timeout: x.configuration.spec.template.spec.timeoutSeconds,
                concurrency: x.configuration.spec.template.spec.containerConcurrency,
                container: {
                    "image": x.configuration.spec.template.spec.containers[0].image,
                    "env": [],
                    "ports": x.configuration.spec.template.spec.containers[0].ports.map(x => { return ({ port: x.containerPort, protocol: x.name }) })
                }
                ,
                "limits": {

                    "cpu": x.configuration.spec.template.spec.containers[0].resources.limits.cpu,
                    "ram": x.configuration.spec.template.spec.containers[0].resources.limits.memory,
                }
            },




        })
    })



    ctx.body = JSON.stringify(app)
    ctx.status = 200

})


export default appRouter