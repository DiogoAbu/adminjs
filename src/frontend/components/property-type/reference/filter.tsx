import React, { useState, useEffect } from 'react'
import { FormGroup, Label, SelectAsync } from '@adminjs/design-system'
import acceptLanguageParser from 'accept-language-parser'

import ApiClient from '../../../utils/api-client'
import { FilterPropertyProps, SelectRecord } from '../base-property-props'
import allowOverride from '../../../hoc/allow-override'
import { FilterSelectCustom } from '../../../interfaces'

const api = new ApiClient()

type SelectOptions = Array<{value: string | number; label: string }>

const Filter: React.FC<FilterPropertyProps> = (props) => {
  const { property, filter, onChange } = props
  const { filterFilters } = property.custom as FilterSelectCustom

  const [options, setOptions] = useState<SelectOptions>([])
  const [shouldRender, setShouldRender] = useState(false)
  const [rolesId, setRolesId] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    if (Array.isArray(filterFilters?.roleTypes)) {
      api.searchRecords({
        resourceId: 'Role',
        query: '',
      }).then((data) => {
        const filteredRolesId = data.reduce<string[]>((acc, each) => {
          if (filterFilters!.roleTypes!.includes(each.params.type)) {
            acc.push(each.id)
          }
          return acc
        }, [])
        setRolesId(filteredRolesId)
      }).finally(() => {
        setShouldRender(true)
      })
    } else {
      setShouldRender(true)
    }
  }, [])

  const handleChange = (selected: SelectRecord) => {
    onChange(property.path, selected ? selected.value : '')
  }

  const loadOptions = async (inputValue: string): Promise<SelectOptions> => {
    const records = await api.searchRecords({
      resourceId: property.reference as string,
      query: inputValue,
    })

    const loadedOptions = records.reduce<Promise<SelectRecord[]>>(async (
      accPromise,
      optionRecord,
    ) => {
      const acc = await accPromise

      if (
        rolesId
        && optionRecord.params.role
        && !rolesId.includes(optionRecord.params.role)
      ) {
        return acc
      }

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

      acc.push({
        value: optionRecord.id,
        label,
      })

      return acc
    }, Promise.resolve([]))

    const localizedOptions = await loadedOptions
    setOptions(localizedOptions)

    return localizedOptions
  }

  if (!shouldRender) {
    return null
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
