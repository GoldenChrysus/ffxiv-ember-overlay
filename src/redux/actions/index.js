export function parseGameData(payload) {
	return {
		type : "parseGameData",
		key  : "internal.game",
		payload,
	};
}

export function loadSampleGameData() {
	return {
		type : "loadSampleData",
	};
}

export function loadHistoryEntry(payload) {
	return {
		type : "loadHistoryEntry",
		payload,
	};
}

export function clearGameData() {
	return parseGameData({});
}

export function parseEnmity(payload) {
	return {
		type : "parseEnmity",
		key  : "internal.enmity",
		payload,
	};
}

export function parseAggroList(payload) {
	return {
		type : "parseAggroList",
		key  : "internal.aggro",
		payload,
	};
}

export function parseParty(payload) {
	return {
		type : "parseParty",
		key  : "internal.party",
		payload,
	};
}

export function changeMode(payload) {
	return {
		type : "changeMode",
		key  : "internal.mode",
		payload,
	};
}

export function parseLogLine(payload) {
	return {
		type : "parseLogLine",
		key  : false,
		payload,
	};
}

export function updateSetting(payload) {
	return {
		type      : "setSetting",
		key       : payload.key,
		payload   : payload.value,
		source    : payload.source,
		skip_save : payload.skip_save,
	};
}

export function updateSettings(payload) {
	return {
		type   : "setSettings",
		data   : payload.data,
		source : payload.source,
	};
}

export function changeCollapse(payload) {
	return {
		type   : "setSetting",
		key    : "intrinsic.collapsed",
		source : "parser",
		payload,
	};
}

export function changeUIBuilder(payload) {
	return {
		type : "changeUIBuilder",
		key  : "internal.ui_builder",
		payload,
	};
}

export function changeTableType(payload) {
	return {
		type   : "setSetting",
		key    : "intrinsic.table_type",
		source : "parser",
		payload,
	};
}

export function changePlayerBlur(payload) {
	return {
		type   : "setSetting",
		key    : "intrinsic.player_blur",
		source : "parser",
		payload,
	};
}

export function changeHorizontal(payload) {
	return {
		type   : "setSetting",
		key    : "interface.horizontal",
		source : "parser",
		payload,
	};
}

export function changeViewing(payload) {
	return {
		type   : "changeViewing",
		key    : "internal.viewing",
		source : "parser",
		payload,
	};
}

export function changeDetailPlayer(payload) {
	return {
		type : "changeDetailPlayer",
		key  : "internal.detail_player",
		payload,
	};
}

export function updateState(payload) {
	return {
		type    : "updateState",
		key     : payload.key,
		payload : payload.value,
	};
}

export function updateToggle(payload) {
	return {
		type : "updateToggle",
		key  : "internal.toggles",
		payload,
	};
}
