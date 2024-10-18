import ComponentProps from "../interfaces/ComponentProps"

const List = ({ ui, data }: ComponentProps): React.ReactNode => {
  const dataItems = data && data.find((x) => x.name === ui.props.itemsRef)?.value
  const items = dataItems ? dataItems : ui.props.items

  return (
    <ul key={ui.id} className="list-disc pl-5">
      {items.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

export default List
