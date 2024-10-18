import ComponentProps from "../interfaces/ComponentProps"

const Text = ({ ui }: ComponentProps): React.ReactNode => {
  return <p key={ui.id}>{ui.props.content}</p>
}

export default Text
