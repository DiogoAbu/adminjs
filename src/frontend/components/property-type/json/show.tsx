import React from 'react'
import { ValueGroup } from '@adminjs/design-system'

import { ShowPropertyProps } from '../base-property-props'
import JsonViewer from './json-viewer'

const Show: React.FC<ShowPropertyProps> = (props) => {
  const { property } = props

  return (
    <ValueGroup label={property.label}>
      <JsonViewer {...props} />
    </ValueGroup>
  )
}

export default Show
