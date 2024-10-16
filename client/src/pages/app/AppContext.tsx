/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const GET_PAGE = gql`
  query GetPage($name: String!) {
    getPage(name: $name) {
      id
      name
      layout {
        id
        type
        props
        children {
          id
          type
          props
          children {
            id
            type
            props
          }
        }
      }
    }
  }
`

interface ComponentProps {
  id: string
  type: string
  props: any
  children?: ComponentProps[]
}

const renderComponent = (component: ComponentProps): React.ReactNode => {
  switch (component.type) {
    case 'Grid':
      return (
        <div
          key={component.id}
          className={`grid grid-cols-${component.props.columns} gap-${component.props.gap}`}
        >
          {component.children?.map(renderComponent)}
        </div>
      )
    case 'Card':
      return (
        <Card key={component.id}>
          <CardHeader>
            <CardTitle>{component.props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {component.children?.map(renderComponent)}
          </CardContent>
        </Card>
      )
    case 'Text':
      return <p key={component.id}>{component.props.content}</p>
    case 'List':
      return (
        <ul key={component.id} className="list-disc pl-5">
          {component.props.items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

export function AppContext() {
  const { loading, error, data } = useQuery(GET_PAGE, {
    variables: { name: 'home' }
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const page = data.getPage

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">App Context: {page.name}</h1>
      {renderComponent(page.layout)}
    </div>
  )
}