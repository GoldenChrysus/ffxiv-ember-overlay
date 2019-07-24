import store from "../redux/store/index";
import { updateSetting, updateState } from "../redux/actions/index";
import $ from "jquery";
import Parser from "changelog-parser";
import compareVersions from "compare-versions";

class VersionService {
	getSystemVersion() {
		return process.env.REACT_APP_VERSION;
	}

	getLastUserVersion() {
		const intrinsic_settings = store.getState().settings.intrinsic;

		return intrinsic_settings.last_version || "0.0.0";
	}

	getCurrentUserVersion() {
		const intrinsic_settings = store.getState().settings.intrinsic;

		return intrinsic_settings.current_version || "0.0.0";
	}

	determineIfNewer() {
		let system_version  = this.getSystemVersion();
		let current_version = this.getCurrentUserVersion();

		const settings_data = store.getState().settings_data;

		if (!compareVersions.compare(system_version, current_version, ">")) {
			return false;
		}

		settings_data.setSetting("intrinsic.current_version", system_version, true);

		let last_data = {
			key   : "intrinsic.last_version",
			value : current_version
		};

		store.dispatch(updateSetting(last_data));

		let new_data = {
			key   : "internal.new_version",
			value : true
		}

		store.dispatch(updateState(new_data));
		return true;
	}

	getChangelogForUser() {
		return new Promise((resolve, reject) => {
			const no_changes = "No changes since your last visit.";

			let last_user_version = this.getLastUserVersion();

			if (compareVersions.compare(this.getSystemVersion(), last_user_version, ">")) {
				this.parseChangelog()
					.then((data) => {
						let final_data = {
							"Features"   : [],
							"UI Changes" : [],
							"Bug Fixes"  : []
						};

						for (let i in data.versions) {
							let version_data = data.versions[i];
							let version      = version_data.version;

							if (compareVersions.compare(version, last_user_version, "<=")) {
								break;
							}

							for (let item_type in version_data.parsed) {
								if (!final_data[item_type]) {
									continue;
								}

								final_data[item_type] = final_data[item_type].concat(version_data.parsed[item_type]);
							}
						}

						let has_changes = false;

						for (let item_type in final_data) {
							final_data[item_type] = final_data[item_type].filter((item) => {
								return (["N/A", "?"].indexOf(item) === -1);
							});

							if (!has_changes) {
								has_changes = (final_data[item_type].length > 0);
							}
						}

						resolve((has_changes) ? final_data : no_changes);
					})
					.catch((e) => {
						reject();
					});
				return;
			}

			resolve(no_changes);
			return;
		});
	}

	parseChangelog() {
		return new Promise((resolve, reject) => {
			$.get(process.env.REACT_APP_HTTP_BASE + "/logs/CHANGELOG.md")
				.done((data) => {
					Parser({
						text : data
					})
					.then((result) => {
						resolve(result);
					})
					.catch((e) => {
						reject();
					});
				});
		});
	}
}

export default new VersionService();