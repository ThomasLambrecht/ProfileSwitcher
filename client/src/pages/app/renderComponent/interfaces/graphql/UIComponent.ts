import UIComponentProps from "./UIComponentProps"

export default interface UIComponent {
  id: string
  type: string
  props: UIComponentProps
  children?: UIComponent[]
}
