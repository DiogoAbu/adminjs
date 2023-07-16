import React, { useEffect, useState } from 'react'
import { Link, Icon } from '@adminjs/design-system'

import ViewHelpers from '../../../../backend/utils/view-helpers/view-helpers'
import allowOverride from '../../../hoc/allow-override'
import { ShowPropertyProps } from '../base-property-props'
import { ApiClient } from '../../../../frontend/utils'
import { useTranslation } from '../../../hooks/use-translation'

type Props = Pick<ShowPropertyProps, 'property' | 'record'>

const ReferenceValue: React.FC<Props> = (props) => {
  const { property, record } = props

  const { i18n } = useTranslation()

  const [localizedValue, setLocalizedValue] = useState('')

  useEffect(() => {
    if (!record.params[property.path] || !property.custom.propertyOnLocalizedEntity) {
      console.error('No localized property found', property.path, property.custom.propertyOnLocalizedEntity)
      return
    }

    const api = new ApiClient()
    api
      .searchRecords({
        resourceId: 'Localized',
        searchProperty: property.custom.propertyOnLocalizedEntity,
        query: record.params[property.path],
      })
      .then((data) => {
        const found = data.find((e) => e.params.locale === i18n.language && !!e.params.value)
          ?? data.find((e) => !!e.params.value)
          ?? data[0]
        setLocalizedValue(found?.params?.value)
      })
      .catch((err) => {
        console.error('Reference value could not get localized value', err)
      })
  }, [])

  const h = new ViewHelpers()
  const refId = record.params[property.path]
  const populated = record.populated[property.path]
  const value = localizedValue || (populated && populated.title) || refId

  if (!property.reference) {
    throw new Error(`property: "${property.path}" does not have a reference`)
  }

  if (populated && populated.recordActions.find((a) => a.name === 'show')) {
    const href = h.recordActionUrl({
      resourceId: property.reference, recordId: refId, actionName: 'show',
    })
    return (
      <Link variant="secondary" href={href}>
        {value}
        <Icon icon="Link" ml="sm" />
      </Link>
    )
  }
  return (
    <span>{value}</span>
  )
}

export default allowOverride(ReferenceValue, 'DefaultReferenceValue')
