import React from "react";
import { connect } from "react-redux";
import { changeTableType, changeViewing, changePlayerBlur } from "../../redux/actions/index";

import PlayerProcessor from "../../processors/PlayerProcessor";
import VersionService from "../../services/VersionService";
import PluginService from "../../services/PluginService";
import SettingsService from "../../services/SettingsService";
import IconButton from "./Container/IconButton";

class Footer extends React.Component {
	componentDidMount() {
		VersionService.determineIfNewer();
	}

	render() {
		let viewing        = this.props.viewing;
		let table_type     = this.props.table_type;
		let self           = this;
		let plugin_service = new PluginService();

		let navigation = function() {
			switch (viewing) {
				case "player":
					return(
						<div id="navigation-links">
							<span className="navigation-link" onClick={self.changeViewing.bind(self, "tables")} key="navigation-link-back">&lsaquo; Back</span>
						</div>
					);

				default:
					let types   = {
						dps  : "DPS",
						heal : "Heal",
						tank : "Tank",
						raid : "24"
					}
					let links   = [];

					for (let type_key in types) {
						let name   = types[type_key];
						let active = (table_type === type_key && viewing === "tables") ? "active" : "";

						links.push(
							<div className={"role-link " + active} onClick={self.changeTableType.bind(self, type_key)} key={"navigation-link-" + type_key}>{name}</div>
						);
					}

					let dps;

					if (self.props.show_dps) {
						let dps_value = (self.props.encounter) ? PlayerProcessor.getDataValue("encdps", self.props.encounter) : "0.00";
						
						dps = <div className="info-item" key="info-item-dps">rDPS: {dps_value}</div>;
					}

					return(
						<div id="role-links">
							{links}
							{dps}
						</div>
					);
			}
		}

		let actions = function() {
			let version_notice = (self.props.new_version) ? "notice" : "";
			let actions        = [
				<IconButton icon="eye slash" title="Blur player names" key="player-blur" onClick={self.togglePlayerBlur.bind(self)}/>,
				<IconButton icon="cut" title="Split encounter" key="split-encounter" onClick={plugin_service.splitEncounter.bind(plugin_service)}/>,
				<IconButton icon="cog" title="Settings" key="settings" class={version_notice} onClick={SettingsService.openSettingsWindow}/>
			];

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

	changeTableType(type) {
		if (this.props.viewing !== "tables") {
			this.changeViewing("tables");
		}

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
		new_version   : state.internal.new_version,
		encounter     : state.internal.game.Encounter,
		show_dps      : state.settings.interface.footer_dps
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);