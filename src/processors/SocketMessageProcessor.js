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

		let type = data.msgtype;

		if (["SendCharName", "CombatData"].indexOf(type) === -1) {
			return;
		}

		switch (type) {
			case "CombatData":
				let detail = data.msg;

				store.dispatch(parseGameData(detail));
				break;

			case "SendCharName":
				let name       = data.msg.charName;
				let state_data = {
					key   : "character_name",
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