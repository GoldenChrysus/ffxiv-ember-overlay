import store from "../redux/store/index";
import { parseGameData, updateState } from "../redux/actions/index";

class SocketMessageProcessor {
	processMessage(e) {
		let data;

		try {
			data = JSON.parse(e.data);
		} catch (e) { }

		if (typeof data !== "object") {
			return;
		}

		let type = data.msgtype || data.type;

		if (["SendCharName", "CombatData", "EnmityAggroList", "ChangePrimaryPlayer"].indexOf(type) === -1) {
			return;
		}

		switch (type) {
			case "CombatData":
				let detail = data.msg || data;

				store.dispatch(parseGameData(detail));
				break;

			case "EnmityAggroList":
				if (!data.AggroList.length) {
					break;
				}

				console.log(data);
				break;

			case "ChangePrimaryPlayer":
			case "SendCharName":
				let name       = (type === "ChangePrimaryPlayer") ? data.charName : data.msg.charName;
				let state_data = {
					key   : "internal.character_name",
					value : name
				};

				store.dispatch(updateState(state_data));
				break;

			default:
				break;
		}
	}
}

export default SocketMessageProcessor;