import store from "../redux/store";

import PluginServiceAbstract from "./PluginService/PluginServiceAbstract";
import OverlayPluginService from "./PluginService/OverlayPluginService";
import OverlayProcService from "./PluginService/OverlayProcService";
import SocketService from "./PluginService/SocketService";
import UsageService from "./UsageService";

class PluginService extends PluginServiceAbstract {
	constructor() {
		super();

		let socket_service        = new SocketService();
		let overlayplugin_service = new OverlayPluginService();
		let settings              = {
			is_overlayplugin : overlayplugin_service.isOverlayPlugin(),
			is_ngld          : overlayplugin_service.isNgld(),
			socket_service   : socket_service
		};
		
		Object.assign(this, settings);

		this.plugin_service = (socket_service.isSocketRequested() && this.is_overlayplugin)
			? socket_service
			: ((this.is_overlayplugin)
				? new OverlayPluginService(settings)
				: new OverlayProcService(settings)
			);
	}

	subscribe() {
		this.plugin_service.subscribe(this.getSubscriptions());
	}

	reprocessSubscriptions() {
		// TODO
	}

	unsubscribe() {
		// TODO
	}

	getSubscriptions() {
		let settings = store.getState().settings_data;
		let data     = {
			enmity : UsageService.usingEnmity(settings)
		};
		let events   = [
			"CombatData",
			"EnmityAggroList",
			"ChangePrimaryPlayer",
			"PartyChanged"
		];

		if (data.enmity) {
			events.push("EnmityTargetData");
		}

		this.events = events;

		return events;
	}
}

export default PluginService;