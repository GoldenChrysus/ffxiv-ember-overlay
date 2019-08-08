import SampleGameData from "../../constants/SampleGameData";

export function parseGameData(payload) {
	return {
		type : "parseGameData",
		key  : "internal.game",
		payload
	};
}

export function loadSampleGameData() {
	return parseGameData(SampleGameData);
}

export function clearGameData() {
	return parseGameData({});
}

export function updateSetting(payload) {
	return {
		type      : "setSetting",
		key       : payload.key,
		payload   : payload.value,
		source    : payload.source,
		skip_save : payload.skip_save
	};
}

export function updateSettings(payload) {
	return {
		type   : "setSettings",
		data   : payload.data,
		source : payload.source
	};
}

export function changeCollapse(payload) {
	return {
		type   : "setSetting",
		key    : "intrinsic.collapsed",
		source : "parser",
		payload
	};
}

export function changeTableType(payload) {
	return {
		type   : "setSetting",
		key    : "intrinsic.table_type",
		source : "parser",
		payload
	};
}

export function changePlayerBlur(payload) {
	return {
		type   : "setSetting",
		key    : "intrinsic.player_blur",
		source : "parser",
		payload
	};
}

export function changeViewing(payload) {
	return {
		type   : "changeViewing",
		key    : "internal.viewing",
		source : "parser",
		payload
	};
}

export function changeDetailPlayer(payload) {
	return {
		type : "changeDetailPlayer",
		key  : "internal.detail_player",
		payload
	};
}

export function updateState(payload) {
	return {
		type    : "updateState",
		key     : payload.key,
		payload : payload.value
	};
}