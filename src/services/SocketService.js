import SocketMessageProcessor from "../processors/SocketMessageProcessor";
import store from "../redux/store/index";
import { updateState } from "../redux/actions/index";

const querystring = require("querystring");

const BASE_RECONNECT_DELAY = 300;

class SocketService {
	constructor(uri) {
		this.message_processor = new SocketMessageProcessor();
		this.uri               = uri || this.processUri();
		this.reconnect_delay   = BASE_RECONNECT_DELAY;
		this.try_for_ngld      = true;
	}

	processUri() {
		let params = new querystring.parse(String(window.location.search).substring(1));
		let uri    = params["HOST_PORT"];

		if (!uri) {
			return false;
		}

		let original_uri = uri;

		uri = uri.replace(/\/$/, "");

		// Redirect to non-SSL host if on SSL and using an insecure socket
		if (window.location.protocol === "https:" && uri.split(":")[0] === "ws" && uri.substring(uri.length - 4) !== "fake") {
			window.location.href = `${process.env.REACT_APP_REDIRECT_URL}${process.env.REACT_APP_HTTP_BASE}/` + window.location.search.replace(original_uri, uri);

			return false;
		}

		console.log(uri);

		if (this.try_for_ngld && store.getState().internal.overlayplugin_author === "ngld" && uri.indexOf("/fake") !== -1) {
			uri.replace("/fake", ":10501/ws");
		} else if (this.try_for_ngld && uri.indexOf("/ws") === -1) {
			uri = uri + "/ws";
		} else if (uri.indexOf("MiniParse") === -1) {
			uri = uri + "/MiniParse";
		}

		return uri;
	}

	initialize() {
		if (!this.uri) {
			return;
		}

		this.socket = new WebSocket(this.uri);

		this.socket.onmessage = this.message_processor.processMessage;
		this.socket.onclose   = () => { setTimeout(this.reconnect.bind(this), this.reconnect_delay); }
		this.socket.onopen    = this.connected.bind(this);
	}

	reconnect() {
		if (this.try_for_ngld) {
			this.try_for_ngld = false;
			this.uri          = this.processUri();
		}

		this.reconnect_delay = Math.min(this.reconnect_delay * 2, 3000);

		this.initialize();
	}

	connected() {
		if (this.try_for_ngld) {
			let state_data = {
				key   : "internal.overlayplugin_author",
				value : "ngld"
			};

			store.dispatch(updateState(state_data));
		}

		this.try_for_ngld    = false;
		this.reconnect_delay = BASE_RECONNECT_DELAY;

		this.setId();
		this.establishSubscriptions();
	}

	setId() {
		let id = Math.random().toString(36).substring(7);

		this.id = id;

		this.send("set_id", undefined, undefined, undefined, id);
	}

	establishSubscriptions() {
		this.socket.send(
			JSON.stringify({
				call   : "subscribe",
				events : [
					"CombatData",
					"EnmityAggroList",
					"ChangePrimaryPlayer"
				]
			})
		);
	}

	splitEncounter() {
		this.send("overlayAPI", this.id, "RequestEnd");
	}

	send(type, to, message_type, message, id) {
		if (!this.socket || this.socket.readyState !== 1) {
			return;
		}

		let data = {
			type    : type,
			to      : to,
			msgtype : message_type,
			msg     : message,
			id      : id
		};

		this.socket.send(JSON.stringify(data));
	}
}

export default SocketService;