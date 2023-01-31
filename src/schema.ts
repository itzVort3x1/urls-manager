import { makeExecutableSchema } from "@graphql-tools/schema";
import { connect } from "@planetscale/database";
import { typeDefinitions } from "./types/typeDefinitions";
import { createGraphQLError } from "graphql-yoga";
import { applyMiddleware } from "graphql-middleware";
import { shield, rule } from "graphql-shield";
// import jwt from "jsonwebtoken";

const config = {
	host: "us-east.connect.psdb.cloud",
	username: "v8pv86gq25zylt6jz29t",
	password: "pscale_pw_uODyreQj8yl8IGUlxLyjYf8zaVvBZ1PE0GoDVH0SeUg",
};

const conn = connect(config);

const resolvers = {
	Query: {
		totalUsers: async () => {
			const [results]: any = await Promise.all([
				conn.execute("select count(*) as total from users"),
			]);
			return parseInt(results.rows[0].total);
		},
		users: async () => {
			// throw createGraphQLError("test");
			const [results] = await Promise.all([
				conn.execute("select * from users"),
			]);
			return results.rows;
		},
		allShortcuts: async () => {
			const [results] = await Promise.all([
				conn.execute("select * from shortcuts"),
			]);
			return results.rows;
		},
		getUser: async (
			parent: unknown,
			args: { email: string; id: number },
			context: any
		) => {
			// console.log(">>>", context.request.headers);
			const [results] = await Promise.all([
				conn.execute(
					`select * from users where email = "${args?.email}" or id = ${
						args?.id == undefined ? null : args.id
					}`
				),
			]);
			return results.rows;
		},
		userShortcuts: async (parent: unknown, args: { user_id: number }) => {
			const [results] = await Promise.all([
				conn.execute(
					`select * from shortcuts where user_id = ${
						args?.user_id == undefined ? null : args.user_id
					}`
				),
			]);
			return results.rows;
		},
		getShortcut: async (
			parent: unknown,
			args: { snippet: string; user_id: number }
		) => {
			console.log(args.snippet);
			const [results] = await Promise.all([
				conn.execute(
					`select * from shortcuts where snippet like "%${
						args?.snippet.split("/")[1]
					}%" and user_id = ${args.user_id} limit 10`
				),
			]);
			return results.rows;
		},
		loginUser: async (
			parent: unknown,
			args: { email: string; password: string }
		) => {
			const user = {
				email: args.email,
				password: args.password,
			};

			const [results] = await Promise.all([
				conn.execute(
					`select * from users where email = "${args.email}" and password = "${args.password}"`
				),
			]);
			if(!results.rows.length){
				return createGraphQLError("Invalid Credentials");
			}
			return results.rows;
		},
	},
	Mutation: {
		createUser: async (
			parent: unknown,
			args: {
				name: string;
				email: string;
				Org_name: string;
				password: string;
				id: number;
			}
		) => {
			const user = {
				id: args.id,
				name: args.name,
				email: args.email,
				Org_name: args.Org_name,
			};

			const query =
				"INSERT INTO users (`id`, `name`, `email`, `password`, `Org_name`) VALUES (?, ?, ?, ?, ?)";
			const params = [
				args.id,
				args.name,
				args.email,
				args.password,
				args.Org_name,
			];
			await conn.execute(query, params);

			return user;
		},
		createShortcut: async (
			parent: unknown,
			args: { user_id: number; snippet: string; url: string; id: string }
		) => {
			const shortcut = {
				user_id: args.user_id,
				snippet: args.snippet,
				url: args.url,
				id: args.id,
			};

			const query =
				"INSERT INTO shortcuts (`user_id`, `snippet`, `url`, `id`) VALUES (?, ?, ?, ?)";
			const params = [args.user_id, args.snippet, args.url, args.id];
			await conn.execute(query, params);

			return shortcut;
		},
		updateShortcut: async (
			parent: unknown,
			args: { snippet: string; url: string; id: string }
		) => {
			const shortcut = {
				snippet: args.snippet,
				url: args.url,
				id: args.id,
			};
			console.log(args.id);
			const query = `UPDATE shortcuts SET snippet = "${args.snippet}", url= "${args.url}" WHERE id = "${args.id}"`;
			await conn.execute(query);

			return shortcut;
		},
		deleteShortcut: async (
			parent: unknown,
			args: { user_id: number; snippet: string }
		) => {
			const shortcut = {
				user_id: args.user_id,
			};
			const query = `delete from shortcuts where user_id = ${args.user_id} and snippet = "${args.snippet}"`;
			await conn.execute(query);

			return shortcut;
		},
	},
};

function validateEmail(mail: string): boolean {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return true;
	}
	return false;
}

const isLoginValidation = rule({ cache: "contextual" })(
	async (parent, args, ctx, info) => {
		if(!validateEmail(args.email)){
			return createGraphQLError('Invalid Email')
		}

		return true;
	}
);

const isSignUpUser = rule({ cache: "contextual" })(
	async (parent, args, ctx, info) => {
		console.log(args);
		if(args.email == "" || args.name == "" || args.password == "" || args.Org_name == ""){
			return createGraphQLError('Please Enter all the Fields');
		}
		if(!validateEmail(args.email)){
			return createGraphQLError('Invalid Email')
		}
		return true;
	}
);


function isValidURL(str: string): boolean {
	if(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str)) {
		return true;
	} else {
		return false;
	}
 }
   

const isValidShortcut = rule({ cache: "contextual" })(
	async (parent, args, ctx, info) => {
		if(args.snippet == "o/"){
			return createGraphQLError('Please Fill the Snippet field');
		}
		if(args.url == ""){
			return createGraphQLError('Please Fill the url field');
		}
		if(!isValidURL(args.url)){
			return createGraphQLError('Please Enter a Valid URL');
		}
		return true;
	}
);

const isValidRequest = rule({ cache: "contextual" })(
	async (parent, args, ctx, info) => {
		// console.log(">>>>>", ctx.request.headers.get("authorization"))
		// const token = ctx.request.headers.get("authorization");
		// if(token !== "thisIsAuth"){
		// 	return createGraphQLError('Unauthorized Access');
		// }
		// if(args.snippet == "o/"){
		// 	return createGraphQLError('Please Fill the Snippet field');
		// }
		// if(args.url == ""){
		// 	return createGraphQLError('Please Fill the url field');
		// }
		// if(!isValidURL(args.url)){
		// 	return createGraphQLError('Please Enter a Valid URL');
		// }
		return true;
	}
);

const permissions = shield({
	Query: {
		loginUser: isLoginValidation,
		// userShortcuts: isValidRequest
	},
	Mutation: {
		createUser: isSignUpUser,
		createShortcut: isValidShortcut
	},
});

const schema = makeExecutableSchema({
	resolvers: [resolvers],
	typeDefs: [typeDefinitions],
});
export const schemaWithPermissions = applyMiddleware(schema, permissions);
