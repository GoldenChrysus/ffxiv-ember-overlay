import store from "../redux/store/index";

class Migration {
	migrate() {
		return new Promise((resolve, reject) => {
			let state    = store.getState();
			let service  = state.plugin_service;
			
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