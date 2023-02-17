import React, { useState } from 'react'
import { FormGroup, Label, SelectAsync } from '@adminjs/design-system'
import acceptLanguageParser from 'accept-language-parser'

import ApiClient from '../../../utils/api-client'
import { FilterPropertyProps, SelectRecord } from '../base-property-props'
import allowOverride from '../../../hoc/allow-override'

type SelectOptions = Array<{value: string | number; label: string }>

const Filter: React.FC<FilterPropertyProps> = (props) => {
  const { property, filter, onChange } = props
  const [options, setOptions] = useState<SelectOptions>([])

  const handleChange = (selected: SelectRecord) => {
    onChange(property.path, selected ? selected.value : '')
  }

  const loadOptions = async (inputValue: string): Promise<SelectOptions> => {
    const api = new ApiClient()
    const records = await api.searchRecords({
      resourceId: property.reference as string,
      query: inputValue,
    })

    const loadedOptions = records.map(async (optionRecord) => {
      let label = optionRecord.title

      try {
        if (property.custom.propertyOnLocalizedEntity) {
          const data = await api
            .searchRecords({
              resourceId: 'Localized',
              searchProperty: property.custom.propertyOnLocalizedEntity,
              query: optionRecord.id,
            })

          const locale = acceptLanguageParser.pick(
            data.map((e) => e.params.locale),
            window.navigator.languages.join(','),
            { loose: true },
          )

          const found = data.find(((e) => e.params.locale === locale))?.params?.value
          if (found) {
            label = found
          }
        }
      } catch (err) {
        console.error('Reference value on filter could not get localized value', err)
      }

      return {
        value: optionRecord.id,
        label,
      }
    })
    const localizedOptions = await Promise.all(loadedOptions)
    setOptions(localizedOptions)

    return localizedOptions
  }

  const value = typeof filter[property.path] === 'undefined' ? '' : filter[property.path]
  const selected = (options || []).find((o) => String(o.value) === String(value))

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <SelectAsync
        variant="filter"
        value={typeof selected === 'undefined' ? '' : selected}
        isClearable
        cacheOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        defaultOptions
      />
    </FormGroup>
  )
}

export default allowOverride(Filter, 'DefaultReferenceFilterProperty')
