import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import acceptLanguageParser from 'accept-language-parser'

import App from './components/application'
import BasePropertyComponent, { CleanPropertyComponent } from './components/property-type'
import createStore from './store/store'
import ViewHelpers from '../backend/utils/view-helpers/view-helpers'
import * as AppComponents from './components/app'
import * as Hooks from './hooks'
import ApiClient from './utils/api-client'
import withNotice from './hoc/with-notice'
import { flat } from '../utils/flat'
import { combineTranslations, locales } from '../locale'

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
}

const store = createStore(window.REDUX_STATE)
const theme = window.THEME

// Pick best language based on available and what the user`s browser wants
const language = acceptLanguageParser.pick(
  window.AVAILABLE_LANGUAGES.map(({ locale }) => locale),
  window.navigator.languages.join(','),
  { loose: true },
)
const defaultTranslations = locales[language]?.translations || locales.en.translations
const customTranslations = window.LOCALES?.[language]?.translations

const locale = {
  name: locales[language]?.name || locales.en.name,
  language,
  translations: combineTranslations(defaultTranslations, customTranslations),
}

i18n.use(initReactI18next).init({
  lng: locale.language,
  resources: {
    [locale.language]: {
      translation: locale.translations,
    },
  },
  interpolation: { escapeValue: false },
})

const Application = (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
)

// eslint-disable-next-line no-undef
window.regeneratorRuntime = regeneratorRuntime

export default {
  withNotice,
  Application,
  ViewHelpers,
  UserComponents: {},
  ApiClient,
  BasePropertyComponent,
  CleanPropertyComponent,
  env,
  ...AppComponents,
  ...Hooks,
  flat,
}
