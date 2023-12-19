/* @refresh reload */
import { render } from 'solid-js/web'
// import { attachReduxDevTools } from "@effector/redux-devtools-adapter";

// attachReduxDevTools();

import './index.css'
import App from './App'

const root = document.getElementById('root')

render(() => <App />, root!)
