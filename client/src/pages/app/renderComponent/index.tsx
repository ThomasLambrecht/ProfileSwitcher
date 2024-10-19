/* eslint-disable no-case-declarations */
import UIComponentProps from "./interfaces/UIComponentProps"
import DataProps from "./interfaces/DataProps"

import React from "react"
import Grid from "./components/Grid"
import Card from "./components/Card"
import Text from "./components/Text"
import List from "./components/List"
import Table from "./components/Table"

const renderComponent = (ui: UIComponentProps, data: DataProps[], deleteData?: (dataName: string, rowId: string) => void): React.ReactNode => {
  console.warn(ui.type, deleteData)

  switch (ui.type) {
    case "Grid":
      return <Grid ui={ui} data={data} deleteData={deleteData} />

    case "Card":
      return <Card ui={ui} data={data} deleteData={deleteData} />

    case "Text":
      return <Text ui={ui} data={data} deleteData={deleteData} />

    case "List":
      return <List ui={ui} data={data} deleteData={deleteData} />

    case "Table":
      return <Table ui={ui} data={data} deleteData={deleteData} />

    default:
      return null
  }
}

export default renderComponent
