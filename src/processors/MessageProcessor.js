import store from "../redux/store/index";
import { parseGameData, parseEnmity, parseAggroList, parseParty, parseLogLine, updateState } from "../redux/actions/index";
import Constants from "../constants";

class MessageProcessor {
	processMessage(e) {
		let data = e;
		let type = false;

		if (typeof data !== "object" || (data !== null && data.data)) {
			try {
				data = JSON.parse(e.data);
			} catch (e) {}
		}

		if (typeof data !== "object" || data === null) {
			if (data) {
				try {
					data = JSON.parse(data);

					if (data.combatants) {
						type = "GetCombatants";
					}
				} catch (e) {}
			}

			if (!type) {
				return;
			}
		}

		type = type || data.msgtype || data.type;

		if (
			[
				"onOverlayDataUpdate",
				"SendCharName",
				"CombatData",
				"EnmityAggroList",
				"EnmityTargetData",
				"ChangePrimaryPlayer",
				"PartyChanged",
				"LogLine",
				"GetCombatants",
				"ChangeZone",
			].indexOf(type) === -1
		) {
			return;
		}

		let state_data;

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
				state_data = {
					key   : [
						"internal.character_name",
						"internal.character_id"
					],
					value : [
						(type === "ChangePrimaryPlayer") ? data.charName : data.msg.charName,
						(type === "ChangePrimaryPlayer") ? data.charID : data.msg.charID
					]
				};

				store.dispatch(updateState(state_data));
				break;

			case "ChangeZone":
				state_data = {
					key   : "internal.current_zone_id",
					value : data.zoneID
				};

				store.dispatch(updateState(state_data));
				break;

			case "GetCombatants":
				let char_id = store.getState().internal.character_id;

				for (let combatant of data.combatants) {
					if (char_id === combatant.ID) {
						let job = Constants.GameJobsID[combatant.Job];

						if (!job) {
							break;
						}

						state_data = {
							key   : [
								"internal.character_job",
								"internal.character_level"
							],
							value : [
								job.abbreviation,
								combatant.Level
							]
						};

						store.dispatch(updateState(state_data));
						break;
					}
				}

				break;

			case "PartyChanged":
				store.dispatch(parseParty(data));
				break;

			case "LogLine":
				const allowed_codes = [1, 3, 21, 22, 26, 30];

				if (allowed_codes.indexOf(+data.line[0]) === -1) {
					break;
				}

				store.dispatch(parseLogLine(data));
				break;

			default:
				break;
		}
	}
}

export default new MessageProcessor();