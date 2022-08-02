import { ApolloServer, gql } from "apollo-server";

let tweets = [
  { id: "1", text: "first one" },
  { id: "2", text: "second one" },
];

//gql애개 데이터의 타입을 설명하는 코드 SDL (Schema Definition Language)
// Query타입은 꼭 써야하는 정보!
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      // 첫번째 인자는 항상 root, (root, args)하고 console.log(args)하면 console에 {id:'1'}가 찍힘
      return tweets.find((tweet) => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(root, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(root, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
