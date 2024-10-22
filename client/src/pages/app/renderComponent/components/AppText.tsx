import ComponentProps from "../interfaces/props/ComponentProps"

const AppText = ({ ui }: ComponentProps): React.ReactNode => {
  return <p key={ui.id}>{ui.props.content}</p>
}

export default AppText
