import React, { FC } from 'react'
import { ValueGroup } from '@adminjs/design-system'

import { ShowPropertyProps } from '../base-property-props'
import allowOverride from '../../../hoc/allow-override'
import PhonePropertyValue from './phone-property-value'
import { useTranslation } from '../../../hooks'

const Show: FC<ShowPropertyProps> = (props) => {
  const { property } = props
  const { translateProperty } = useTranslation()

  return (
    <ValueGroup
      label={translateProperty(property.label, property.resourceId, {
        defaultValue: property.label,
      })}
    >
      <PhonePropertyValue {...props} />
    </ValueGroup>
  )
}

export default allowOverride(Show, 'DefaultPhoneShowProperty')
