import store from "../redux/store/index";
import localForage from "localforage";

import Migrations from "../constants/Migrations";

class MigrationService {
	migrate() {
		return new Promise(async (resolve, reject) => {
			let history = await localForage.getItem("migration_history");

			if (history) {
				try {
					history = JSON.parse(history);
				} catch {}
			}

			if (!history) {
				history = [];
			}

			for (let migration_name of Migrations) {
				if (history.indexOf(migration_name) !== -1) {
					continue;
				}

				let migration = require(`../migrations/${migration_name}.js`);

				await migration.default.migrate();

				history.push(migration_name);
			}

			await store.getState().settings_data.saveSettings(true);
			await localForage.setItem("migration_history", JSON.stringify(history));

			resolve();
		});
	}
}

export default new MigrationService();