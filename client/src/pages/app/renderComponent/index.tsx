import React from "react"
import Grid from "./components/Grid"
import Card from "./components/Card"
import Text from "./components/Text"
import List from "./components/List"
import Table from "./components/Table"
import UIComponent from "./interfaces/graphql/UIComponent"
import DataProps from "./interfaces/props/DataProps"

const renderComponent = (ui: UIComponent, data: DataProps): React.ReactNode => {
  switch (ui.type) {
    case "Grid":
      return <Grid ui={ui} data={data} />

    case "Card":
      return <Card ui={ui} data={data} />

    case "Text":
      return <Text ui={ui} data={data} />

    case "List":
      return <List ui={ui} data={data} />

    case "Table":
      return <Table ui={ui} data={data} />

    default:
      return null
  }
}

export default renderComponent
