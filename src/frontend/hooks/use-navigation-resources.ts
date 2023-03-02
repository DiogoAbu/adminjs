import { useNavigate, useLocation } from 'react-router'
/* eslint-disable no-param-reassign */
import {
  NavigationProps,
  NavigationElementProps,
  NavigationElementWithChildrenProps,
} from '@adminjs/design-system'
import { useMemo } from 'react'
import { ResourceJSON } from '../interfaces'
import useLocalStorage from './use-local-storage/use-local-storage'
import useTranslation from './use-translation'

const isSelected = (href, location): boolean => {
  const regExp = new RegExp(`${href}($|/)`)
  return !!location.pathname.match(regExp)
}

export function useNavigationResources(
  resources: Array<ResourceJSON>,
): NavigationProps['elements'] {
  const [openElements, setOpenElements] = useLocalStorage<Record<string, boolean>>('sidebarElements', {})
  const navigate = useNavigate()
  const location = useLocation()
  const { translateLabel } = useTranslation()

  const enrichResource = useMemo(() => (
    resource: ResourceJSON,
    icon?: string,
  ): NavigationElementWithChildrenProps => ({
    href: resource.href || undefined,
    icon,
    isSelected: isSelected(resource.href, location),
    label: translateLabel(resource.name, resource.id),
    id: resource.id,
    onClick: (event): void => {
      if (resource.href) {
        event.preventDefault()
        navigate(resource.href)
      }
    },
  }), [location, navigate, translateLabel])

  // grouping resources into parents
  const map = resources
    // first filter out resources which are not visible
    .filter((res) => res.href && res.navigation?.show !== false)
    .reduce((memo, resource) => {
      // in case resource has the same name as parent we namespace it wit "resource-""
      const key = resource.navigation?.name || ['resource', resource.name].join('-')

      if (!resource.navigation || resource.navigation.name === null) {
        memo[key] = enrichResource(resource, resource.navigation?.icon)
      } else if (memo[key] && memo[key].elements && resource.navigation?.name) {
        (memo[key].elements as Array<NavigationElementProps>).push(enrichResource(resource))
      } else {
        memo[key] = {
          elements: [enrichResource(resource)],
          label: translateLabel(resource.navigation?.name, resource.id),
          icon: resource.navigation?.icon,
          onClick: (): void => setOpenElements({
            ...openElements,
            [key]: !openElements[key],
          }),
          isOpen: !!openElements[key],
        }
      }
      return memo
    }, {} as Record<string, NavigationElementWithChildrenProps>)

  return Object.values(map)
}

export default useNavigationResources
