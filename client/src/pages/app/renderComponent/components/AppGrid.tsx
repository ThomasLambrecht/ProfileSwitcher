import React from "react"
import renderComponent from ".."
import ComponentProps from "../interfaces/props/ComponentProps"

// tailwind doesn't support dynamic classes, so we need these functions as a workaround
const columnClass = (columns?: number) => {
  switch (columns) {
    case 1:
      return "grid-cols-1"
    case 2:
      return "grid-cols-2"
    // TODO: other column sizes
  }
  return ""
}

const gapClass = (gap?: number) => {
  switch (gap) {
    case 4:
      return "gap-4"
    // TODO: other gap sizes
  }
  return ""
}

const AppGrid = ({ ui, data }: ComponentProps): React.ReactNode => {
  return (
    <div key={ui.id} className={`grid ${columnClass(ui.props.columns)} ${gapClass(ui.props.gap)}`}>
      {ui.children?.map((x, index) => <React.Fragment key={index}>{renderComponent(x, data)}</React.Fragment>)}
    </div>
  )
}

export default AppGrid
