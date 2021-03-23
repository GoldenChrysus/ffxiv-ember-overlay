import MessageProcessor from "../../processors/MessageProcessor";

class PluginServiceAbstract {
	constructor(settings) {
		if (settings && Object.keys(settings).length) {
			Object.assign(this, settings);
		}

		this.subscribed   = false;
		this.is_connected = true;
	}

	splitEncounter() {
		this.plugin_service.splitEncounter();
	}

	subscribe(events) {
		let callback = MessageProcessor.processMessage;

		if (!this.is_overlayplugin || !this.is_ngld) {
			if (this.subscribed) {
				return;
			}

			this.subscribed = true;

			document.addEventListener("onOverlayDataUpdate", callback);
			return;
		}

		if (!this.subscribed) {
			window.__OverlayCallback = callback;
		}

		this.subscribed = true;

		this.callHandler(this.createMessage("subscribe", "events", events), callback);
	}

	unsubscribe(events) {
		if (!this.is_overlayplugin || !this.is_ngld) {
			return;
		}

		this.callHandler(this.createMessage("unsubscribe", "events", events));
	}

	callHandler(message, callback) {
		window.OverlayPluginApi.callHandler(
			message,
			callback
		);
	}

	tts(messages) {
		if (!this.is_overlayplugin || !this.is_ngld) {
			return;
		}

		this.callHandler(this.createMessage("say", "text", messages));
	}
}

export default PluginServiceAbstract;