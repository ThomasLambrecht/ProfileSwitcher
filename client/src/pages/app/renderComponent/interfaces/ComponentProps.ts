import DataProps from "./DataProps"
import UIComponentProps from "./UIComponentProps"

export default interface ComponentProps {
  ui: UIComponentProps
  data: DataProps[]
  deleteData?: (dataName: string, rowId: string) => void
}
