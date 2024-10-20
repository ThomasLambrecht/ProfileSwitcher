import DataProps from "./DataProps"
import UIComponentProps from "./UIComponentProps"

export default interface ComponentProps {
  ui: UIComponentProps
  data: DataProps[]
  addData?: (dataName: string, row: any) => void
  editData?: (dataName: string, row: any) => void
  deleteData?: (dataName: string, rowId: string) => void
}
