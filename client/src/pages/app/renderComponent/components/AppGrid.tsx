import React from "react"
import renderComponent from ".."
import ComponentProps from "../interfaces/props/ComponentProps"

const AppGrid = ({ ui, data }: ComponentProps): React.ReactNode => {
  return (
    <div key={ui.id} className={`grid grid-cols-${ui.props.columns} gap-${ui.props.gap}`}>
      {ui.children?.map((x, index) => <React.Fragment key={index}>{renderComponent(x, data)}</React.Fragment>)}
    </div>
  )
}

export default AppGrid
