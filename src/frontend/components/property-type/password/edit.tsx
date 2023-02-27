/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, memo, useEffect } from 'react'
import { Input, FormGroup, InputGroup, FormMessage, Button, Icon } from '@adminjs/design-system'

import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel } from '../utils/property-label'
import allowOverride from '../../../hoc/allow-override'
import { ErrorMessage } from '../../../interfaces'

const Edit: React.FC<EditPropertyProps> = (props) => {
  const { property, record, onChange } = props
  const propValue = record.params[property.path]
  const [value, setValue] = useState(propValue)
  const [isInput, setIsInput] = useState(false)

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const handleChange = () => {
    setError(undefined)
    onChange(property.path, value)
  }

  useEffect(() => {
    if (value !== propValue) {
      setValue(propValue)
    }
  }, [propValue])

  return (
    <FormGroup error={!!error}>
      <PropertyLabel property={property} />
      <InputGroup>
        <Input
          type={isInput ? 'input' : 'password'}
          className="input"
          id={property.path}
          name={property.path}
          onChange={(event) => setValue(event.target.value)}
          onBlur={handleChange}
          onKeyDown={(e) => e.keyCode === 13 && handleChange()}
          value={value ?? ''}
          disabled={property.isDisabled}
          required={property.isRequired}
          {...property.props}
        />
        <Button
          variant={isInput ? 'primary' : 'text'}
          type="button"
          size="icon"
          onClick={() => setIsInput(!isInput)}
        >
          <Icon icon="View" />
        </Button>
      </InputGroup>
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultPasswordEditProperty')
