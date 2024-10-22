import React from "react"
import AppGrid from "./components/AppGrid"
import AppCard from "./components/AppCard"
import AppText from "./components/AppText"
import AppList from "./components/AppList"
import AppTable from "./components/AppTable"
import UIComponent from "./interfaces/graphql/UIComponent"
import DataProps from "./interfaces/props/DataProps"

const renderComponent = (ui: UIComponent, data: DataProps): React.ReactNode => {
  switch (ui.type) {
    case "Grid":
      return <AppGrid ui={ui} data={data} />

    case "Card":
      return <AppCard ui={ui} data={data} />

    case "Text":
      return <AppText ui={ui} data={data} />

    case "List":
      return <AppList ui={ui} data={data} />

    case "Table":
      return <AppTable ui={ui} data={data} />

    default:
      return null
  }
}

export default renderComponent
