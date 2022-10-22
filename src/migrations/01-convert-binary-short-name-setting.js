import store from "../redux/store/index";
import { updateSetting } from "../redux/actions/index";

class Migration {
	migrate() {
		const map = {
			false : "no_short",
			true  : "short_first",
		};

		return new Promise((resolve, _reject) => {
			const settings    = store.getState().settings_data;
			const table_names = settings.getSetting("table_settings.general.table.short_names");
			const raid_names  = settings.getSetting("table_settings.general.raid.short_names");

			store.dispatch(
				updateSetting({
					key       : "table_settings.general.table.short_names",
					value     : map[table_names] || "no_short",
					skip_save : true,
				}),
			);
			store.dispatch(
				updateSetting({
					key       : "table_settings.general.raid.short_names",
					value     : map[raid_names] || "no_short",
					skip_save : true,
				}),
			);
			resolve();
		});
	}
}

export default new Migration();
