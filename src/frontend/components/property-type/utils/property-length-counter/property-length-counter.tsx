import { Text } from '@adminjs/design-system'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { PropertyJSON } from '../../../../interfaces'
import allowOverride from '../../../../hoc/allow-override'

export type PropertyLengthCounterRef = {
  updateLength: (newLength: number) => void;
}

export type PropertyLengthCounterProps = {
  property: PropertyJSON;
}

export const PropertyLengthCounter = forwardRef<
  PropertyLengthCounterRef, PropertyLengthCounterProps
>(
  (props, ref) => {
    const { property } = props

    const [length, setLength] = useState(0)

    useImperativeHandle(
      ref,
      () => ({
        updateLength(newLength) {
          setLength(newLength)
        },
      }),
      [],
    )

    return (
      <Text as="span" variant="sm" color="grey80" style={{ float: 'right' }}>
        {length}
        /
        {property.props.maxLength}
      </Text>
    )
  },
)

export default PropertyLengthCounter
