import React from "react"
import ComponentProps from "../interfaces/ComponentProps"

const Table = ({ ui, data }: ComponentProps): React.ReactNode => {
  let dataRows = ui.props.data
  if (ui.props.dataRef) {
    dataRows = data && data.find((x) => x.name === ui.props.dataRef)?.rows
  }

  return (
    <>
      <h3>{ui.props.title}</h3>
      <table key={ui.id} className="myTable">
        <thead>
          <tr>
            {ui.props.headers.map((header: string, index: number) => (
              <th key={index}>{header}</th>
            ))}
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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Table
