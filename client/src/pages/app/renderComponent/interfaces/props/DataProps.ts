import DataTable from "../graphql/DataTable"

export default interface DataProps {
  tables: DataTable[]
  saveRow?: (tableName: string, row: any) => void
  deleteRow?: (tableName: string, rowId: string) => void
}
