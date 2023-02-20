import React, { FC } from 'react'
import { ValueGroup } from '@adminjs/design-system'

import { ShowPropertyProps } from '../base-property-props'
import allowOverride from '../../../hoc/allow-override'
import PhonePropertyValue from './phone-property-value'

const Show: FC<ShowPropertyProps> = (props) => {
  const { property } = props
  return (
    <ValueGroup label={property.label}>
      <PhonePropertyValue {...props} />
    </ValueGroup>
  )
}

export default allowOverride(Show, 'DefaultPhoneShowProperty')
