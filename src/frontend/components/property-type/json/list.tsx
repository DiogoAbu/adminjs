import React from 'react'

import { flat } from '../../../../utils/flat'
import { ShowPropertyProps } from '../base-property-props'

const List: React.FC<ShowPropertyProps> = (props) => {
  const { property, record } = props

  const unflattenParams = flat.unflatten<Record<string, any>, any>(record?.params)
  const value = unflattenParams[property.path]

  if (typeof value === 'undefined') {
    return null
  }

  return JSON.stringify(value) as any
}

export default List
