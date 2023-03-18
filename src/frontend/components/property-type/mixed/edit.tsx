import React, { useEffect, useState } from 'react'
import { Section, FormGroup, FormMessage } from '@adminjs/design-system'

import { EditPropertyProps } from '../base-property-props'
import { PropertyLabel } from '../utils/property-label'
import { convertToSubProperty } from './convert-to-sub-property'
import allowOverride from '../../../hoc/allow-override'
import { ErrorMessage, RecordJSON } from '../../../interfaces'
import { useTranslation } from '../../../hooks'

type Props = {
  ItemComponent: typeof React.Component;
}

const Edit: React.FC<Props & EditPropertyProps> = (props) => {
  const { property, record, ItemComponent, onChange } = props

  const { tm } = useTranslation()

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const handleChange = (
    propertyOrRecord: string | RecordJSON,
    value?: any,
    selectedRecord?: RecordJSON | undefined,
  ) => {
    setError(undefined)
    return onChange(
      propertyOrRecord,
      value,
      selectedRecord,
    )
  }

  return (
    <FormGroup error={!!error}>
      <PropertyLabel property={property} />
      <Section {...property.props}>
        {property.subProperties.filter((subProperty) => !subProperty.isId).map((subProperty) => {
          const subPropertyWithPath = convertToSubProperty(property, subProperty)
          return (
            <ItemComponent
              {...props}
              onChange={handleChange}
              key={subPropertyWithPath.path}
              property={subPropertyWithPath}
            />
          )
        })}
      </Section>
      <FormMessage>{error && tm(error.message, error.resourceId || '', error.options)}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(Edit, 'DefaultMixedEditProperty')
