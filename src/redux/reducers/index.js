import clone from "lodash.clonedeep";

import Settings from "../../data/Settings";
import SocketService from "../../services/SocketService";
import ObjectService from "../../services/ObjectService";

const initial_state = {
	socket_service : new SocketService(),
	settings_data  : Settings,
	internal       : {
		character_name : "YOU",
		rank           : "N/A",
		game           : {},
		detail_player  : {},
		overlayplugin  : !!window.OverlayPluginApi
	},
	settings       : {}
};

function rootReducer(state, action) {
	if (!state) {
		state = initial_state;
	}

	let new_state = false;
	let full_key  = action.key;

	if (action.type === "setSetting") {
		state.settings_data.setSetting(action.key, action.payload);

		full_key = `settings.${action.key}`;
	}

	if (full_key) {
		new_state = clone(state);

		ObjectService.setByKeyPath(new_state, full_key, action.payload);
	}

	return Object.assign(
		{},
		new_state || state
	);
};

export default rootReducer;