export default interface TableViewCell {
  fields: string[] // For a table, there can be multiple fields per cell. E.g. Modified By and Date Modified in one cell.
}
