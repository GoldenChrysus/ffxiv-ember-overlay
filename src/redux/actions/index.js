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
		type    : "setSetting",
		key     : payload.key,
		payload : payload.value
	};
}

export function changeCollapse(payload) {
	return {
		type : "setSetting",
		key  : "intrinsic.collapsed",
		payload
	};
}

export function changeTableType(payload) {
	return {
		type : "setSetting",
		key  : "intrinsic.table_type",
		payload
	};
}

export function changeViewing(payload) {
	return {
		type : "setSetting",
		key  : "intrinsic.viewing",
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