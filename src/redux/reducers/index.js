import clone from "lodash.clonedeep";

import Settings from "../../data/Settings";
import SocketService from "../../services/SocketService";
import ObjectService from "../../services/ObjectService";
import GameDataProcessor from "../../processors/GameDataProcessor";
import ThemeService from "../../services/ThemeService";

const initial_state = {
	socket_service : new SocketService(),
	settings_data  : Settings,
	internal       : {
		viewing        : "tables",
		character_name : "YOU",
		rank           : "N/A",
		game           : {},
		detail_player  : {},
		overlayplugin  : !!window.OverlayPluginApi,
		new_version    : false
	},
	settings       : {}
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

		case "parseGameData":
			action.payload = GameDataProcessor.normalizeLocales(action.payload);

			new_state = createNewState(state, full_key, action);

			break;

		case "setSettings":
			new_state = clone(state);

			for (let setting of action.data) {
				new_state.settings_data.setSetting(setting.key, setting.payload, true);

				full_key  = `settings.${setting.key}`;
				new_state = createNewState(new_state, full_key, setting);
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

	ObjectService.setByKeyPath(new_state, full_key, action.payload);

	if (["settings", "settings.interface.light_theme"].indexOf(full_key) !== -1) {
		let light_theme = (full_key === "settings") ? action.payload.interface.light_theme : action.payload;

		ThemeService.setTheme(light_theme);
	}

	return new_state;
}

export default rootReducer;