import store from "../redux/store/index";

import Constants from "../constants/index";

class PlayerProcessor  {
	getDataValue(key, player, players) {
		let key_function = Constants.PlayerDataCustomValues[key];
		let value        = (key_function) ? key_function(player, players) : player[key];

		if (key === "name" && value === "YOU") {
			value = store.getState().character_name;
		}

		if (!isNaN(value)) {
			value = (+value).toLocaleString(undefined, { minimumFractionDigits : 2, maximumFractionDigits: 2 });
		}

		return value;
	}
}

export default PlayerProcessor;