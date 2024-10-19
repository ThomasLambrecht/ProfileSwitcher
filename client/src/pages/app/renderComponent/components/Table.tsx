import React, { ChangeEvent, useEffect, useState } from "react"
import ComponentProps from "../interfaces/ComponentProps"

const Table = ({ ui, data }: ComponentProps): React.ReactNode => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

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
              <button>Add</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((dataRow: any, index: number) => (
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
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
