import { ValueGroup } from '@adminjs/design-system'
import React, { FC } from 'react'

import { EditPropertyProps } from '../base-property-props'
import formatValue from './format-value'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'

const Show: FC<EditPropertyProps> = (props) => {
  const { property, record } = props
  const { translateProperty } = useTranslation()

  const value = formatValue(record.params[property.path], property.props)

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

export default allowOverride(Show, 'DefaultCurrencyShowProperty')
