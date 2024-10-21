import DataRow from "./DataRow"

export default interface DataTable {
  tableName: string
  rows: DataRow[]
}
