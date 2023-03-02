import React, { FC, useState, useEffect, useMemo, useRef, memo } from 'react'
import { FormGroup, FormMessage, SelectAsync } from '@adminjs/design-system'

import { useSelector } from 'react-redux'
import ApiClient from '../../../utils/api-client'
import { EditPropertyProps, SelectRecord } from '../base-property-props'
import { FilterSelectCustom, RecordJSON, ErrorMessage } from '../../../interfaces'
import { PropertyLabel } from '../utils/property-label'
import { flat } from '../../../../utils/flat'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks/use-translation'
import { ReduxState } from '../../../../frontend/store'

type CombinedProps = EditPropertyProps
type SelectRecordEnhanced = SelectRecord & {
  record: RecordJSON;
}

const api = new ApiClient()

const Edit: FC<CombinedProps> = (props) => {
  const { onChange, property, record } = props
  const { reference: resourceId, custom } = property

  const actionType = record?.id ? 'edit' : 'new'

  const { newFilters, editFilters } = custom as FilterSelectCustom
  const selfFilter = (actionType === 'new' && newFilters?.self) || (actionType === 'edit' && editFilters?.self)

  const session = useSelector((state: ReduxState) => state.session)

  const [error, setError] = useState<ErrorMessage >()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const { i18n, translateLabel } = useTranslation()

  if (!resourceId) {
    throw new Error(`Cannot reference resource in property '${property.path}'`)
  }

  const selectedId = useMemo(
    () => flat.get(record?.params, property.path) as string | undefined,
    [record?.params, property.path],
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
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    setSelectedOptionRef({ value: selectedId })
  }, [selectedId])

  const handleChange = (selected: SelectRecordEnhanced): void => {
    setError(undefined)

    if (selected) {
      onChange(property.path, selected.value, selected.record)
    } else {
      onChange(property.path, null)
    }
    setSelectedOptionRef({ value: selected?.value as string })
  }

  const loadOptions = async (inputValue: string): Promise<SelectRecordEnhanced[]> => {
    let optionRecords: RecordJSON[] = []

    if (selfFilter && session?.id) {
      const { data } = await api.recordAction({
        actionName: 'show',
        resourceId,
        recordId: session.id,
      })
      optionRecords = [data.record]
    } else {
      optionRecords = await api.searchRecords({
        resourceId,
        query: inputValue,
      })
    }

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

        const { data } = await api.recordAction({
          actionName: 'show',
          resourceId,
          recordId: selectedId,
        })

        setSelectedOption({ value: selectedId, label: data.record.title })
      } finally {
        setLoadingRecord((c) => c - 1)
      }
    })()
  }, [selectedId, resourceId, custom.propertyOnLocalizedEntity, i18n.language])

  const onFocusRequiredInput = () => {
    selectRef.current?.focus()
  }

  const getValueRequiredInput = () => {
    if (selectedId !== undefined && selectedId !== null) {
      return selectedId
    }
    return selectedOptionRef.value || ''
  }

  useEffect(() => {
    (async () => {
      if (selfFilter && session?.id) {
        const { data } = await api.recordAction({
          actionName: 'show',
          resourceId,
          recordId: session.id,
        })
        handleChange({
          value: data.record.id,
          label: data.record.title,
          record: data.record,
        })
      }
    })()
  }, [])

  if (!shouldRender) {
    return null
  }

  return (
    <FormGroup error={!!error} style={{ position: 'relative' }}>
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
        placeholder={translateLabel('select...', resourceId)}
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
