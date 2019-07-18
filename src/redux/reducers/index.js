import Settings from "../../data/Settings";

const initial_state = {
	game          : {},
	viewing       : "tables",
	table_type    : "dps",
	collapsed     : false,
	detail_player : {},
	settings      : new Settings()
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