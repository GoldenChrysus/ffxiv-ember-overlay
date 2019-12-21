import clone from "lodash.clonedeep";

import Settings from "../../data/Settings";
import SocketService from "../../services/SocketService";
import ObjectService from "../../services/ObjectService";
import GameDataProcessor from "../../processors/GameDataProcessor";
import ThemeService from "../../services/ThemeService";
import SampleGameData from "../../constants/SampleGameData";
import SampleHistoryData from "../../constants/SampleHistoryData";

const initial_state = {
	socket_service    : new SocketService(),
	settings_data     : Settings,
	last_activity     : (new Date()).getTime() / 1000,
	internal          : {
		viewing                : "tables",
		character_name         : "YOU",
		rank                   : "N/A",
		game                   : {},
		encounter_data_history : {},
		detail_player          : {},
		overlayplugin          : !!window.OverlayPluginApi,
		new_version            : false,
	},
	settings          : {}
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

			new_state.settings_data.saveSettings();

			break;

		case "parseGameData":
			action.payload = GameDataProcessor.normalizeLocales(action.payload, state.settings.interface.language);

			if (!action.payload.Encounter || !state.internal.game.Encounter || +action.payload.Encounter.DURATION < +state.internal.game.Encounter.DURATION) {
				state.internal.encounter_data_history = {};
			}

			GameDataProcessor.appendHistory(action.payload, state);

			new_state = createNewState(state, full_key, action);

			break;

		case "loadSampleData":
			let tmp_action = {
				type : "loadSampleData"
			};

			state.internal.encounter_data_history = SampleHistoryData;

			tmp_action.payload = GameDataProcessor.normalizeLocales(SampleGameData, state.settings.interface.language);

			new_state = createNewState(state, "internal.game", tmp_action);

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

	ObjectService.setByKeyPath(new_state, full_key, action.payload);

	if (["settings", "settings.interface.light_theme"].indexOf(full_key) !== -1) {
		let light_theme = (full_key === "settings") ? action.payload.interface.light_theme : action.payload;

		ThemeService.setTheme(light_theme);
	}

	if (["parseGameData", "loadSampleData"].includes(action.type)) {
		new_state.last_activity = (new Date()).getTime() / 1000;
	}

	return new_state;
}

export default rootReducer;