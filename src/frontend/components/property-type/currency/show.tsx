import { ValueGroup } from '@adminjs/design-system'
import React, { FC } from 'react'

import { EditPropertyProps } from '../base-property-props'
import formatValue from './format-value'
import allowOverride from '../../../hoc/allow-override'

const Show: FC<EditPropertyProps> = (props) => {
  const { property, record } = props
  const value = formatValue(record.params[property.path], property.props)

  return (
    <ValueGroup label={property.label}>
      {value}
    </ValueGroup>
  )
}

export default allowOverride(Show, 'DefaultCurrencyShowProperty')
