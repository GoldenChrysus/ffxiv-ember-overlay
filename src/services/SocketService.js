import SocketMessageProcessor from "../processors/SocketMessageProcessor";

const querystring = require("querystring");

class SocketService {
	constructor() {
		this.message_processor = new SocketMessageProcessor();
	}

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

		this.socket.onmessage = this.message_processor.processMessage;
		this.socket.onclose   = this.reconnect;
	}

	reconnect() {
		this.initialize();
	}
}

export default SocketService;