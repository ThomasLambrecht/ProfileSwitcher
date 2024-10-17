/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ComponentProps {
  id: string,
  type: string,
  props: any,
  children?: ComponentProps[]
}

interface DataProps {
  name: string,
  type: string,
  value: any
}

const renderComponent = (component: ComponentProps, data: DataProps[]): React.ReactNode => {
  switch (component.type) {
    case 'Grid':
      return (
        <div
          key={component.id}
          className={`grid grid-cols-${component.props.columns} gap-${component.props.gap}`}
        >
          {component.children?.map((x) => renderComponent(x, data))}
        </div>
      )
    case 'Card':
      return (
        <Card key={component.id}>
          <CardHeader>
            <CardTitle>{component.props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {component.children?.map((x) => renderComponent(x, data))}
          </CardContent>
        </Card>
      )
    case 'Text':
      return <p key={component.id}>{component.props.content}</p>
    case 'List':
      const dataItems = data && data.find(x => x.name === component.props.itemsRef)?.value;
      const items = dataItems ? dataItems : component.props.items;

      return (
        <ul key={component.id} className="list-disc pl-5">
          {items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

export default renderComponent
