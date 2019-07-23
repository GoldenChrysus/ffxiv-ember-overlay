import store from "../redux/store/index";
import $ from "jquery";
import Parser from "changelog-parser";
import compareVersions from "compare-versions";

class VersionService {
	getChangelogForUser() {
		return new Promise((resolve, reject) => {
			const intrinsic_settings = store.getState().settings.intrinsic;

			let system_version    = process.env.REACT_APP_VERSION;
			let last_user_version = intrinsic_settings.last_version || "0.0.0";

			if (system_version !== last_user_version) {
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

						for (let item_type in final_data) {
							final_data[item_type] = final_data[item_type].filter((item) => {
								return (["N/A", "?"].indexOf(item) === -1);
							});
						}

						resolve(final_data);
					})
					.catch((e) => {
						reject();
					});
				return;
			}

			resolve("No changes since your last visit.");
			return;
		});
	}

	parseChangelog() {
		return new Promise((resolve, reject) => {
			$.get(process.env.REACT_APP_ROUTER_BASE + "/logs/CHANGELOG.md")
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