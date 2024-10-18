export default interface UIComponentProps {
  id: string
  type: string
  props: any
  children?: UIComponentProps[]
}
