import { createStore } from "redux";
import rootReducer from "../reducers/index";

import TabSyncService from "../../services/TabSyncService";

const store = createStore(rootReducer);

window.addEventListener("storage", TabSyncService.createStorageListener(store));

export default store;