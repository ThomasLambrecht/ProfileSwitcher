/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from "react"

const setValueByPath = (row: any, path: string, value: any): void => {
  const keys = path.split(".")

  // Use reduce to navigate to the second last key
  const lastKey = keys.pop() // Get the last key
  const target = keys.reduce((current, key) => {
    // If the key doesn't exist, create an empty object
    if (!current[key]) {
      current[key] = {}
    }
    return current[key] // Move deeper into the object
  }, row)

  // Set the value at the last key
  if (lastKey) {
    target[lastKey] = value
  }
}

const TableCell = ({ dataFieldSet, dataRow, index, isEditMode, editFields, data, editDataRow, setEditDataRow }: any): React.ReactNode => {
  const dataField = dataFieldSet[0]
  // const defaultValue = dataField.split(".").reduce((obj: any, key: any) => obj[key], dataRow)
  // const [value, setValue] = useState<string>(defaultValue)
  // (row, field.path, field.value)

  // Edit mode
  const editField = editFields[index]
  if (isEditMode && editField?.type) {
    const updateValue = (value: any) => {
      const updatedEditDataRow = {
        ...editDataRow,
      }
      setValueByPath(updatedEditDataRow, dataField, value)
      setEditDataRow(updatedEditDataRow)
    }

    const onTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      updateValue(e.target.value)
    }

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
      updateValue(e.target.value)
    }

    if (editField?.type === "textInput") {
      return (
        <td key={index}>
          <input type="text" value={editDataRow[dataField]} onChange={onTextInputChange} />
        </td>
      )
    }

    if (editField?.type === "select") {
      const iterationStatuses = ((data as any[]).find((x) => x.name === editField.referenceData)?.rows as any[])?.map((x) => x.value) as any[]
      return (
        <td key={index}>
          <select value={editDataRow[dataField]} onChange={onSelectChange}>
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
        // const value = dataField.split(".").reduce((obj, key) => obj[key], dataRow)
        const value = dataField.split(".").reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), dataRow)

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
