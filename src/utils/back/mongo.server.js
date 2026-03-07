// @/utils/back/mongo.server.js

// import "server-only"; // lo desactivamos xa q fun tb en testing
import { MongoClient }                 from "mongodb";
import { fun2_env }                    from "./mod_auxi.js"


let clientPromise;

if (process.env.NODE_ENV === undefined) { // stdalone (chk)
  const uri                         = await fun2_env("MONGODB_URI");
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  const client     = new MongoClient(uri);
  clientPromise    = client.connect();



} else { // in API

  const uri = process.env.MONGODB_URI;

  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  let client;

  if (process.env.NODE_ENV === "development") { // dev

    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;


  } else { // prod
    client        = new MongoClient(uri);
    clientPromise = client.connect();

  }//endif dev

} //endif testing

export default clientPromise;
