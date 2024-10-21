import ComponentProps from "../interfaces/props/ComponentProps"

const List = ({ ui, data }: ComponentProps): React.ReactNode => {
  const dataRows = data && data.tables.find((x) => x.tableName === ui.props.dataTableName)?.rows
  const uiRows = ui.props.rows
  const items = dataRows ?? uiRows

  return (
    <ul key={ui.id} className="list-disc pl-5">
      {items?.map((item: any, index: number) => <li key={index}>{item.value}</li>)}
    </ul>
  )
}

export default List
