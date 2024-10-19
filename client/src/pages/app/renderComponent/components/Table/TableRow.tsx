/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from "react"
import TableCell from "./TableCell"

const TableRow = ({ ui, dataRow, index, onEditClick, onDeleteClick, isEditMode, data, onEditCancelClick, onEditSaveClick }: any): React.ReactNode => {
  // Edit mode
  if (isEditMode) {
    return (
      <tr key={index}>
        {ui.props.dataFields.map((dataFieldSet: string[], index: number) => (
          <TableCell
            key={index}
            dataFieldSet={dataFieldSet}
            editFields={ui.props.editFields}
            dataRow={dataRow}
            index={index}
            isEditMode={isEditMode}
            data={data}
          />
        ))}
        <td>
          <button
            onClick={() => {
              onEditSaveClick(dataRow.id)
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
      </tr>
    )
  }

  // View mode
  return (
    <tr key={index}>
      {ui.props.dataFields.map((dataFieldSet: string[], index: number) => (
        <td key={index}>
          {dataFieldSet.map((dataField: string, index: number) => {
            const value = dataField.split(".").reduce((obj, key) => obj[key], dataRow)
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
      <td>
        <button
          onClick={() => {
            onEditClick(dataRow.id)
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            onDeleteClick(dataRow.id)
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

export default TableRow
