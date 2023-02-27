import React from 'react'
import loadable from '@loadable/component'

import type { ReactJsonViewProps } from 'react-json-view'

import { flat } from '../../../../utils/flat'
import allowOverride from '../../../hoc/allow-override'
import { ShowPropertyProps } from '../base-property-props'

const ReactJson = loadable(() => import('react-json-view'))

const JSONViewer: React.FC<ShowPropertyProps> = (props) => {
  const { property, record } = props

  const unflattenParams = flat.unflatten<Record<string, any>, any>(record?.params)
  const value = unflattenParams[property.path]

  const reactJsonProps: ReactJsonViewProps = {
    src: value,
    name: null,
    groupArraysAfterLength: 50,
    quotesOnKeys: false,
  }

  return <ReactJson {...reactJsonProps} />
}

export default allowOverride(JSONViewer, 'JSONViewer')
