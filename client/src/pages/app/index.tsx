import renderComponent from "./renderComponent"
import { useQuery, gql } from "@apollo/client"
import "./index.css"

const GET_PAGE_DATA = gql`
  query GetPageData($name: String!) {
    getPageData(name: $name) {
      id
      name
      data {
        name
        type
        value
      }
    }
  }
`

const GET_PAGE_UI = gql`
  query GetPageUI($name: String!) {
    getPageUI(name: $name) {
      id
      name
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

const AppContext = () => {
  const {
    loading: uiLoading,
    error: uiError,
    data: uiData,
  } = useQuery(GET_PAGE_UI, {
    variables: { name: "home" },
  })

  const {
    loading: dataLoading,
    error: dataError,
    data: dataData,
  } = useQuery(GET_PAGE_DATA, {
    variables: { name: "home" },
  })

  if (uiLoading || dataLoading) {
    return <p>Loading...</p>
  }
  if (uiError) {
    return <p>UI Error: {uiError.message}</p>
  }
  if (dataError) {
    return <p>Data Error: {dataError.message}</p>
  }

  const pageData = dataData.getPageData
  const pageUI = uiData.getPageUI

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">App Context: {pageUI.name}</h1>
      {renderComponent(pageUI.layout, pageData.data)}
    </div>
  )
}

export default AppContext
