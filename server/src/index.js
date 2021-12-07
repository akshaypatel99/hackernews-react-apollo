const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils');
const { PubSub } = require('apollo-server');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');
const Vote = require('./resolvers/Vote');

const pubsub = new PubSub();

const resolvers = {
	Query,
	Mutation,
	Subscription,
	User,
	Link,
	Vote,
};

// Gets the typeDefs (schema definition) from the schema.graphql file
const typeDefs = fs.readFileSync(
	path.join(__dirname, 'schema.graphql'),
	'utf-8'
);

const prisma = new PrismaClient();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		return {
			...req,
			prisma,
			pubsub,
			userId: req && req.headers.authorization ? getUserId(req) : null,
		};
	},
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
