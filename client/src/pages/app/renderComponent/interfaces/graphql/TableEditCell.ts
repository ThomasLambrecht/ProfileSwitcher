export default interface TableEditCell {
  field: string // The name of the field being updated
  type: string // For a table cell, this can be "textInput" for a text input or "select" for a select list
  referenceTableName: string // For a select list, populate the select list from the reference table data
}
