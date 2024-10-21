import React, { ChangeEvent } from "react"
import DataProps from "../../interfaces/props/DataProps"
import DataRow from "../../interfaces/graphql/DataRow"
import setValueByPath from "./setValueByPath"
import TableViewCell from "../../interfaces/graphql/TableViewCell"
import TableEditCell from "../../interfaces/graphql/TableEditCell"

interface TableCellProps {
  tableViewCell: TableViewCell
  tableEditCells?: TableEditCell[]
  dataRow: DataRow
  index: number
  isEditMode: boolean
  data: DataProps
  editDataRow: any
  setEditDataRow: any
}

const TableCell = ({
  tableViewCell,
  tableEditCells,
  dataRow,
  index,
  isEditMode,
  data,
  editDataRow,
  setEditDataRow,
}: TableCellProps): React.ReactNode => {
  const field = tableViewCell.fields[0]

  // Edit mode
  const tableEditCell = tableEditCells && tableEditCells[index]
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
        <td key={index}>
          <input type="text" value={editDataRow[field]} onChange={onTextInputChange} />
        </td>
      )
    }

    if (tableEditCell?.type === "select") {
      const iterationStatusRows = data.tables.find((x) => x.tableName === tableEditCell.referenceTableName)?.rows
      return (
        <td key={index}>
          <select value={editDataRow[field]} onChange={onSelectChange}>
            {iterationStatusRows?.map((row, index) => (
              <option key={index} value={row.value}>
                {row.value}
              </option>
            ))}
          </select>
        </td>
      )
    }

    return <td key={index}></td>
  }

  // View mode
  return (
    <td key={index}>
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
    </td>
  )
}

export default TableCell
