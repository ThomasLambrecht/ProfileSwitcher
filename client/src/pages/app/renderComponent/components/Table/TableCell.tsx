/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from "react"

const TableCell = ({ dataFieldSet, dataRow, index, isEditMode, editFields, data }: any): React.ReactNode => {
  // Edit mode
  if (isEditMode) {
    const editField = editFields[index]
    const dataField = dataFieldSet[0]
    const value = dataField.split(".").reduce((obj: any, key: any) => obj[key], dataRow)

    if (editField?.type === "textInput") {
      return (
        <td key={index}>
          <input type="text" value={value} />
        </td>
      )
    }

    if (editField?.type === "select") {
      const iterationStatuses = ((data as any[]).find((x) => x.name === editField.referenceData)?.rows as any[])?.map((x) => x.value) as any[]
      return (
        <td key={index}>
          <select value={value}>
            {iterationStatuses.map((option, index) => (
              <option key={index} value={option}>
                {option}
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
  )
}

export default TableCell
