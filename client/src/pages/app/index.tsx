import renderComponent from "./renderComponent"
import { useQuery, gql, useMutation } from "@apollo/client"
import PageUI from "./renderComponent/interfaces/graphql/PageUI"
import PageData from "./renderComponent/interfaces/graphql/PageData"
import ComponentProps from "./renderComponent/interfaces/props/ComponentProps"

const GET_PAGE_DATA = gql`
  query GetPageData($pageName: String!, $tableName: String) {
    getPageData(pageName: $pageName, tableName: $tableName) {
      id
      pageName
      tables {
        tableName
        rows
      }
    }
  }
`

const GET_PAGE_UI = gql`
  query GetPageUI($pageName: String!) {
    getPageUI(pageName: $pageName) {
      id
      pageName
      layout {
        id
        type
        props
        children {
          id
          type
          props
          children {
            id
            type
            props
          }
        }
      }
    }
  }
`

const SAVE_DATA = gql`
  mutation SaveData($pageName: String!, $tableName: String!, $row: JSON!) {
    saveData(pageName: $pageName, tableName: $tableName, row: $row)
  }
`

const DELETE_DATA = gql`
  mutation DeleteData($pageName: String!, $tableName: String!, $rowId: ID!) {
    deleteData(pageName: $pageName, tableName: $tableName, rowId: $rowId)
  }
`

const AppContext = () => {
  const pageName = "home"

  const {
    loading: uiLoading,
    error: uiError,
    data: uiData,
  } = useQuery(GET_PAGE_UI, {
    variables: { pageName },
  })

  const {
    loading: dataLoading,
    error: dataError,
    data: dataData,
  } = useQuery(GET_PAGE_DATA, {
    variables: { pageName, tableName: "" },
  })

  const [saveDataMutation, { error: saveError }] = useMutation(SAVE_DATA, {
    refetchQueries: [
      {
        query: GET_PAGE_DATA,
        variables: { pageName },
      },
    ],
  })

  const saveRow = async (tableName: string, row: any) => {
    try {
      await saveDataMutation({ variables: { pageName, tableName, row } })
    } catch (err) {
      console.error("Error editing item:", err)
    }
  }

  const [deleteDataMutation, { error: deleteError }] = useMutation(DELETE_DATA, {
    refetchQueries: [
      {
        query: GET_PAGE_DATA,
        variables: { pageName },
      },
    ],
  })

  const deleteRow = async (tableName: string, rowId: string) => {
    try {
      await deleteDataMutation({ variables: { pageName, tableName, rowId } })
    } catch (err) {
      console.error("Error deleting item:", err)
    }
  }

  if (uiLoading || dataLoading) {
    return <p>Loading...</p>
  }
  if (uiError) {
    return <p>GraphQL - UI Error: {uiError.message}</p>
  }
  if (dataError) {
    return <p>GraphQL - Data Error: {dataError.message}</p>
  }
  if (saveError) {
    return <p>GraphQL - Save Data Error: {saveError.message}</p>
  }
  if (deleteError) {
    return <p>GraphQL - Delete Data Error: {deleteError.message}</p>
  }

  const pageData: PageData = dataData.getPageData
  const pageUI: PageUI = uiData.getPageUI

  const componentProps: ComponentProps = {
    ui: pageUI.layout,
    data: {
      tables: pageData.tables,
      saveRow,
      deleteRow,
    },
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">App Context: {pageUI.pageName}</h1>
      {renderComponent(componentProps.ui, componentProps.data)}
    </div>
  )
}

export default AppContext
