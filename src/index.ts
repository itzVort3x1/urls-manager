import { connect } from "@planetscale/database";
import { createYoga, createSchema } from "graphql-yoga";
import { schemaWithPermissions } from "./schema";

const yoga = createYoga({
	graphqlEndpoint: "/",
	schema: schemaWithPermissions,
});

// const worker = {
// 	async fetch(request: Request): Promise<Response> {
// 		const config = {
// 			host: 'us-east.connect.psdb.cloud',
// 			username: 'v8pv86gq25zylt6jz29t',
// 			password: 'pscale_pw_uODyreQj8yl8IGUlxLyjYf8zaVvBZ1PE0GoDVH0SeUg'
// 		}

// 		const conn = connect(config);
// 		const [results] = await Promise.all([conn.execute('select * from users')]);
// 		console.log(results.rows);
// 		const json = JSON.stringify(results.rows);
// 		return new Response(json, {
// 			headers: {
// 				"Content-Type": "application/json:charset=UTF-8",
// 				"Access-Control-Allow-Origin": "*"
// 			}
// 		})

// 	}
// }

// export default worker;

self.addEventListener("fetch", yoga);

// database: usersb
// username: v8pv86gq25zylt6jz29t
// host: us-east.connect.psdb.cloud
// password: pscale_pw_uODyreQj8yl8IGUlxLyjYf8zaVvBZ1PE0GoDVH0SeUg
