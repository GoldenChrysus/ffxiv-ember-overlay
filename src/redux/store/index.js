import { applyMiddleware, createStore } from "redux";
import rootReducer from "../reducers/index";

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

		if (!window.parser) {
			localStorage.setItem(storage_key, JSON.stringify(wrapped_action));
		}

		next(action);
	}
}

export function createStorageListener(store) {
	return () => {
		const wrapped_action = JSON.parse(localStorage.getItem(storage_key));

		let valid_action = false;

		switch (wrapped_action.action.type) {
			case "setSetting":
				valid_action = true;

				break;

			case "setSettings":
				valid_action = false;

				let state = store.getState();

				state
					.settings_data
					.loadSettings()
					.then(() => {
						state.plugin_service.updateSubscriptions(state.settings_data);
					});
				break;

			case "updateState":
				valid_action = (wrapped_action.action.key === "internal.new_version");

				break;

			default:
				valid_action = false;

				break;
		}

		if (valid_action && window.parser && (wrapped_action.action.source === "screen-component" || !wrapped_action.action.source)) {
			store.dispatch(wrapped_action.action);
		}
	};
}

const middleware = applyMiddleware(storageMiddleware());
const store      = createStore(rootReducer, middleware);

window.addEventListener("storage", createStorageListener(store));

export default store;