import { useDispatch } from 'react-redux'
import { addNotice } from '../store/actions/add-notice'
import { NoticeMessage } from '../hoc/with-notice'
import { useTranslation } from './use-translation'

/**
 * @memberof useNotice
 * @alias AddNotice
 */
export type AddNotice = (notice: NoticeMessage) => any;

/**
 * @classdesc
 * Hook which allows you to add notice message to the app.
 *
 * ```javascript
 * import { useNotice, Button } from 'adminjs'
 *
 * const myComponent = () => {
 *   const sendNotice = useNotice()
 *   render (
 *     <Button onClick={() => sendNotice({ message: 'I am awesome' })}>I am awesome</Button>
 *   )
 * }
 * ```
 *
 * @class
 * @subcategory Hooks
 * @bundle
 * @hideconstructor
 */
export const useNotice = (): AddNotice => {
  const dispatch = useDispatch()
  const { translateMessage } = useTranslation()
  return (notice): any => dispatch(
    addNotice({
      ...notice,
      message: translateMessage(notice.message, notice.resourceId || '', notice.options),
    }),
  )
}

export default useNotice
