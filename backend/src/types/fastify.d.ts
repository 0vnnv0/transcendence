import 'fastify';

//this file is for modifying the fastify request type to explicitly take and give user properties

// defining strict JWT payload structure
export interface CustomJWTPayload {
  id: number;
  intraName: string;
  // we can add whatever we want here
}

// adds custom elements to fastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user: CustomJWTPayload;
  }
}

//this adds it to the jwt module
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: CustomJWTPayload;
    user: CustomJWTPayload;
  }
}