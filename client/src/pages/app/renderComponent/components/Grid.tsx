import React from "react"
import renderComponent from ".."
import ComponentProps from "../interfaces/ComponentProps"

const CardComponent = ({ ui, data, addData, editData, deleteData }: ComponentProps): React.ReactNode => {
  return (
    <div key={ui.id} className={`grid grid-cols-${ui.props.columns} gap-${ui.props.gap}`}>
      {ui.children?.map((x, index) => <React.Fragment key={index}>{renderComponent(x, data, addData, editData, deleteData)}</React.Fragment>)}
    </div>
  )
}

export default CardComponent
