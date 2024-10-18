export default interface ComponentProps {
  id: string;
  type: string;
  props: any;
  children?: ComponentProps[];
}
