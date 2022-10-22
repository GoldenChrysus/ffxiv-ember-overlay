import store from "../redux/store/index";
import localForage from "localforage";

import Migrations from "../constants/Migrations";

class MigrationService {
	migrate() {
		return new Promise((resolve, reject) => {
			localForage.getItem("migration_history")
				.then(history => {
					if (history) {
						try {
							history = JSON.parse(history);
						} catch {}
					}

					if (!history) {
						history = [];
					}

					this.history = history;

					const promise = Migrations.reduce(
						(last_promise, migration_name) => last_promise.then(() => {
							this.executeMigration(migration_name);
						}),
						Promise.resolve(),
					);

					promise.then(() => {
						store
							.getState()
							.settings_data
							.saveSettings(true)
							.then(() => {
								localForage
									.setItem("migration_history", JSON.stringify(history))
									.then(() => {
										resolve();
									});
							})
							.catch(e => {
								console.error(JSON.stringify(e));
								reject(e);
							});
					});
				});
		});
	}

	executeMigration(migration_name) {
		return new Promise((resolve, reject) => {
			if (this.history.indexOf(migration_name) !== -1) {
				resolve();
				return;
			}

			const migration = require(`../migrations/${migration_name}.js`);

			migration
				.default
				.migrate()
				.then(() => {
					this.history.push(migration_name);
					resolve();
				})
				.catch(e => {
					console.error(JSON.stringify(e));
					reject(e);
				});
		});
	}
}

export default new MigrationService();
