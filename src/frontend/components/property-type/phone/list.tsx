import React, { FC } from 'react'

import allowOverride from '../../../hoc/allow-override'
import { ShowPropertyProps } from '../base-property-props'
import PhonePropertyValue from './phone-property-value'

const List: FC<ShowPropertyProps> = (props) => <PhonePropertyValue {...props} />

export default allowOverride(List, 'DefaultPhoneListProperty')
