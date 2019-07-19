import store from "../redux/store/index";
import { parseGameData, updateState } from "../redux/actions/index";

const querystring = require("querystring");

class SocketService {
	initialize() {
		let params = new querystring.parse(window.location.search);
		let uri    = params["?HOST_PORT"];

		if (!uri) {
			return;
		}

		uri = uri.replace(/\/$/, "");

		if (uri.indexOf("MiniParse") === -1) {
			uri = uri + "/MiniParse";
		}

		this.uri    = uri;
		this.socket = new WebSocket(this.uri);

		this.socket.onmessage = this.processEvent;
		this.socket.onclose   = this.reconnect;
	}

	reconnect() {
		this.initialize();
	}

	processEvent(e) {
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

export default SocketService;