import Settings from "../../data/Settings";
import SocketService from "../../services/SocketService";

const initial_state = {
	character_name : "YOU",
	game           : {},
	viewing        : "tables",
	table_type     : "dps",
	collapsed      : false,
	detail_player  : {},
	overlayplugin  : !!window.OverlayPluginApi,
	socket_service : new SocketService(),
	settings       : new Settings()
};

function rootReducer(state, action) {
	if (!state) {
		state = initial_state;
	}

	let new_data = {};

	new_data[action.key] = action.payload;

	return Object.assign(
		{},
		state,
		new_data
	);
};

export default rootReducer;