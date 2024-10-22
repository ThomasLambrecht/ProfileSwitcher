import React, { useState } from "react"
import AppTableCell from "./AppTableCell"
import UIComponent from "../../interfaces/graphql/UIComponent"
import DataRow from "../../interfaces/graphql/DataRow"
import DataProps from "../../interfaces/props/DataProps"
import TableViewCell from "../../interfaces/graphql/TableViewCell"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface AppTableRowProps {
  ui: UIComponent
  dataRow: DataRow
  index: number | string
  onEditClick: any
  onDeleteClick: any
  isEditMode: boolean
  data: DataProps
  onEditCancelClick: any
  onEditSaveClick: any
}

const AppTableRow = ({
  ui,
  dataRow,
  index,
  onEditClick,
  onDeleteClick,
  isEditMode,
  data,
  onEditCancelClick,
  onEditSaveClick,
}: AppTableRowProps): React.ReactNode => {
  const [editDataRow, setEditDataRow] = useState<any>(dataRow)

  // Edit mode
  if (isEditMode) {
    return (
      <TableRow key={index}>
        {ui.props.tableViewCells?.map((tableViewCell: TableViewCell, index: number) => (
          <AppTableCell
            key={index}
            tableViewCell={tableViewCell}
            tableEditCell={ui.props.tableEditCells && ui.props.tableEditCells[index]}
            dataRow={dataRow}
            index={index}
            isEditMode={isEditMode}
            data={data}
            editDataRow={editDataRow}
            setEditDataRow={setEditDataRow}
          />
        ))}
        {(ui.props.canEdit || ui.props.canDelete || ui.props.canAdd) && (
          <TableCell>
            <div className="flex space-x-2 justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onEditSaveClick(editDataRow)
                }}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEditCancelClick(dataRow.id)
                }}
              >
                Cancel
              </Button>
            </div>
          </TableCell>
        )}
      </TableRow>
    )
  }

  // View mode
  return (
    <TableRow key={index}>
      {ui.props.tableViewCells?.map((tableViewCell: TableViewCell, index: number) => (
        <TableCell key={index}>
          {tableViewCell.fields?.map((field: string, index: number) => {
            const value = field.split(".").reduce((obj, key) => obj[key], dataRow) as any
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
      ))}
      {(ui.props.canEdit || ui.props.canDelete || ui.props.canAdd) && (
        <TableCell>
          <div className="flex space-x-2 justify-end">
            {ui.props.canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEditClick(dataRow.id)
                }}
              >
                Edit
              </Button>
            )}
            {ui.props.canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDeleteClick(dataRow.id)
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  )
}

export default AppTableRow
