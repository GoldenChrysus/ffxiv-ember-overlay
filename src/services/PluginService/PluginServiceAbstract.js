import MessageProcessor from "../../processors/MessageProcessor";

class PluginServiceAbstract {
	constructor(settings) {
		if (settings && Object.keys(settings).length) {
			Object.assign(this, settings);
		}
	}

	splitEncounter() {
		this.plugin_service.splitEncounter();
	}

	subscribe(events) {
		let callback = MessageProcessor.processMessage;

		if (!this.is_overlayplugin || !this.is_ngld) {
			document.addEventListener("onOverlayDataUpdate", callback);
			return;
		}

		window.__OverlayCallback = callback;

		window.OverlayPluginApi.callHandler(
			JSON.stringify({
				call   : "subscribe",
				events : events
			}),
			callback
		);
	}
}

export default PluginServiceAbstract;