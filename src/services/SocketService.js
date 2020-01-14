import SocketMessageProcessor from "../processors/SocketMessageProcessor";

const querystring = require("querystring");

const BASE_RECONNECT_DELAY = 300;

class SocketService {
	constructor(uri) {
		this.message_processor = new SocketMessageProcessor();
		this.uri               = uri || this.processUri();
		this.reconnect_delay   = BASE_RECONNECT_DELAY;
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
		if (window.location.protocol === "https:" && uri.split(":")[0] === "ws") {
			if (uri.substring(uri.length - 4) === "fake") {
				uri = uri.substring(0, uri.length - 4);
			}

			window.location.href = `${process.env.REACT_APP_REDIRECT_URL}${process.env.REACT_APP_HTTP_BASE}/` + window.location.search.replace(original_uri, uri);

			return false;
		}

		if (uri.indexOf("MiniParse") === -1) {
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
		this.reconnect_delay = Math.min(this.reconnect_delay * 2, 3000);

		this.initialize();
	}

	connected() {
		this.reconnect_delay = BASE_RECONNECT_DELAY;

		this.setId();
	}

	setId() {
		let id = Math.random().toString(36).substring(7);

		this.id = id;

		this.send("set_id", undefined, undefined, undefined, id);
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