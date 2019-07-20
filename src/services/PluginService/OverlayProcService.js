import store from "../../redux/store/index"

class OverlayProcService {
	constructor() {
		this.socket_service = store.getState().socket_service;
	}

	splitEncounter() {
		this.socket_service.splitEncounter();
	}
}

export default OverlayProcService;