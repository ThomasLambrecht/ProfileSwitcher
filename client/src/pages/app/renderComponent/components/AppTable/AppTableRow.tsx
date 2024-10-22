/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react"
import AppTableCell from "./AppTableCell"
import UIComponent from "../../interfaces/graphql/UIComponent"
import DataRow from "../../interfaces/graphql/DataRow"
import DataProps from "../../interfaces/props/DataProps"
import TableViewCell from "../../interfaces/graphql/TableViewCell"

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
      <tr key={index}>
        {ui.props.tableViewCells?.map((tableViewCell: TableViewCell, index: number) => (
          <AppTableCell
            key={index}
            tableViewCell={tableViewCell}
            tableEditCells={ui.props.tableEditCells}
            dataRow={dataRow}
            index={index}
            isEditMode={isEditMode}
            data={data}
            editDataRow={editDataRow}
            setEditDataRow={setEditDataRow}
          />
        ))}
        {(ui.props.canEdit || ui.props.canDelete || ui.props.canAdd) && (
          <td>
            <button
              onClick={() => {
                onEditSaveClick(editDataRow)
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                onEditCancelClick(dataRow.id)
              }}
            >
              Cancel
            </button>
          </td>
        )}
      </tr>
    )
  }

  // View mode
  return (
    <tr key={index}>
      {ui.props.tableViewCells?.map((tableViewCell: TableViewCell, index: number) => (
        <td key={index}>
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
        </td>
      ))}
      {(ui.props.canEdit || ui.props.canDelete || ui.props.canAdd) && (
        <td>
          {ui.props.canEdit && (
            <button
              onClick={() => {
                onEditClick(dataRow.id)
              }}
            >
              Edit
            </button>
          )}
          {ui.props.canDelete && (
            <button
              onClick={() => {
                onDeleteClick(dataRow.id)
              }}
            >
              Delete
            </button>
          )}
        </td>
      )}
    </tr>
  )
}

export default AppTableRow
