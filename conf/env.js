import { v1 } from '@authzed/authzed-node';

import { ClientSecurity } from '@authzed/authzed-node/dist/src/util.js';

const server = true;



const userToken = server ? '{ "type": "RS256", "issuer": "https://securetoken.google.com/net-inc", "jwk_url": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com", "audience": "net-inc"}' : 'wzkuU2qQrbYHVNnBI2s759j57LRzJAr5'

const system = "coplanedev/"

const client = v1.NewClient('Tc_coplanedev_default_token_1b16666f23867c5c66711dc709d877dc9e4e5b0a8567fd2c6fd69b4b7eb26262f599ef754866c0448f046ee8bcf110249fe75b65c7866d608db89e0fb759ce23'
    , "grpc.authzed.com", ClientSecurity.SECURE
)

export { userToken, system, client }