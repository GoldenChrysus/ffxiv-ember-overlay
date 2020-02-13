import store from "../redux/store/index";

import OverlayPluginService from "./PluginService/OverlayPluginService";
import OverlayProcService from "./PluginService/OverlayProcService";

class PluginService {
	constructor() {
		let state = store.getState();

		this.is_overlayplugin = state.internal.overlayplugin;
		this.is_ngld          = (state.internal.overlayplugin_author === "ngld");

		this.plugin_service = (this.is_overlayplugin) ? new OverlayPluginService() : new OverlayProcService();
	}

	splitEncounter() {
		this.plugin_service.splitEncounter();
	}

	subscribe(callback) {
		if (String(window.location.search).indexOf("HOST_PORT") === -1) {
			document.addEventListener("onOverlayDataUpdate", callback);
		}

		if (!this.is_overlayplugin || !this.is_ngld) {
			return;
		}

		window.OverlayPluginApi.callHandler(
			JSON.stringify({
				call   : "subscribe",
				events : [
					"EnmityAggroList",
					"ChangePrimaryPlayer"
				]
			}),
			callback
		);
	}
}

export default PluginService;