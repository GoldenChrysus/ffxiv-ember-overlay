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

	resetCallback() {
	}
}

export default OverlayPluginService;