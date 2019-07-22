import store from "../redux/store/index";

import OverlayPluginService from "./PluginService/OverlayPluginService";
import OverlayProcService from "./PluginService/OverlayProcService";

class PluginService {
	constructor() {
		let is_overlayplugin = store.getState().overlayplugin;

		this.plugin_service = (is_overlayplugin) ? new OverlayPluginService() : new OverlayProcService();
	}

	splitEncounter() {
		this.plugin_service.splitEncounter();
	}
}

export default PluginService;