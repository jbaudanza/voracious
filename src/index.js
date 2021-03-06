import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

import MainActions from './mainActions';
import { SubscribableState, StateMapper } from './ruxx';

// Load Kuromoji right away
import { loadKuromoji } from './util/analysis';
loadKuromoji();

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}

// Create state, actions
const subscribableMainState = new SubscribableState();
const actions = new MainActions(subscribableMainState);

ReactDOM.render(<StateMapper subscribableState={subscribableMainState} renderState={state => <App mainState={state} actions={actions} />} />, document.getElementById('root'));
