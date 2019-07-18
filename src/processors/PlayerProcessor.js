import Constants from "../constants/index";

class PlayerProcessor {
	getDataValue(key, player, players) {
		let key_function = Constants.PlayerDataCustomValues[key];
		let value        = (key_function) ? key_function(player, players) : player[key];

		if (String(Number(value)) === String(value)) {
			value = (+value).toLocaleString(undefined, { maximumFractionDigits: 2 });
		}

		return value;
	}
}

export default PlayerProcessor;