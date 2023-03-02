import { Box, Icon, Tooltip } from '@adminjs/design-system'
import React from 'react'

import { PropertyJSON } from '../../../../interfaces'
import allowOverride from '../../../../hoc/allow-override'
import { useTranslation } from '../../../../hooks'

export type PropertyDescriptionProps = {
  property: PropertyJSON;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = (props) => {
  const { property } = props
  const { translateMessage } = useTranslation()

  if (!property.description) { return null }
  const direction = property.custom?.tooltipDirection || 'top'

  return (
    <Box mx="sm" display="inline-flex">
      <Tooltip
        direction={direction}
        title={translateMessage(property.description, property.resourceId, {
          defaultValue: property.description,
        })}
        size="lg"
      >
        <Box>
          <Icon icon="Help" color="info" />
        </Box>
      </Tooltip>
    </Box>
  )
}

const OverridablePropertyDescription = allowOverride(PropertyDescription, 'PropertyDescription')

export {
  OverridablePropertyDescription as default,
  OverridablePropertyDescription as PropertyDescription,
}
