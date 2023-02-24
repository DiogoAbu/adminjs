import React, { FC, useState, useEffect, useMemo, useRef, memo } from 'react'
import { FormGroup, FormMessage, SelectAsync } from '@adminjs/design-system'

import ApiClient from '../../../utils/api-client'
import { EditPropertyProps, SelectRecord } from '../base-property-props'
import { FilterSelectCustom, RecordJSON } from '../../../interfaces'
import { PropertyLabel } from '../utils/property-label'
import { flat } from '../../../../utils/flat'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks/use-translation'

type CombinedProps = EditPropertyProps
type SelectRecordEnhanced = SelectRecord & {
  record: RecordJSON;
}

const api = new ApiClient()

const Edit: FC<CombinedProps> = (props) => {
  const { onChange, property, record } = props
  const { reference: resourceId, custom } = property
  const { newFilters, editFilters } = custom as FilterSelectCustom

  const { i18n } = useTranslation()

  const actionType = record?.id ? 'edit' : 'new'

  if (!resourceId) {
    throw new Error(`Cannot reference resource in property '${property.path}'`)
  }

  const selectedId = useMemo(
    () => flat.get(record?.params, property.path) as string | undefined,
    [record],
  )

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

  const [selectedOptionRef, setSelectedOptionRef] = useState({ value: selectedId })
  const selectRef = useRef<object>(null)

  const handleChange = (selected: SelectRecordEnhanced): void => {
    if (selected) {
      onChange(property.path, selected.value, selected.record)
    } else {
      onChange(property.path, null)
    }
    setSelectedOptionRef({ value: selected?.value as string })
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

          const found = data.find(((e) => e.params.locale === i18n.language))?.params?.value
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

  const [selectedOption, setSelectedOption] = useState<SelectRecord | undefined>()
  const [loadingRecord, setLoadingRecord] = useState(0)

  useEffect(() => {
    if (!selectedId) {
      return
    }

    (async () => {
      try {
        setLoadingRecord((c) => c + 1)

        if (custom.propertyOnLocalizedEntity) {
          const data = await api
            .searchRecords({
              resourceId: 'Localized',
              searchProperty: custom.propertyOnLocalizedEntity,
              query: selectedId,
            })

          const found = data.find(((e) => e.params.locale === i18n.language))?.params?.value
          if (found) {
            setSelectedOption({ value: selectedId, label: found })
          }
          return
        }

        const data: any = await api.recordAction({
          actionName: 'show',
          resourceId,
          recordId: selectedId,
        })

        setSelectedOption({ value: selectedId, label: data?.record?.title })
      } finally {
        setLoadingRecord((c) => c - 1)
      }
    })()
  }, [selectedId, resourceId])

  const onFocusRequiredInput = () => {
    if (selectRef.current && 'focus' in selectRef.current && typeof selectRef.current.focus === 'function') {
      selectRef.current.focus()
    }
  }

  const getValueRequiredInput = () => {
    if (selectedId !== undefined && selectedId !== null) {
      return selectedId
    }
    return selectedOptionRef.value || ''
  }

  if (!shouldRender) {
    return null
  }

  return (
    <FormGroup error={Boolean(error)} style={{ position: 'relative' }}>
      <PropertyLabel property={property} />
      <SelectAsync
        cacheOptions
        name={property.name}
        value={selectedOption}
        defaultOptions
        loadOptions={loadOptions}
        onChange={handleChange}
        isClearable
        isDisabled={property.isDisabled}
        isLoading={!!loadingRecord}
        {...property.props}
        // @ts-ignore
        ref={selectRef}
      />
      {property.isRequired && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          aria-required="true"
          autoComplete="off"
          style={{ opacity: 0, width: '100%', height: 0, position: 'absolute' }}
          value={getValueRequiredInput()}
          onChange={() => undefined}
          onFocus={onFocusRequiredInput}
          required
        />
      )}
      <FormMessage>{error?.message}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultReferenceEditProperty')
