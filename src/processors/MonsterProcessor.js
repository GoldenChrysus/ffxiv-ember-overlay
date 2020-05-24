import store from "../redux/store/index";

import Constants from "../constants/index";

import GameDataProcessor from "./GameDataProcessor";

class MonsterProcessor  {
	getDataValue(key, monster) {
		let key_function = Constants.MonsterDataCustomDataValues[key];
		let value        = (key_function) ? key_function(monster) : monster[key];

		if (!isNaN(value)) {
			value = GameDataProcessor.convertToLocaleFormat(key, value);
		}

		return value;
	}
}

export default new MonsterProcessor();