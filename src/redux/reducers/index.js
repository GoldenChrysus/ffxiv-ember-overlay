import clone from "lodash.clonedeep";
import isEqual from "lodash.isequal";

import Settings from "../../data/Settings";
import SocketService from "../../services/SocketService";
import ObjectService from "../../services/ObjectService";
import GameDataProcessor from "../../processors/GameDataProcessor";
import ThemeService from "../../services/ThemeService";
import SampleGameData from "../../constants/SampleGameData";
import SampleHistoryData from "../../constants/SampleHistoryData";
import SampleAggroData from "../../constants/SampleAggroData";

const initial_state = {
	socket_service : new SocketService(),
	settings_data  : Settings,
	last_activity  : (new Date()).getTime() / 1000,
	internal       : {
		viewing              : "tables",
		character_name       : "YOU",
		rank                 : "N/A",
		game                 : {},
		enmity               : {},
		aggro                : [],
		data_history         : {},
		encounter_history    : [],
		detail_player        : {},
		viewing_history      : false,
		overlayplugin        : !!window.OverlayPluginApi,
		overlayplugin_author : (window.OverlayPluginApi && window.OverlayPluginApi.callHandler) ? "ngld" : "hibiyasleep",
		new_version          : false,
	},
	settings : {}
};

function rootReducer(state, action) {
	if (!state) {
		state = initial_state;
	}

	let new_state = false;
	let full_key  = action.key;

	switch (action.type) {
		case "setSetting":
			state.settings_data.setSetting(action.key, action.payload);

			full_key  = `settings.${action.key}`;
			new_state = createNewState(state, full_key, action);

			break;

		case "setSettings":
			new_state = clone(state);

			for (let setting of action.data) {
				new_state.settings_data.setSetting(setting.key, setting.payload, true);

				full_key  = `settings.${setting.key}`;
				new_state = createNewState(new_state, full_key, setting);
			}

			console.log(action);

			new_state.settings_data.saveSettings(true);

			break;

		case "parseGameData":
			let new_history = (
				!action.payload.Encounter ||
				!state.internal.encounter_history.length ||
				!state.internal.encounter_history[0].game.Encounter ||
				+action.payload.Encounter.DURATION < +state.internal.encounter_history[0].game.Encounter.DURATION
			);

			action.payload = GameDataProcessor.normalizeLocales(action.payload, state.settings.interface.language, (new_history) ? undefined : state);
			action.payload = GameDataProcessor.injectEnmity(action.payload, state);

			new_state = createNewState(state, full_key, action);

			if (new_history) {
				if (new_state.internal.encounter_history.length === 5) {
					new_state.internal.encounter_history.pop();
				}

				new_state.internal.encounter_history.unshift({
					game         : {},
					aggro        : [],
					enmity       : {},
					data_history : {}
				});
			}

			GameDataProcessor.appendHistory(action.payload, new_state);

			new_state.internal.encounter_history[0].game = action.payload;

			if ((new_history && !new_state.internal.viewing_history) || !new_state.internal.viewing_history) {
				new_state.internal.game         = new_state.internal.encounter_history[0].game;
				new_state.internal.data_history = new_state.internal.encounter_history[0].data_history;
			}

			break;

		case "loadSampleData":
			let tmp_action = {
				type : "loadSampleData"
			};

			state.internal.data_history = SampleHistoryData;

			tmp_action.payload = GameDataProcessor.normalizeLocales(SampleGameData, state.settings.interface.language, state, true);

			new_state  = createNewState(state, "internal.game", tmp_action);
			tmp_action = {
				payload : GameDataProcessor.normalizeAggroList(SampleAggroData)
			};
			new_state  = createNewState(new_state, "internal.aggro", tmp_action);

			break;

		case "loadHistoryEntry":
			let index = action.payload;

			new_state = clone(state);

			new_state.internal.viewing_history = (index !== 0);

			for (let key in new_state.internal.encounter_history[index]) {
				new_state.internal[key] = new_state.internal.encounter_history[index][key];
			}

			break;

		case "parseEnmity":
			if (!state.internal.encounter_history.length) {
				return state;
			}

			action.payload = GameDataProcessor.processEnmity(action.payload);

			if (isEqual(action.payload, state.internal.encounter_history[0].enmity)) {
				return state;
			}

			new_state = clone(state);

			new_state.internal.encounter_history[0].enmity = action.payload;

			if (!new_state.internal.viewing_history) {
				new_state.internal.enmity = action.payload;
			}

			break;

		case "parseAggroList":
			if (!state.internal.encounter_history.length) {
				return state;
			}

			action.payload = GameDataProcessor.normalizeAggroList(action.payload);
			new_state      = clone(state);

			new_state.internal.encounter_history[0].aggro = action.payload;

			if (!new_state.internal.viewing_history) {
				new_state.internal.aggro = action.payload;
			}

			break;

		default:
			new_state = createNewState(state, full_key, action);
			break;
	}

	return Object.assign(
		{},
		new_state || state
	);
};

function createNewState(state, full_key, action) {
	if (!full_key) {
		return false;
	}

	let new_state = clone(state);

	if (["parseGameData", "loadSampleData"].indexOf(action.type) !== -1) {
		new_state.last_activity = (new Date()).getTime() / 1000;

		if (action.type === "parseGameData") {
			return new_state;
		}
	}

	ObjectService.setByKeyPath(new_state, full_key, action.payload);

	if (["settings", "settings.interface.light_theme"].indexOf(full_key) !== -1) {
		let light_theme = (full_key === "settings") ? action.payload.interface.light_theme : action.payload;

		ThemeService.setTheme({light : light_theme});
	}

	if (["settings", "settings.interface.minimal_theme"].indexOf(full_key) !== -1) {
		let minimal_theme = (full_key === "settings") ? action.payload.interface.minimal_theme : action.payload;

		ThemeService.setTheme({minimal : minimal_theme});
	}

	return new_state;
}

export default rootReducer;