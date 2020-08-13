import store from "../redux/store/index";

import MessageProcessor from "../processors/MessageProcessor";
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

	subscribe() {
		let callback = MessageProcessor.processMessage;

		if (!this.is_overlayplugin || !this.is_ngld) {
			document.addEventListener("onOverlayDataUpdate", callback);
			return;
		}

		window.__OverlayCallback = callback;

		window.OverlayPluginApi.callHandler(
			JSON.stringify({
				call   : "subscribe",
				events : [
					"CombatData",
					"EnmityAggroList",
					"EnmityTargetData",
					"ChangePrimaryPlayer",
					"PartyChanged"
				]
			}),
			callback
		);
	}
}

export default PluginService;