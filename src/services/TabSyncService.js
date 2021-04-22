class TabSyncService {
	storage_key = "redux-local-tab-sync";

	createStorageListener(store) {
		return () => {
			const wrapped_action = JSON.parse(localStorage.getItem(this.storage_key));

			if (!wrapped_action || typeof wrapped_action !== "object" || !wrapped_action.action) {
				return;
			}
	
			let valid_action = false;
	
			switch (wrapped_action.action.type) {
				case "setSetting":
					valid_action = true;
	
					break;
	
				case "setSettings":
					valid_action = true;
	
					let state = store.getState();

					wrapped_action.action.skip_sync = true;
	
					state
						.settings_data
						.loadSettings()
						.then(() => {
							state.settings_data.saveToOverlayPlugin();
							state.plugin_service.updateSubscriptions(state.settings_data, state.internal);
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

	saveAction(action) {
		if (!window.parser) {
			localStorage.setItem(
				"redux-local-tab-sync",
				JSON.stringify({
					action,
					time : Date.now()
				})
			);
		}
	}
}

export default new TabSyncService();