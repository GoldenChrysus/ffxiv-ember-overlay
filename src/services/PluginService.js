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

		this.events         = [];
		this.plugin_service = (socket_service.isSocketRequested() && this.is_overlayplugin)
			? socket_service
			: ((this.is_overlayplugin)
				? new OverlayPluginService(settings)
				: new OverlayProcService(settings)
			);
	}

	subscribe(events) {
		if (!events) {
			events = this.getSubscriptions();
		}

		this.reprocessSubscriptions(events);

		if (this.new_events.length) {
			this.plugin_service.subscribe(this.new_events);
		}
	}

	reprocessSubscriptions(events) {
		events = events.filter(e => (this.events.indexOf(e) === -1));

		this.new_events = events;

		if (events.length) {
			this.events = this.events.concat(events);
		}
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

		return events;
	}
}

export default PluginService;