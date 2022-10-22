import React from "react";
import { connect } from "react-redux";
import { ContextMenu, MenuItem } from "react-contextmenu";
import { changeCollapse, loadSampleGameData, clearGameData, changeViewing, changeDetailPlayer, changeMode, changeUIBuilder } from "../../../redux/actions/index";

import SettingsService from "../../../services/SettingsService";
import LocalizationService from "../../../services/LocalizationService";

class Menu extends React.Component {
	render() {
		return (
			<ContextMenu id='right-click-menu' className='container-context-menu'>
				<div className='item-group'>
					{this.getModesSection()}
					{this.getQuickCommandsSection()}
					{this.getEncounterSection()}
					{this.getUIBuilderSection()}
					<MenuItem onClick={SettingsService.openSettingsWindow}>
						{LocalizationService.getOverlayText("settings")}
					</MenuItem>
					<MenuItem onClick={SettingsService.openSettingsImport}>
						{LocalizationService.getOverlayText("import")}
					</MenuItem>
				</div>
			</ContextMenu>
		);
	}

	getUIBuilderSection() {
		if (this.props.overlayplugin_author !== "ngld" || !this.props.use_ui_builder || this.props.mode !== "spells") {
			return;
		}

		const text  = (this.props.ui_builder) ? LocalizationService.getMisc("save_ui") : LocalizationService.getMisc("edit_ui");
		const items = [
			<MenuItem key='menu-spell-ui-builder' onClick={this.changeUIBuilder.bind(this)}>
				{text}
			</MenuItem>,
			<div key='menu-ui-builder-section-split' className='split'></div>,
		];

		return items;
	}

	getModesSection() {
		if (this.props.overlayplugin_author !== "ngld") {
			return;
		}

		const mode_text = LocalizationService.getOverlayText("mode");
		const modes     = [
			<MenuItem key='menu-mode-stats' onClick={this.changeMode.bind(this, "stats")}>
				{mode_text}: {LocalizationService.getOverlayText("parser")}
			</MenuItem>,
			<MenuItem key='menu-mode-spells' onClick={this.changeMode.bind(this, "spells")}>
				{mode_text}: {LocalizationService.getOverlayText("spell_timers")}
			</MenuItem>,
			<div key='menu-modes-section-split' className='split'></div>,
		];

		return modes;
	}

	getQuickCommandsSection() {
		const plugin_service = this.props.plugin_service;

		const collapse_item = () => {
			if (this.props.mode === "spells") {
				return "";
			}

			const text = LocalizationService.getOverlayText((this.props.collapsed) ? "uncollapse" : "collapse");
			const data = { state : !this.props.collapsed };

			return (
				<MenuItem key='menu-collapse' data={data} onClick={this.changeCollapse.bind(this)}>
					{text}
				</MenuItem>
			);
		};

		const plugin_actions = () => {
			if (this.props.mode === "spells") {
				return "";
			}

			return (
				<MenuItem key='menu-split-encounter' onClick={plugin_service.splitEncounter.bind(plugin_service)}>
					{LocalizationService.getOverlayText("split_encounter")}
				</MenuItem>
			);
		};

		const items = [collapse_item(), plugin_actions()].filter(x => Boolean(x));

		if (items.length) {
			items.push(<div key='menu-group1-split' className='split'></div>);
		}

		return items;
	}

	getEncounterSection() {
		const items = [];

		if (this.props.mode === "stats") {
			items.push(
				<MenuItem key='menu-view-encounter' onClick={this.changeViewing.bind(this, "player", this.props.encounter)}>
					{LocalizationService.getOverlayText("view_encounter")}
				</MenuItem>,
			);
		}

		items.push(
			<MenuItem key='menu-load-sample' onClick={this.loadSampleGameData.bind(this)}>
				{LocalizationService.getOverlayText("load_sample")}
			</MenuItem>,
		);

		if (this.props.mode === "stats") {
			items.push(
				<MenuItem key='menu-clear-encounter' onClick={this.clearGameData.bind(this)}>
					{LocalizationService.getOverlayText("clear_encounter")}
				</MenuItem>,
			);
		}

		items.push(<div key='menu-group2-split' className='split'></div>);
		return items;
	}

	changeCollapse(e, data) {
		this.props.changeCollapse(data.state);
	}

	loadSampleGameData() {
		this.props.loadSampleGameData();
	}

	clearGameData() {
		this.props.clearGameData();
	}

	changeMode(mode) {
		this.props.changeMode(mode);
	}

	changeViewing(type, player) {
		if (!player) {
			return;
		}

		this.props.changeViewing(type);
		this.props.changeDetailPlayer(player);
	}

	changeUIBuilder() {
		this.props.changeUIBuilder(this.props.getUIData());
	}
}

const mapDispatchToProps = dispatch => ({
	changeCollapse(data) {
		dispatch(changeCollapse(data));
	},

	loadSampleGameData() {
		dispatch(loadSampleGameData());
	},

	clearGameData() {
		dispatch(clearGameData());
	},

	changeViewing(data) {
		dispatch(changeViewing(data));
	},

	changeDetailPlayer(data) {
		dispatch(changeDetailPlayer(data));
	},

	changeMode(data) {
		dispatch(changeMode(data));
	},

	changeUIBuilder(data) {
		dispatch(changeUIBuilder(data));
	},
});

const mapStateToProps = state => ({
	plugin_service       : state.plugin_service,
	language             : state.settings.interface.language,
	collapsed            : state.settings.intrinsic.collapsed,
	overlayplugin        : state.internal.overlayplugin,
	overlayplugin_author : state.internal.overlayplugin_author,
	encounter            : state.internal.game.Encounter,
	mode                 : state.internal.mode,
	ui_builder           : state.internal.ui_builder,
	use_ui_builder       : state.settings.spells_mode.ui.use,
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
