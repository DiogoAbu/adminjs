import { FormGroup, FormMessage, RichTextEditor } from '@adminjs/design-system'
import React, { FC, memo, useCallback, useEffect, useState } from 'react'

import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel } from '../utils/property-label'
import allowOverride from '../../../hoc/allow-override'
import { ErrorMessage } from '../../../interfaces'
import { useTranslation } from '../../../hooks'

const Edit: FC<EditPropertyProps> = (props) => {
  const { property, record, onChange } = props
  const value = record.params?.[property.path]

  const { tm } = useTranslation()

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const handleUpdate = useCallback((newValue: string) => {
    setError(undefined)
    onChange(property.path, newValue)
  }, [])

  return (
    <FormGroup error={!!error}>
      <PropertyLabel property={property} />
      <RichTextEditor value={value} onChange={handleUpdate} options={property.props} />
      <FormMessage>{error && tm(error.message, error.resourceId || '', error.options)}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultRichtextEditProperty')
