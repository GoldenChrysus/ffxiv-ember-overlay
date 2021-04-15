import store from "../redux/store/index";
import { parseGameData, parseEnmity, parseAggroList, parseParty, parseLogLine, updateState } from "../redux/actions/index";

class MessageProcessor {
	processMessage(e) {
		let data = e;

		if (typeof data !== "object" || (data !== null && data.data)) {
			try {
				data = JSON.parse(e.data);
			} catch (e) { }
		}

		if (typeof data !== "object" || data === null) {
			return;
		}

		let type = data.msgtype || data.type;

		if (["onOverlayDataUpdate", "SendCharName", "CombatData", "EnmityAggroList", "EnmityTargetData", "ChangePrimaryPlayer", "PartyChanged", "LogLine"].indexOf(type) === -1) {
			return;
		}

		switch (type) {
			case "onOverlayDataUpdate":
			case "CombatData":
				let detail = (type === "onOverlayDataUpdate") ? data.detail : data.msg || data;

				store.dispatch(parseGameData(detail));
				break;

			case "EnmityAggroList":
				if (data.AggroList && !data.AggroList.length) {
					break;
				}

				store.dispatch(parseAggroList(data));
				break;

			case "EnmityTargetData":
				if (!data.Entries || !data.Entries.length) {
					break;
				}

				store.dispatch(parseEnmity(data));
				break;

			case "ChangePrimaryPlayer":
			case "SendCharName":
				let name       = (type === "ChangePrimaryPlayer") ? data.charName : data.msg.charName;
				let state_data = {
					key   : "internal.character_name",
					value : name
				};

				store.dispatch(updateState(state_data));

				let id = (type === "ChangePrimaryPlayer") ? data.charID : data.msg.charID;
				
				state_data = {
					key   : "internal.character_id",
					value : id
				};

				store.dispatch(updateState(state_data));
				break;

			case "PartyChanged":
				console.log(data);
				store.dispatch(parseParty(data));
				break;

			case "LogLine":
				store.dispatch(parseLogLine(data));
				break;

			default:
				break;
		}
	}
}

export default new MessageProcessor();