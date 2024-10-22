/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from "react"
import ComponentProps from "../../interfaces/props/ComponentProps"
import AppTableRow from "./AppTableRow"
import DataRow from "../../interfaces/graphql/DataRow"

const AppTable = ({ ui, data }: ComponentProps): React.ReactNode => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [editRowIds, setEditRowIds] = useState<string[]>([])
  const [newRow, setNewRow] = useState<any>(null)

  let dataRows = ui.props.rows
  if (ui.props.dataTableName) {
    dataRows = data && data.tables.find((x) => x.tableName === ui.props.dataTableName)?.rows
  }
  if (debouncedSearchTerm) {
    dataRows = dataRows?.filter((dataRow: any) => {
      return JSON.stringify(dataRow).toLowerCase().includes(debouncedSearchTerm)
    }) as any[]
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase())
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const onAddClick = () => {
    setNewRow({} as any)
  }

  const onEditClick = (rowId: string) => {
    editRowIds.push(rowId)
    setEditRowIds((prevEditRowIds) => [...prevEditRowIds, rowId])
  }

  const onEditCancelClick = (rowId: string) => {
    if (!rowId) {
      setNewRow(null)
      return
    }
    setEditRowIds((prevEditRowIds) => prevEditRowIds.filter((x) => x !== rowId))
  }

  const onEditSaveClick = (row: any) => {
    if (data?.saveRow && ui.props.dataTableName) {
      data?.saveRow(ui.props.dataTableName, row)
    }
    onEditCancelClick(row.id)
  }

  const onDeleteClick = (rowId: string) => {
    if (data?.deleteRow && ui.props.dataTableName) {
      data?.deleteRow(ui.props.dataTableName, rowId)
    }
  }

  const isAddMode = !!newRow

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{ui.props.title}</h1>
        {ui.props.canSearch && <input type="text" placeholder="Search..." className="border p-2 rounded w-64" onChange={onSearchChange} />}
      </div>
      <table key={ui.id} className="myTable w-full">
        <thead>
          <tr>
            {ui.props.headers?.map((header: string, index: number) => <th key={index}>{header}</th>)}
            {(ui.props.canEdit || ui.props.canDelete || ui.props.canAdd) && (
              <th>
                {ui.props.canAdd && !isAddMode && (
                  <button
                    onClick={() => {
                      onAddClick()
                    }}
                  >
                    Add
                  </button>
                )}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {dataRows?.map((dataRow: DataRow, index: number) => {
            const isEditMode = !!ui.props.dataTableName && (!dataRow.id || editRowIds.includes(dataRow.id))
            return (
              <AppTableRow
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
          {isAddMode && (
            <AppTableRow
              key={"addRow"}
              ui={ui}
              dataRow={newRow}
              index={"addRow"}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              isEditMode={true}
              data={data}
              onEditCancelClick={onEditCancelClick}
              onEditSaveClick={onEditSaveClick}
            />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AppTable
