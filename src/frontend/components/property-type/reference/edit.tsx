import React, { FC, useState, useEffect, useMemo, memo } from 'react'
import { FormGroup, FormMessage, SelectAsync } from '@adminjs/design-system'
import acceptLanguageParser from 'accept-language-parser'

import ApiClient from '../../../utils/api-client'
import { EditPropertyProps, SelectRecord } from '../base-property-props'
import { FilterSelectCustom, RecordJSON } from '../../../interfaces'
import { PropertyLabel } from '../utils/property-label'
import { flat } from '../../../../utils/flat'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import allowOverride from '../../../hoc/allow-override'

type CombinedProps = EditPropertyProps
type SelectRecordEnhanced = SelectRecord & {
  record: RecordJSON;
}

const api = new ApiClient()

const Edit: FC<CombinedProps> = (props) => {
  const { onChange, property, record } = props
  const { reference: resourceId, custom } = property
  const { newFilters, editFilters } = custom as FilterSelectCustom

  const actionType = record?.id ? 'edit' : 'new'

  if (!resourceId) {
    throw new Error(`Cannot reference resource in property '${property.path}'`)
  }

  const [shouldRender, setShouldRender] = useState(false)
  const [rolesId, setRolesId] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    if (
      (actionType === 'new' && Array.isArray(newFilters?.roleTypes))
      || (actionType === 'edit' && Array.isArray(editFilters?.roleTypes))
    ) {
      api.searchRecords({
        resourceId: 'Role',
        query: '',
      }).then((data) => {
        const filteredRolesId = data.reduce<string[]>((acc, each) => {
          const filters = actionType === 'new' ? newFilters : editFilters
          if (filters!.roleTypes!.includes(each.params.type)) {
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

  const handleChange = (selected: SelectRecordEnhanced): void => {
    if (selected) {
      onChange(property.path, selected.value, selected.record)
    } else {
      onChange(property.path, null)
    }
  }

  const loadOptions = async (inputValue: string): Promise<SelectRecordEnhanced[]> => {
    const optionRecords = await api.searchRecords({
      resourceId,
      query: inputValue,
    })

    const optionRecordsLocalized = optionRecords.reduce<Promise<SelectRecordEnhanced[]>>(async (
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
        if (custom.propertyOnLocalizedEntity) {
          const data = await api
            .searchRecords({
              resourceId: 'Localized',
              searchProperty: custom.propertyOnLocalizedEntity,
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
        console.error('Reference value on edit action could not get localized value', err)
      }

      acc.push({
        value: optionRecord.id,
        label,
        record: optionRecord,
      })

      return acc
    }, Promise.resolve([]))

    return optionRecordsLocalized
  }
  const error = record?.errors[property.path]

  const selectedId = useMemo(
    () => flat.get(record?.params, property.path) as string | undefined,
    [record],
  )
  const [loadedRecord, setLoadedRecord] = useState<RecordJSON | undefined>()
  const [loadingRecord, setLoadingRecord] = useState(0)

  useEffect(() => {
    if (selectedId) {
      setLoadingRecord((c) => c + 1)
      api.recordAction({
        actionName: 'show',
        resourceId,
        recordId: selectedId,
      }).then(({ data }: any) => {
        setLoadedRecord(data.record)
      }).finally(() => {
        setLoadingRecord((c) => c - 1)
      })
    }
  }, [selectedId, resourceId])

  const selectedValue = loadedRecord
  const selectedOption = (selectedId && selectedValue) ? {
    value: selectedValue.id,
    label: selectedValue.title,
  } : {
    value: '',
    label: '',
  }

  if (!shouldRender) {
    return null
  }

  return (
    <FormGroup error={Boolean(error)}>
      <PropertyLabel property={property} />
      <SelectAsync
        cacheOptions
        value={selectedOption}
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        isClearable
        isDisabled={property.isDisabled}
        isLoading={!!loadingRecord}
        {...property.props}
      />
      <FormMessage>{error?.message}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultReferenceEditProperty')
