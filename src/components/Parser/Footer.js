import React from "react";
import { connect } from "react-redux";
import { changeTableType, changeViewing, changePlayerBlur } from "../../redux/actions/index";
import { Icon } from "semantic-ui-react";

import PluginService from "../../services/PluginService";

class Footer extends React.Component {
	render() {
		let viewing        = this.props.viewing;
		let table_type     = this.props.table_type;
		let self           = this;
		let plugin_service = new PluginService();

		let navigation = function() {
			if (viewing === "tables") {
				let types   = {
					dps  : "DPS",
					heal : "Heal",
					tank : "Tank",
					raid : "24"
				}
				let links   = [];

				for (let type_key in types) {
					let name   = types[type_key];
					let active = (table_type === type_key) ? "active" : "";

					links.push(
						<div className={"role-link " + active} onClick={self.changeTableType.bind(self, type_key)} key={"navigation-link-" + type_key}>{name}</div>
					);
				}

				return(
					<div id="role-links">
						{links}
					</div>
				);
			} else if (viewing === "player") {
				return(
					<div id="navigation-links">
						<span className="navigation-link" onClick={self.changeViewing.bind(self, "tables")} key="navigation-link-back">&lsaquo; Back</span>
					</div>
				);
			}
		}

		let actions = function() {
			let actions        = [];
			let version_notice = (self.props.new_version) ? "notice" : "";

			actions.push(
				<div className="icon-container" key="icon-container-player-blur">
					<Icon name="eye slash" alt="Blur player names" title="Blur player names" key="player-blur" onClick={self.togglePlayerBlur.bind(self)}/>
				</div>
			);
			actions.push(
				<div className={"icon-container " + version_notice} key="icon-container-settings">
					<Icon name="cog" alt="Settings" title="Settings" key="settings" onClick={self.openSettingsWindow}/>
				</div>
			);
			actions.push(
				<div className="icon-container" key="icon-container-split-encounter">
					<Icon name="cut" alt="Split encounter" title="Split encounter" onClick={plugin_service.splitEncounter.bind(plugin_service)} key="split-encounter"/>
				</div>
			);

			return actions;
		}

		return (
			<div id="footer">
				{navigation()}
				<div id="footer-actions">
					{actions()}
				</div>
			</div>
		);
	}

	openSettingsWindow() {
		window.open("#/settings", "", "width=600,height=400,location=no,menubar=no");
	}

	changeTableType(type) {
		this.props.changeTableType(type);
	}

	changeViewing(type) {
		this.props.changeViewing(type);
	}

	togglePlayerBlur() {
		this.props.changePlayerBlur(!this.props.player_blur);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeTableType  : (data) => {
			dispatch(changeTableType(data));
		},

		changeViewing    : (data) => {
			dispatch(changeViewing(data));
		},

		changePlayerBlur : (data) => {
			dispatch(changePlayerBlur(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		table_type    : state.settings.intrinsic.table_type,
		player_blur   : state.settings.intrinsic.player_blur,
		viewing       : state.internal.viewing,
		overlayplugin : state.internal.overlayplugin,
		new_version   : state.internal.new_version
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);