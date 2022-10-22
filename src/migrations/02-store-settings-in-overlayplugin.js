import store from "../redux/store/index";

class Migration {
	migrate() {
		return new Promise((resolve, _reject) => {
			const state    = store.getState();
			const service  = state.plugin_service;

			if (!service.plugin_service.isNgld()) {
				resolve();
				return;
			}

			state.settings_data.saveToOverlayPlugin();
			resolve();
		});
	}
}

export default new Migration();
