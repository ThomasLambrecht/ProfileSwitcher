import ComponentProps from "../interfaces/ComponentProps"

const List = ({ ui, data }: ComponentProps): React.ReactNode => {
  const dataItems = data && data.find((x) => x.name === ui.props.itemsRef)?.rows
  const items = dataItems ? dataItems : ui.props.items

  return (
    <ul key={ui.id} className="list-disc pl-5">
      {items.map((item: any, index: number) => (
        <li key={index}>{item.value}</li>
      ))}
    </ul>
  )
}

export default List
