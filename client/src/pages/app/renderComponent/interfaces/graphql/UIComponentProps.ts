import DataRow from "./DataRow"

interface TableViewCell {
  fields: string[] // For a table, there can be multiple fields per cell. E.g. Modified By and Date Modified in one cell.
}

interface TableEditCell {
  field: string // The name of the field being updated
  type: string // For a table cell, this can be "textInput" for a text input or "select" for a select list
  referenceTableName: string // For a select list, populate the select list from the reference table data
  referenceData: "iterationStatus"
}

export default interface UIComponentProps {
  canAdd?: boolean // Can add component (i.e. table row)
  canEdit?: boolean // Can edit component (i.e. table row)
  canDelete?: boolean // Can delete component (i.e. table row)
  canSearch?: boolean // Can search component (i.e. table row)
  title?: string // Title of component displayed to user
  headers?: string[] // Headers of a table
  dataTableName?: string // Name of data table
  tableViewCells?: TableViewCell[] // For a table, these are the column cells that show for view mode
  tableEditCells?: TableEditCell[] // For a table, these are the column cells that need to be updated (i.e. we don't want to update modified date in UI)
  rows?: DataRow[] // Table rows (for when hardcoding the table rows instead of using dataTableName to populate the rows)
  content?: any // Content of the component (for Card content)
  columns?: number // Column size (of Grid component)
  gap?: number // Gap size (of Grid component)
}
