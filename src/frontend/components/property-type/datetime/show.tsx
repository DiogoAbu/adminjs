import React from 'react'
import { ValueGroup } from '@adminjs/design-system'

import mapValue from './map-value'
import allowOverride from '../../../hoc/allow-override'
import { ShowPropertyProps } from '../base-property-props'
import { DateTimePropertyCustom } from '../../../../frontend/interfaces'
import { useTranslation } from '../../../hooks'

const Show: React.FC<ShowPropertyProps> = (props) => {
  const { property, record } = props
  const custom = property.custom as DateTimePropertyCustom
  const { translateProperty } = useTranslation()

  const value = mapValue(record.params[property.path], property.type, custom.intlOptions)

  return (
    <ValueGroup
      label={translateProperty(property.label, property.resourceId, {
        defaultValue: property.label,
      })}
    >
      {value}
    </ValueGroup>
  )
}

export default allowOverride(Show, 'DefaultDatetimeShowProperty')
