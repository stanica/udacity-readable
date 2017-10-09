import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, compose } from 'redux';
import reducer from './reducers';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(
    //applyMiddleware(logger)
  )
)

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale="en"><BrowserRouter><App /></BrowserRouter></IntlProvider>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
