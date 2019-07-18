import SampleGameData from "../../constants/SampleGameData";

export function parseGameData(payload) {
	return {
		type : "parseGameData",
		key  : "game",
		payload
	};
}

export function loadSampleGameData() {
	return parseGameData(SampleGameData);
}

export function clearGameData() {
	return parseGameData({});
}

export function changeTableType(payload) {
	return {
		type : "changeTableType",
		key  : "table_type",
		payload
	};
}

export function changeViewing(payload) {
	return {
		type : "changeViewing",
		key  : "viewing",
		payload
	};
}

export function changeDetailPlayer(payload) {
	return {
		type : "changeDetailPlayer",
		key  : "detail_player",
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