const server = true;



const userToken = server ? '{ "type": "RS256", "issuer": "https://securetoken.google.com/net-inc", "jwk_url": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com", "audience": "net-inc"}' : 'wzkuU2qQrbYHVNnBI2s759j57LRzJAr5'



export { userToken }