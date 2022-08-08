import React from 'react'
import ReactDOM from 'react-dom'
import { SpeechProvider } from '@speechly/react-client'

import { Provider } from './context/context'
import App from './App'
import './index.css'

ReactDOM.render(
  <SpeechProvider appId='45a6fd0a-3cac-4a58-a72a-1277e1669355' language='en-US'>
    <Provider>
      <App />
    </Provider>
  </SpeechProvider>,

  document.getElementById('root')
)
