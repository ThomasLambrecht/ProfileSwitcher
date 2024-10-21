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
  type Table {
    id: ID!
    tableName: String!
    rows: JSON
  }

  type PageData {
    id: ID!
    pageName: String!
    tables: [Table]
  }

  type UIComponent {
    id: ID!
    type: String!
    props: JSON
    children: [UIComponent]
  }

  type PageUI {
    id: ID!
    pageName: String!
    layout: UIComponent
  }

  type Query {
    getPageData(pageName: String!, tableName: String): PageData
    getPageUI(pageName: String!): PageUI
  }

  type Mutation {
    saveData(pageName: String!, tableName: String!, row: JSON!): ID
    deleteData(pageName: String!, tableName: String!, rowId: ID!): ID
  }

  scalar JSON
`

// TODO: put this in a database
const homePageId = uuidv4()
const homePageName = "home"

// Sample data
// TODO: put this in a database
const tables = [
  {
    id: homePageId,
    pageName: homePageName,
    tables: [
      {
        tableName: "stats",
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
        tableName: "iterationStatus",
        rows: [
          { id: uuidv4(), value: "New" },
          { id: uuidv4(), value: "In Progress" },
          { id: uuidv4(), value: "Completed" },
        ],
      },
      {
        tableName: "iterations",
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
              datetime: "2024-04-05 12:32:21",
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
                rows: [{ value: "Users: 1,000" }, { value: "Posts: 5,000" }, { value: "Comments: 10,000" }],
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
              props: { dataTableName: "stats" },
            },
          ],
        },
        {
          id: uuidv4(),
          type: "Table",
          props: {
            canAdd: false,
            canEdit: false,
            canDelete: false,
            canSearch: true,
            title: "Table 1",
            headers: ["Header A", "Header B", "Header C", "Header D"],
            rows: [
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
            tableViewCells: [{ fields: ["a"] }, { fields: ["b.itemA", "b.itemB"] }, { fields: ["c"] }, { fields: ["d"] }],
          },
          children: [],
        },
        {
          id: uuidv4(),
          type: "Table",
          props: {
            canAdd: true,
            canEdit: true,
            canDelete: true,
            canSearch: true,
            title: "Iterations",
            headers: ["Iteration", "Modified", "Created", "Status"],
            dataTableName: "iterations",
            tableViewCells: [{ fields: ["name"] }, { fields: ["updated.employee", "updated.datetime"] }, { fields: ["created.employee", "created.datetime"] }, { fields: ["status"] }],
            tableEditCells: [{ field: "name", type: "textInput" }, null, null, { field: "status", type: "select", referenceTableName: "iterationStatus" }],
          },
          children: [],
        },
        {
          id: uuidv4(),
          type: "Table",
          props: {
            canAdd: true,
            canEdit: true,
            canDelete: true,
            canSearch: true,
            title: "Iterations Status",
            headers: ["Status"],
            dataTableName: "iterationStatus",
            tableViewCells: [{ fields: ["value"] }],
            tableEditCells: [{ field: "value", type: "textInput" }],
          },
          children: [],
        },
      ],
    },
  },
]

interface GetPageDataArgs {
  pageName: string
  tableName: string
}

interface GetPageUIArgs {
  pageName: string
}

interface SaveDataArgs {
  pageName: string
  tableName: string
  row: any // row to edit/add (new rows have empty ids)
}

interface DeleteDataArgs {
  pageName: string
  tableName: string
  rowId: string // row to delete
}

function getCurrentDateTimeFormatted() {
  // This returns the current datetime (now) formatted as "2024-04-05 10:23:23"
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
      // TODO:
      // - Add server-side search
      // - Add paging (page number and page size)
      // - Add ordering (and support multiple columns)
      // - Add support for filters (e.g. items that match select list; or amount > 1000)

      // Return all tables
      // TODO: use actual database
      const pageData = tables.find((page) => page.pageName === args.pageName)
      if (!pageData) {
        return null
      }
      // Optional table filter so that we only update the data we need
      if (args.tableName) {
        pageData.tables = pageData?.tables.filter((x) => x.tableName === args.tableName)
      }
      return pageData
    },
    getPageUI: (_: void, args: GetPageUIArgs) => uiSample.find((page) => page.pageName === args.pageName),
  },

  Mutation: {
    // Add / edit rows in database
    saveData: (_: void, { pageName, tableName, row }: SaveDataArgs): string => {
      // TODO: Implement authentication and authorisation

      // TODO: Use actual database to retrieve row
      const page = tables.find((x) => x.pageName === pageName)
      const table = page?.tables.find((x) => x.tableName === tableName)
      let existingRow = table?.rows.find((x) => x.id === row.id) as any

      // Save logic for 'iterations' table
      if (pageName === homePageName && tableName === "iterations") {
        if (existingRow) {
          // TODO: Use the name (or id) of the logged-in user
          existingRow.updated.employee = "TODO"
          // TODO: Check whether to store timestamp in universal format
          existingRow.updated.datetime = getCurrentDateTimeFormatted()
        }
        // If the row doesn't exist, then add the row
        if (existingRow === undefined) {
          existingRow = {
            id: uuidv4(),
            name: null,
            updated: {
              employee: null,
              datetime: null,
            },
            created: {
              // TODO: Use the name (or id) of the logged-in user
              employee: "TODO",
              // TODO: Check whether to store timestamp in universal format
              datetime: getCurrentDateTimeFormatted(),
            },
            // Default status to New
            status: "New",
          }
          table?.rows.push(existingRow)
        }

        // Update row fields with supplied values
        existingRow.name = row.name
        if (row.status) {
          existingRow.status = row.status
        }
      }

      // Save logic for 'iterationStatus' table
      if (pageName === homePageName && tableName === "iterationStatus") {
        // Don't save empty values
        if (row.value === null) {
          return ""
        }

        // If the row doesn't exist, then add the row
        if (existingRow === undefined) {
          existingRow = {
            id: uuidv4(),
            value: null,
          }
          table?.rows.push(existingRow)
        }
        if (existingRow.value === "New") {
          // Don't update for "New" or empty
          return existingRow.id
        }

        // Update row fields with supplied values
        existingRow.value = row.value
      }

      return existingRow.id
    },

    deleteData: (_: void, { pageName, tableName, rowId }: DeleteDataArgs): string => {
      // Find the row to be deleted
      // TODO: Use actual database
      const page = tables.find((x) => x.pageName === pageName)
      const data = page?.tables.find((x) => x.tableName === tableName)
      const rowIndex = data?.rows.findIndex((row) => row.id === rowId)

      // Remove the row from the database
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
