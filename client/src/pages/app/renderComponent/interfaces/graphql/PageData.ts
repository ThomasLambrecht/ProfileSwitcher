import DataTable from "./DataTable"

export default interface PageData {
  id: string
  pageName: string
  tables: DataTable[]
}
