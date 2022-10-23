import store from "../redux/store";

import PluginServiceAbstract from "./PluginService/PluginServiceAbstract";
import OverlayPluginService from "./PluginService/OverlayPluginService";
import OverlayProcService from "./PluginService/OverlayProcService";
import SocketService from "./PluginService/SocketService";
import UsageService from "./UsageService";
import MessageProcessor from "../processors/MessageProcessor";

class PluginService extends PluginServiceAbstract {
	constructor() {
		super();

		const socket_service        = new SocketService();
		const overlayplugin_service = new OverlayPluginService();
		const settings              = {
			is_websocket     : socket_service.isSocketRequested(),
			is_overlayplugin : overlayplugin_service.isOverlayPlugin(),
			is_ngld          : overlayplugin_service.isNgld(),
			socket_service,
		};

		Object.assign(this, settings);

		this.events         = [];
		this.plugin_service = (this.is_websocket && !this.is_overlayplugin)
			? socket_service
			: ((this.is_overlayplugin)
				? new OverlayPluginService(settings)
				: new OverlayProcService(settings)
			);
	}

	isConnected() {
		return this.plugin_service.is_connected;
	}

	subscribe(events) {
		events = events || this.getSubscriptions();

		this.processSubscriptionAdditions(events);

		if (this.new_events.length) {
			this.plugin_service.subscribe(this.new_events);
		}
	}

	processSubscriptionAdditions(events) {
		events = events.filter(e => (this.events.indexOf(e) === -1));

		this.new_events = events;

		if (events.length) {
			this.events = this.events.concat(events);
		}
	}

	unsubscribe(events) {
		events = events || this.getSubscriptions();

		this.processSubscriptionRemovals(events);

		this.events = events;

		if (this.old_events.length) {
			this.plugin_service.unsubscribe(this.old_events);
		}
	}

	processSubscriptionRemovals(events) {
		events = this.events.filter(e => (events.indexOf(e) === -1));

		this.old_events = events;
	}

	updateSubscriptions(settings_object, internal) {
		const events = this.getSubscriptions(settings_object, internal);

		this.subscribe(events);
		this.unsubscribe(events);
	}

	getSubscriptions(settings_object, internal) {
		const settings = settings_object || store.getState().settings_data;
		const mode     = (internal || store.getState().internal).mode;
		const data     = {
			enmity : UsageService.usingEnmity(settings),
			log    : UsageService.usingLog(mode, settings),
			combat : UsageService.usingCombatData(mode, settings),
		};
		const events   = [
			"ChangePrimaryPlayer",
			"ChangeZone",
		];

		if (data.combat) {
			events.push("CombatData");
		}

		if (mode === "stats") {
			events.push("EnmityAggroList");
			events.push("PartyChanged");
		}

		if (data.enmity) {
			events.push("EnmityTargetData");
		}

		if (data.log) {
			events.push("LogLine");
		}

		return events;
	}

	getCombatants() {
		this.plugin_service.callHandler(this.plugin_service.createMessage("getCombatants"), MessageProcessor.processMessage);
	}

	tts(messages) {
		this.plugin_service.tts(messages);
	}
}

export default PluginService;
