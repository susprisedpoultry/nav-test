import { compose, createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';


import { createBrowserHistory } from 'history'
import { routerMiddleware, connectRouter } from 'connected-react-router'

export const history = createBrowserHistory()

const middleware = [ routerMiddleware(history) ];

// Add logging for client
if (typeof window !== 'undefined' && window.document) {
	middleware.push(createLogger({collapsed: true}));
}

export default (initialState) => {
	const store = createStore(
		connectRouter(history)(rootReducer),
		initialState,
		compose(applyMiddleware(...middleware))
	);

//	store.runSaga = sagaMiddleware.run;
//	store.close = () => store.dispatch(END);

	return store;
};
