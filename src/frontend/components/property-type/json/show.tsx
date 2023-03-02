import React from 'react'
import { ValueGroup } from '@adminjs/design-system'

import { ShowPropertyProps } from '../base-property-props'
import { useTranslation } from '../../../hooks'
import JsonViewer from './json-viewer'

const Show: React.FC<ShowPropertyProps> = (props) => {
  const { property } = props
  const { translateProperty } = useTranslation()

  return (
    <ValueGroup
      label={translateProperty(property.label, property.resourceId, {
        defaultValue: property.label,
      })}
    >
      <JsonViewer {...props} />
    </ValueGroup>
  )
}

export default Show
