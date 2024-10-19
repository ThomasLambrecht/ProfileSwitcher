import renderComponent from "./renderComponent"
import { useQuery, gql, useMutation } from "@apollo/client"
import "./index.css"

const GET_PAGE_DATA = gql`
  query GetPageData($pageName: String!, $dataName: String) {
    getPageData(pageName: $pageName, dataName: $dataName) {
      id
      pageName
      data {
        name
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

const DELETE_DATA = gql`
  mutation DeleteData($pageName: String!, $dataName: String!, $rowId: ID!) {
    deleteData(pageName: $pageName, dataName: $dataName, rowId: $rowId)
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
    variables: { pageName, dataName: "" },
  })

  const [deleteDataMutation, { error: deleteError }] = useMutation(DELETE_DATA, {
    refetchQueries: [
      {
        query: GET_PAGE_DATA,
        variables: { pageName },
      },
    ],
  })

  const deleteData = async (dataName: string, rowId: string) => {
    try {
      await deleteDataMutation({ variables: { pageName, dataName, rowId } })
      console.log("Item deleted successfully!")
    } catch (err) {
      console.error("Error deleting item:", err)
    }
  }

  if (uiLoading || dataLoading) {
    return <p>Loading...</p>
  }
  if (uiError) {
    return <p>UI Error: {uiError.message}</p>
  }
  if (dataError) {
    return <p>Data Error: {dataError.message}</p>
  }
  if (deleteError) {
    return <p>Delete Data Error: {deleteError.message}</p>
  }

  const pageData = dataData.getPageData
  const pageUI = uiData.getPageUI

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">App Context: {pageUI.pageName}</h1>
      {renderComponent(pageUI.layout, pageData.data, deleteData)}
    </div>
  )
}

export default AppContext
