import { Label, LabelProps } from '@adminjs/design-system'
import React, { RefObject } from 'react'

import { PropertyJSON } from '../../../../interfaces'
import { PropertyDescription } from '../property-description'
import allowOverride from '../../../../hoc/allow-override'
import { useTranslation } from '../../../../hooks'
import { PropertyLengthCounter, PropertyLengthCounterRef } from '../property-length-counter'

export type PropertyLabelProps = {
  property: PropertyJSON;
  props?: LabelProps;
  counterRef?: RefObject<PropertyLengthCounterRef>
}

const PropertyLabel: React.FC<PropertyLabelProps> = (props) => {
  const { property, props: labelProps, counterRef } = props
  const { translateProperty } = useTranslation()

  if (property.hideLabel) { return null }

  return (
    <Label
      htmlFor={property.path}
      required={property.isRequired}
      {...labelProps}
    >
      {translateProperty(property.label, property.resourceId, { defaultValue: property.label })}
      {property.description && <PropertyDescription property={property} />}
      {property.props.maxLength && <PropertyLengthCounter property={property} ref={counterRef} />}
    </Label>
  )
}

const OverridablePropertyLabel = allowOverride(PropertyLabel, 'PropertyLabel')

export {
  OverridablePropertyLabel as default,
  OverridablePropertyLabel as PropertyLabel,
}
