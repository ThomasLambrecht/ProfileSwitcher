import React, { ChangeEvent } from "react"
import DataProps from "../../interfaces/props/DataProps"
import DataRow from "../../interfaces/graphql/DataRow"
import setValueByPath from "./setValueByPath"
import TableViewCell from "../../interfaces/graphql/TableViewCell"
import TableEditCell from "../../interfaces/graphql/TableEditCell"
import { TableCell } from "@/components/ui/table"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface AppTableCellProps {
  tableViewCell: TableViewCell
  tableEditCell?: TableEditCell
  dataRow: DataRow
  index: number
  isEditMode: boolean
  data: DataProps
  editDataRow: any
  setEditDataRow: any
}

const AppTableCell = ({
  tableViewCell,
  tableEditCell,
  dataRow,
  index,
  isEditMode,
  data,
  editDataRow,
  setEditDataRow,
}: AppTableCellProps): React.ReactNode => {
  const field = tableViewCell.fields[0]

  // Edit mode
  if (isEditMode && tableEditCell?.type) {
    const updateValue = (value: any) => {
      const updatedEditDataRow = {
        ...editDataRow,
      }
      setValueByPath(updatedEditDataRow, field, value)
      setEditDataRow(updatedEditDataRow)
    }

    const onTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      updateValue(e.target.value)
    }

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
      updateValue(e.target.value)
    }

    if (tableEditCell?.type === "textInput") {
      return (
        <TableCell key={index}>
          <Input type="text" placeholder={"Enter a value"} value={editDataRow[field]} onChange={onTextInputChange} />
        </TableCell>
      )
    }

    if (tableEditCell?.type === "select") {
      const iterationStatusRows = data.tables.find((x) => x.tableName === tableEditCell.referenceTableName)?.rows
      return (
        <TableCell key={index}>
          <select value={editDataRow[field]} onChange={onSelectChange}>
            {iterationStatusRows?.map((row, index) => (
              <option key={index} value={row.value}>
                {row.value}
              </option>
            ))}
          </select>
        </TableCell>
      )
    }

    return <TableCell key={index}></TableCell>
  }

  // View mode
  return (
    <TableCell key={index}>
      {tableViewCell.fields.map((dataField: string, index: number) => {
        const value = dataField.split(".").reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), dataRow) as any

        if (index === 0) {
          return (
            <React.Fragment key={index}>
              <strong>{value}</strong>
            </React.Fragment>
          )
        }
        return (
          <React.Fragment key={index}>
            <br />
            {value}
          </React.Fragment>
        )
      })}
    </TableCell>
  )
}

export default AppTableCell
