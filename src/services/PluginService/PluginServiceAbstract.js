import MessageProcessor from "../../processors/MessageProcessor";

class PluginServiceAbstract {
	constructor(settings) {
		if (settings && Object.keys(settings).length) {
			Object.assign(this, settings);
		}

		this.subscribed = false;
	}

	splitEncounter() {
		this.plugin_service.splitEncounter();
	}

	subscribe(events) {
		this.subscribed = true;

		let callback = MessageProcessor.processMessage;

		if (!this.is_overlayplugin || !this.is_ngld) {
			if (this.subscribed) {
				return;
			}

			document.addEventListener("onOverlayDataUpdate", callback);
			return;
		}

		if (!this.subscribed) {
			window.__OverlayCallback = callback;
		}

		this.callHandler(this.plugin_service.createMessage("subscribe", "events", events), callback);
	}

	unsubscribe(events) {
		this.callHandler(this.plugin_service.createMessage("unsubscribe", "events", events));
	}

	callHandler(message, callback) {
		window.OverlayPluginApi.callHandler(
			message,
			callback
		);
	}
}

export default PluginServiceAbstract;