import { applyMiddleware, createStore } from "redux";
import rootReducer from "../reducers/index";
import promise from "redux-promise-middleware";

const storage_key = "redux-local-tab-sync";

function wrapAction(action) {
	return {
		action,
		time : Date.now()
	}
}

function storageMiddleware() {
	return () => next => action => {
		const wrapped_action = wrapAction(action);

		localStorage.setItem(storage_key, JSON.stringify(wrapped_action));
		next(action);
	}
}

export function createStorageListener(store) {
	return () => {
		const wrapped_action = JSON.parse(localStorage.getItem(storage_key));

		if (wrapped_action.action.type === "setSetting" && (wrapped_action.action.source === "screen-component" || !wrapped_action.action.source)) {
			wrapped_action.action.source = "middleware";

			store.dispatch(wrapped_action.action);
		}
	};
}

const middleware = applyMiddleware(promise, storageMiddleware());
const store      = createStore(rootReducer, middleware);

window.addEventListener("storage", createStorageListener(store));

export default store;