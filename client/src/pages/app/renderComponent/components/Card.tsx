import React from "react"
import renderComponent from ".."
import ComponentProps from "../interfaces/props/ComponentProps"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CardComponent = ({ ui, data }: ComponentProps): React.ReactNode => {
  return (
    <Card key={ui.id}>
      <CardHeader>
        <CardTitle>{ui.props.title}</CardTitle>
      </CardHeader>
      <CardContent>{ui.children?.map((x, index) => <React.Fragment key={index}>{renderComponent(x, data)}</React.Fragment>)}</CardContent>
    </Card>
  )
}

export default CardComponent
