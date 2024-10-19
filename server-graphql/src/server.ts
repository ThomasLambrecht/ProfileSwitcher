import express from "express"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import http from "http"
import cors from "cors"
import bodyParser from "body-parser"
import { v4 as uuidv4 } from "uuid"

const app = express()
const httpServer = http.createServer(app)

// Define the schema
const typeDefs = `
  type Data {
    id: ID!
    name: String!
    rows: JSON
  }

  type DataPage {
    id: ID!
    pageName: String!
    data: [Data]
  }

  type UIComponent {
    id: ID!
    type: String!
    props: JSON
    children: [UIComponent]
  }

  type UIPage {
    id: ID!
    pageName: String!
    layout: UIComponent
  }

  type Query {
    getPageData(pageName: String!, dataName: String): DataPage
    getPageUI(pageName: String!): UIPage
  }

  type Mutation {
    addData(pageName: String!, dataName: String!, row: JSON): ID
    editData(pageName: String!, dataName: String!, row: JSON): ID
    deleteData(pageName: String!, dataName: String!, rowId: ID!): ID
  }

  scalar JSON
`

const homePageId = uuidv4()
const homePageName = "home"

// Sample data
const dataSample = [
  {
    id: homePageId,
    pageName: homePageName,
    data: [
      {
        name: "stats",
        rows: [
          {
            id: uuidv4(),
            value: "Users: 1,001",
          },
          {
            id: uuidv4(),
            value: "Posts: 5,001",
          },
          {
            id: uuidv4(),
            value: "Comments: 10,001",
          },
        ],
      },
      {
        name: "iterationStatus",
        rows: [
          { id: uuidv4(), value: "New" },
          { id: uuidv4(), value: "In Progress" },
          { id: uuidv4(), value: "Completed" },
        ],
      },
      {
        name: "iterations",
        rows: [
          {
            id: uuidv4(),
            name: "2024 year-end run 1",
            created: {
              employee: "Riaan Kirchner",
              datetime: "2024-04-05 10:23:23",
            },
            updated: {
              employee: "Neil Kleynhans",
              datetime: "2024-04-05 10:32:21",
            },
            status: "Completed",
          },
          {
            id: uuidv4(),
            name: "2024 year-end run 2",
            created: {
              employee: "Francois Kruger",
              datetime: "2024-04-05 14:43:26",
            },
            updated: {
              employee: "Neil Kleynhans",
              datetime: "2024-04-06 08:42:52",
            },
            status: "In Progress",
          },
          {
            id: uuidv4(),
            name: "2024 year-end run 3",
            created: {
              employee: "Richard Montgomery",
              datetime: "2024-04-06 14:43:26",
            },
            updated: {
              employee: "Michaela Bogiages",
              datetime: "2024-04-07 08:32:21",
            },
            status: "In Progress",
          },
        ],
      },
    ],
  },
]

const uiSample = [
  {
    id: homePageId,
    pageName: homePageName,
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
              props: {
                items: [{ value: "Users: 1,000" }, { value: "Posts: 5,000" }, { value: "Comments: 10,000" }],
              },
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
                b: { itemA: "B1.a", itemB: "B1.b" },
                c: "C1",
                d: "D1",
              },
              {
                a: "A2",
                b: { itemA: "B2.a", itemB: "B2.b" },
                c: "C2",
                d: "D2",
              },
            ],
            dataFields: [["a"], ["b.itemA", "b.itemB"], ["c"], ["d"]],
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
            headers: ["Iteration", "Modified", "Created", "Status"],
            dataRef: "iterations",
            dataFields: [["name"], ["created.employee", "created.datetime"], ["updated.employee", "updated.datetime"], ["status"]],
            editFields: [{ field: "name", type: "textInput" }, null, null, { field: "status", type: "select", referenceData: "iterationStatus" }],
          },
          children: [],
        },
      ],
    },
  },
]

interface GetPageDataArgs {
  pageName: string
  dataName: string
  // searchTerm: string
}

interface GetPageUIArgs {
  pageName: string
}

interface AddDataArgs {
  pageName: string
  dataName: string
  row: any
}

interface EditDataArgs {
  pageName: string
  dataName: string
  row: any
}

interface DeleteDataArgs {
  pageName: string
  dataName: string
  rowId: string
}

function setValueByPath(obj: any, path: string, value: any): void {
  const keys = path.split(".")

  // Use reduce to navigate to the second last key
  const lastKey = keys.pop() // Get the last key
  const target = keys.reduce((current, key) => {
    // If the key doesn't exist, create an empty object
    if (!current[key]) {
      current[key] = {}
    }
    return current[key] // Move deeper into the object
  }, obj)

  // Set the value at the last key
  if (lastKey) {
    target[lastKey] = value
  }
}

function formatCurrentDateTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0") // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0")

  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// Define resolvers
const resolvers = {
  Query: {
    getPageData: (_: void, args: GetPageDataArgs) => {
      const pageData = dataSample.find((page) => page.pageName === args.pageName)
      if (!pageData) {
        return null
      }
      if (args.dataName) {
        pageData.data = pageData?.data.filter((x) => x.name === args.dataName)
      }
      // if (args.searchTerm) {
      //   const searchTerm = args.searchTerm.toLowerCase()
      //   pageData.data.forEach((data) => {
      //     data.rows = data.rows.filter((row) => {
      //       return JSON.stringify(row).toLowerCase().includes(searchTerm)
      //     }) as any[]
      //   })
      // }
      return pageData
    },
    getPageUI: (_: void, args: GetPageUIArgs) => uiSample.find((page) => page.pageName === args.pageName),
  },

  Mutation: {
    addData: (_: void, { pageName, dataName, row }: AddDataArgs): string => {
      row.id = uuidv4()
      const page = dataSample.find((x) => x.pageName === pageName)
      const data = page?.data.find((x) => x.name === dataName)
      data?.rows.push(row)
      return row.id
    },

    // editData: (_: void, { pageName, dataName, rowId, fields }: EditDataArgs): string => {
    //   const page = dataSample.find((x) => x.pageName === pageName)
    //   const data = page?.data.find((x) => x.name === dataName)
    //   const row = data?.rows.find((x) => x.id === rowId)
    //   for (var field of fields) {
    //     setValueByPath(row, field.path, field.value)
    //   }
    //   return rowId
    // },

    editData: (_: void, { pageName, dataName, row }: EditDataArgs): string => {
      const page = dataSample.find((x) => x.pageName === pageName)
      const data = page?.data.find((x) => x.name === dataName)
      const existingRow = data?.rows.find((x) => x.id === row.id) as any
      if (existingRow && pageName === homePageName && dataName === "iterations") {
        existingRow.name = row.name
        existingRow.updated.employee = "TODO"
        existingRow.updated.datetime = formatCurrentDateTime()
        existingRow.status = row.status
      }
      return row.id
    },

    deleteData: (_: void, { pageName, dataName, rowId }: DeleteDataArgs): string => {
      const page = dataSample.find((x) => x.pageName === pageName)
      const data = page?.data.find((x) => x.name === dataName)
      const rowIndex = data?.rows.findIndex((row) => row.id === rowId)
      if (rowIndex !== undefined && rowIndex >= 0) {
        data?.rows.splice(rowIndex, 1)
      }
      return rowId
    },
  },
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

async function startServer() {
  await server.start()

  app.use("/graphql", cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server))

  const port = 4000
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
}

startServer()
