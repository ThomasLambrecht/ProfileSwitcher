import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = http.createServer(app);

// Define the schema
const typeDefs = `
  type Data {
    id: ID!
    name: String!
    type: String!
    value: JSON
  }

  type DataPage {
    id: ID!
    name: String!
    data: [Data]
  }

  type Query {
    getPageData(name: String!): DataPage
  }

  type UIComponent {
    id: ID!
    type: String!
    props: JSON
    children: [UIComponent]
  }

  type UIPage {
    id: ID!
    name: String!
    layout: UIComponent
  }

  type Query {
    getPageUI(name: String!): UIPage
  }

  scalar JSON
`;

const homePageId = uuidv4();
const homePageName = "home";

// Sample data
const dataSample = [
  {
    id: homePageId,
    name: homePageName,
    data:[
      {
        name: 'stats',
        type: 'array',
        value: ['Users: 1,001', 'Posts: 5,001', 'Comments: 10,001']
      },
      {
        name: 'iterations',
        type: 'array',
        value: [
          {
            name: "2024 year-end run 1",
            created: { employee: "Riaan Kirchner", datetime: "2024-04-05 10:23:23" },
            updated: { employee: "Neil Kleynhans", datetime: "2024-04-05 10:32:21" },
            status: "Completed",
          },
          {
            name: "2024 year-end run 2",
            created: { employee: "Francois Kruger", datetime: "2024-04-05 14:43:26" },
            updated: { employee: "Neil Kleynhans", datetime: "2024-04-06 08:42:52" },
            status: "In Progress",
          },
          {
            name: "2024 year-end run 3",
            created: {
              employee: "Richard Montgomery",
              datetime: "2024-04-06 14:43:26",
            },
            updated: { employee: "Michaela Bogiages", datetime: "2024-04-07 08:32:21" },
            status: "In Progress",
          },
        ]
      }
    ]
  }
];

const uiSample = [
  {
    id: homePageId,
    name: homePageName,
    layout: {
      id: uuidv4(),
      type: "Grid",
      props: { columns: 2, gap: 4 },
      children: [
        {
          id: uuidv4(),
          type: "Card",
          props: { title: "Welcome" },
          children: [
            {
              id: uuidv4(),
              type: "Text",
              props: { content: "Welcome to our server-driven UI demo!" },
            },
          ],
        },
        {
          id: uuidv4(),
          type: "Card",
          props: { title: "Stats 1" },
          children: [
            {
              id: uuidv4(),
              type: "List",
              props: { items: ['Users: 1,000', 'Posts: 5,000', 'Comments: 10,000'] }
            },
          ],
        },
        {
          id: uuidv4(),
          type: "Card",
          props: { title: "Stats 2" },
          children: [
            {
              id: uuidv4(),
              type: "List",
              props: { itemsRef: "stats" },
            },
          ],
        },
        {
          id: uuidv4(),
          type: "Table",
          props: {
            canAdd: true,
            canSearch: true,
            title: "Table 1",
            headers: ["Header A", "Header B", "Header C", "Header D"],
            data: [
              {
                a: "A1",
                b: {itemA: "B1.a", itemB: "B1.b"},
                c: "C1",
                d: "D1"
              },
              {
                a: "A2",
                b: {itemA: "B2.a", itemB: "B2.b"},
                c: "C2",
                d: "D2"
              },
            ],
            dataFields: [
              ["a"],
              ["b.itemA", "b.itemB"],
              ["c"],
              ["d"],
            ],
          },
          children: [],
        },
        {
          id: uuidv4(),
          type: "Table",
          props: {
            canAdd: true,
            canSearch: true,
            title: "Iterations",
            headers: ["Iteration", "Created", "Updated", "Status"],
            dataRef: "iterations",
            dataFields: [
              ["name"],
              ["created.employee", "created.datetime"],
              ["updated.employee", "updated.datetime"],
              ["status"],
            ],
          },
          children: [],
        },
      ],
    },
  },
];

interface GetPageArgs {
  name: string;
}

// Define resolvers
const resolvers = {
  Query: {
    getPageData: (_: void, args: GetPageArgs) => dataSample.find(page => page.name === args.name),
    getPageUI: (_: void, args: GetPageArgs) => uiSample.find(page => page.name === args.name)
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server),
  );

  const port = 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
}

startServer();