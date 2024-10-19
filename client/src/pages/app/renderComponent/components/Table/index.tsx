/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from "react"
import ComponentProps from "../../interfaces/ComponentProps"
import TableRow from "./TableRow"

const Table = ({ ui, data, deleteData }: ComponentProps): React.ReactNode => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [editRowIds, setEditRowIds] = useState<string[]>([])

  let dataRows = ui.props.data
  if (ui.props.dataRef) {
    dataRows = data && data.find((x) => x.name === ui.props.dataRef)?.rows
  }
  if (debouncedSearchTerm) {
    dataRows = dataRows.filter((dataRow: any) => {
      return JSON.stringify(dataRow).toLowerCase().includes(debouncedSearchTerm)
    }) as any[]
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase())
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const onAddClick = () => {}

  const onEditClick = (rowId: string) => {
    editRowIds.push(rowId)
    setEditRowIds((prevEditRowIds) => [...prevEditRowIds, rowId])
    console.warn("editRowIds", editRowIds)
  }
  console.warn("editRowIds", editRowIds)

  const onEditCancelClick = (rowId: string) => {
    setEditRowIds((prevEditRowIds) => prevEditRowIds.filter((x) => x !== rowId))
  }

  const onEditSaveClick = (rowId: string) => {}

  const onDeleteClick = (rowId: string) => {
    if (deleteData) {
      deleteData(ui.props.dataRef, rowId)
    }
  }

  console.warn("editRowIds", editRowIds)

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{ui.props.title}</h1>
        <input type="text" placeholder="Search..." className="border p-2 rounded w-64" onChange={onSearchChange} />
      </div>
      <table key={ui.id} className="myTable w-full">
        <thead>
          <tr>
            {ui.props.headers.map((header: string, index: number) => (
              <th key={index}>{header}</th>
            ))}
            <th>
              <button
                onClick={() => {
                  onAddClick()
                }}
              >
                Add
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((dataRow: any, index: number) => {
            const isEditMode = editRowIds.includes(dataRow.id)
            return (
              <TableRow
                key={index}
                ui={ui}
                dataRow={dataRow}
                index={index}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                isEditMode={isEditMode}
                data={data}
                onEditCancelClick={onEditCancelClick}
                onEditSaveClick={onEditSaveClick}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
