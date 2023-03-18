import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import { Button, Section, FormGroup, FormMessage, Icon, Box } from '@adminjs/design-system'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

import AddNewItemButton from './add-new-item-translation'
import { flat } from '../../../../utils'
import { EditPropertyPropsInArray } from '../base-property-props'
import { PropertyLabel } from '../utils/property-label'
import { convertToSubProperty } from './convert-to-sub-property'
import { ErrorMessage, PropertyJSON } from '../../../interfaces'
import { removeSubProperty } from './remove-sub-property'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'

type EditProps = Required<EditPropertyPropsInArray>

type ItemRendererProps = {
  onDelete: (event: MouseEvent, property: PropertyJSON) => boolean;
  index: number;
  isDraggable: boolean;
}

const ItemRenderer: React.FC<EditProps & ItemRendererProps> = (props) => {
  const { ItemComponent, property, onDelete, index, record, isDraggable } = props
  const uniqueDraggableId = window.btoa(unescape(encodeURIComponent(`${JSON.stringify(flat.get(record.params, property.path))}-${property.path}`)))

  return (
    <Draggable
      draggableId={uniqueDraggableId}
      index={index}
      key={uniqueDraggableId}
      isDragDisabled={!isDraggable}
    >
      {(provided): JSX.Element => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          backgroundColor="white"
          flex
          flexDirection="row"
          alignItems="center"
          data-testid={property.path}
        >
          <Box flexGrow={1}>
            <ItemComponent {...props} />
          </Box>
          <Box flexShrink={0} ml="lg">
            <Button
              rounded
              ml="default"
              data-testid="delete-item"
              type="button"
              size="icon"
              onClick={(event): boolean => onDelete(event, property)}
              variant="danger"
            >
              <Icon icon="TrashCan" />
            </Button>
          </Box>
        </Box>
      )}
    </Draggable>
  )
}

const InputsInSection: React.FC<EditProps & {
  setError: React.Dispatch<React.SetStateAction<ErrorMessage | undefined>>
}> = (props) => {
  const { property, record, resource, onChange, setError } = props
  const items = flat.get(record.params, property.path) || []

  const addNew = useCallback((event: MouseEvent): boolean => {
    const newItems = [
      ...items,
      property.subProperties.length ? {} : '',
    ]
    setError(undefined)
    onChange(property.path, newItems)
    event.preventDefault()
    return false
  }, [record, onChange, property])

  const removeItem = useCallback((event: MouseEvent, subProperty: PropertyJSON): boolean => {
    const newRecord = removeSubProperty(record, subProperty.path)
    setError(undefined)
    onChange(newRecord)
    event.preventDefault()
    return false
  }, [record, onChange, property])

  const handleOnDragEnd = useCallback((result: DropResult): void => {
    const { source, destination } = result

    if (!source || !destination || destination.index === source.index) return

    const itemsCopy = Array.from(items)
    const [sourceItem] = itemsCopy.splice(source.index, 1)
    itemsCopy.splice(destination.index, 0, sourceItem)

    setError(undefined)
    onChange(property.path, itemsCopy)
  }, [record, onChange, property])

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId={property.path}>
        {(provided): JSX.Element => (
          <Section
            ref={provided.innerRef}
            {...provided.droppableProps}
            mt="xl"
            className={property.path}
          >
            {items.map((item, i) => {
              const itemProperty = convertToSubProperty(property, i)
              return (
                <ItemRenderer
                  {...props}
                  property={itemProperty}
                  isDraggable={property.isDraggable}
                  key={itemProperty.path}
                  onDelete={removeItem}
                  index={i}
                />
              )
            })}
            {provided.placeholder}
            <Button onClick={addNew} type="button" rounded>
              <AddNewItemButton resource={resource} property={property} />
            </Button>
          </Section>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const Edit: React.FC<EditProps> = (props) => {
  const { property, record, testId } = props

  const { tm } = useTranslation()

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.propertyPath])
  }, [record.errors?.[property.propertyPath]])

  return (
    <FormGroup error={!!error} data-testid={testId}>
      <PropertyLabel property={property} />
      <InputsInSection {...props} setError={setError} />
      <FormMessage>{error && tm(error.message, error.resourceId || '', error.options)}</FormMessage>
    </FormGroup>
  )
}

const OverridableEdit = allowOverride(Edit, 'DefaultArrayEditProperty')

export {
  OverridableEdit as default,
  OverridableEdit as Edit,
}
