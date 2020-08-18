import PluginServiceAbstract from "./PluginServiceAbstract";

class OverlayProcService extends PluginServiceAbstract {
	splitEncounter() {
		this.socket_service.splitEncounter();
	}

	subscribe(events) {
		this.socket_service.subscribe(events);
	}

	unsubscribe(events) {
		this.socket_service.unsubscribe(events);
	}
}

export default OverlayProcService;