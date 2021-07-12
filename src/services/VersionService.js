import React from "react";
import store from "../redux/store/index";
import { updateSetting, updateState } from "../redux/actions/index";
import { Container } from "semantic-ui-react";
import $ from "jquery";
import Parser from "changelog-parser";
import compareVersions from "compare-versions";

import LocalizationService from "./LocalizationService";

const no_changes = "No changes since your last visit.";

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

	formatChangelog(data) {
		let changelog = [];

		if (typeof data === "string") {
			changelog = <p>{data}</p>;
		} else {
			for (let item_type in data) {
				let count = 0;
				let items = data[item_type].map((item) => {
					count++;

					return <li key={item_type + "-" + count}>{item}</li>
				});

				let ul = <ul>{items}</ul>

				changelog.push(
					<Container fluid className="changelog-section" key={item_type + "-section"}>
						<h4>{item_type}</h4>
						{ul}
					</Container>
				);
			}
		}

		return changelog;
	}

	getChangelogForUser() {
		return new Promise((resolve, reject) => {
			let last_user_version = this.getLastUserVersion();

			if (compareVersions.compare(this.getSystemVersion(), last_user_version, ">")) {
				this.parseChangelog()
					.then((data) => {
						resolve(this.processChangelog(data, last_user_version));
					})
					.catch((e) => {
						console.error(e);
						reject(e);
					});
				return;
			}

			resolve(no_changes);
			return;
		});
	}

	getLatestChangelogs(count) {
		return new Promise((resolve, reject) => {
			this.parseChangelog()
				.then((data) => {
					resolve(this.processChangelog(data, undefined, count));
				})
				.catch((e) => {
					console.error(e);
					reject(e);
				});
		});
	}

	processChangelog(data, minimum_version, max_version_count) {
		let final_data = {
			"Features"   : [],
			"UI Changes" : [],
			"Bug Fixes"  : []
		};

		for (let i in data.versions) {
			let version_data = data.versions[i];
			let version      = version_data.version;

			if ((minimum_version && compareVersions.compare(version, minimum_version, "<=")) || (max_version_count && +i === (max_version_count - 1))) {
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
				return (["N/A", "?"].indexOf(item.trim()) === -1);
			});

			if (!has_changes) {
				has_changes = (final_data[item_type].length > 0);
			}

			if (final_data[item_type].length === 0) {
				delete final_data[item_type];
			}

			if (has_changes) {
				for (let item_type in final_data) {
					let translated_type = item_type;

					switch (item_type) {
						case "Features":
							translated_type = LocalizationService.getMisc("features");

							break;

						case "UI Changes":
							translated_type = LocalizationService.getMisc("ui_changes");

							break;

						case "Bug Fixes":
							translated_type = LocalizationService.getMisc("bug_fixes");

							break;

						default:
							break;
					}

					if (translated_type !== item_type) {
						final_data[translated_type] = JSON.parse(JSON.stringify(final_data[item_type]));

						delete final_data[item_type];
					}
				}
			}
		}

		return (has_changes) ? final_data : no_changes;
	}

	parseChangelog() {
		return new Promise((resolve, reject) => {
			$.get("logs/CHANGELOG.md")
				.done((data) => {
					Parser({
						text : data
					})
					.then((result) => {
						resolve(result);
					})
					.catch((e) => {
						console.error(e);
						reject(e);
					});
				});
		});
	}
}

export default new VersionService();