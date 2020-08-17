import PluginServiceAbstract from "./PluginServiceAbstract";

class OverlayPluginService extends PluginServiceAbstract {
	splitEncounter() {
		window.OverlayPluginApi.endEncounter();
	}

	getAuthor() {
		return (window.OverlayPluginApi && window.OverlayPluginApi.callHandler) ? "ngld" : "hibiyasleep";
	}

	isNgld() {
		return (this.getAuthor() === "ngld");
	}

	isOverlayPlugin() {
		return (!!window.OverlayPluginApi);
	}

	createMessage(type, key, data) {
		let call = {
			call : type
		};

		if (key) {
			call[key] = data;
		}

		return JSON.stringify(call);
	}
}

export default OverlayPluginService;