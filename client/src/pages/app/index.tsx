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

const ADD_DATA = gql`
  mutation AddData($pageName: String!, $dataName: String!, $row: JSON!) {
    addData(pageName: $pageName, dataName: $dataName, row: $row)
  }
`

const EDIT_DATA = gql`
  mutation EditData($pageName: String!, $dataName: String!, $row: JSON!) {
    editData(pageName: $pageName, dataName: $dataName, row: $row)
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

  const [addDataMutation, { error: addError }] = useMutation(ADD_DATA, {
    refetchQueries: [
      {
        query: GET_PAGE_DATA,
        variables: { pageName },
      },
    ],
  })

  const addData = async (dataName: string, row: any) => {
    try {
      await addDataMutation({ variables: { pageName, dataName, row } })
    } catch (err) {
      console.error("Error adding item:", err)
    }
  }

  const [editDataMutation, { error: editError }] = useMutation(EDIT_DATA, {
    refetchQueries: [
      {
        query: GET_PAGE_DATA,
        variables: { pageName },
      },
    ],
  })

  const editData = async (dataName: string, row: any) => {
    try {
      await editDataMutation({ variables: { pageName, dataName, row } })
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

  const deleteData = async (dataName: string, rowId: string) => {
    try {
      await deleteDataMutation({ variables: { pageName, dataName, rowId } })
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
  if (addError) {
    return <p>GraphQL - Add Data Error: {addError.message}</p>
  }
  if (editError) {
    return <p>GraphQL - Edit Data Error: {editError.message}</p>
  }
  if (deleteError) {
    return <p>GraphQL - Delete Data Error: {deleteError.message}</p>
  }

  const pageData = dataData.getPageData
  const pageUI = uiData.getPageUI

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">App Context: {pageUI.pageName}</h1>
      {renderComponent(pageUI.layout, pageData.data, addData, editData, deleteData)}
    </div>
  )
}

export default AppContext
