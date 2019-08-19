import React from "react";
import { connect } from "react-redux";
import { ContextMenu, MenuItem } from "react-contextmenu";
import { changeCollapse, loadSampleGameData, clearGameData, changeViewing, changeDetailPlayer } from "../../../redux/actions/index";

import PluginService from "../../../services/PluginService";
import SettingsService from "../../../services/SettingsService";

class Menu extends React.Component {
	render() {
		let self           = this;
		let plugin_service = new PluginService();

		let collapse_item = function() {
			let text = (self.props.collapsed) ? "Uncollapse" : "Collapse";
			let data = { state: !self.props.collapsed };

			return(
				<MenuItem data={data} onClick={self.changeCollapse.bind(self)}>
					{text}
				</MenuItem>
			);
		};

		let plugin_actions = function() {
			return(
				<MenuItem onClick={plugin_service.splitEncounter.bind(plugin_service)}>
					Split Encounter
				</MenuItem>
			);
		}

		return (
			<ContextMenu id="right-click-menu" className="container-context-menu">
				<div className="item-group">
					{collapse_item()}
					{plugin_actions()}
					<div className="split"></div>
					<MenuItem onClick={this.changeViewing.bind(this, "player", this.props.encounter)}>
						View Encounter Detail
					</MenuItem>
					<MenuItem onClick={this.loadSampleGameData.bind(this)}>
						Load Sample Data
					</MenuItem>
					<MenuItem onClick={this.clearGameData.bind(this)}>
						Clear Encounter Data
					</MenuItem>
					<div className="split"></div>
					<MenuItem onClick={SettingsService.openSettingsWindow}>
						Settings
					</MenuItem>
					<MenuItem onClick={SettingsService.openSettingsImport}>
						Import
					</MenuItem>
				</div>
			</ContextMenu>
		);
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

	changeViewing(type, player) {
		if (!player) {
			return;
		}

		this.props.changeViewing(type);
		this.props.changeDetailPlayer(player);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeCollapse      : (data) => {
			dispatch(changeCollapse(data));
		},

		loadSampleGameData : () => {
			dispatch(loadSampleGameData());
		},

		clearGameData      : () => {
			dispatch(clearGameData());
		},

		changeViewing      : (data) => {
			dispatch(changeViewing(data));
		},

		changeDetailPlayer : (data) => {
			dispatch(changeDetailPlayer(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		collapsed     : state.settings.intrinsic.collapsed,
		overlayplugin : state.internal.overlayplugin,
		encounter     : state.internal.game.Encounter
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);