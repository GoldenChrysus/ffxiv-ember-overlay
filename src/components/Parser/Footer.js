import React from "react";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import { changeTableType, changeViewing, changePlayerBlur } from "../../redux/actions/index";

import PlayerProcessor from "../../processors/PlayerProcessor";
import VersionService from "../../services/VersionService";
import PluginService from "../../services/PluginService";
import SettingsService from "../../services/SettingsService";
import LocalizationService from "../../services/LocalizationService";
import IconButton from "./Container/IconButton";
import EncounterMenu from "./Container/EncounterMenu";

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
							<span className="navigation-link" onClick={self.changeViewing.bind(self, "tables")} key="navigation-link-back">&lsaquo; {LocalizationService.getOverlayText("back")}</span>
						</div>
					);

				default:
					let types   = {
						dps   : "",
						heal  : "",
						tank  : "",
						raid  : "24",
						aggro : ""
					}
					let links   = [];

					if (self.props.overlayplugin_author !== "ngld") {
						delete types.aggro;
					}

					for (let type_key in types) {
						let name   = (type_key === "raid") ? types[type_key] : LocalizationService.getOverlayText(type_key);
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

		let trigger    = null;
		let toggleMenu = e => {
			if (trigger) {
				trigger.handleContextClick(e);
			}
		};
		let actions    = function() {
			let version_notice = (self.props.new_version && !window.obsstudio) ? "notice" : "";
			let actions        = [
				<ContextMenuTrigger id="encounter-history-menu" key="encounter-history-trigger" ref={c => trigger = c} attributes={{className: "icon-container"}} holdToDisplay="-1">
					<IconButton icon="history" key="encounter-history-button" no_container={true} onClick={toggleMenu}/>
				</ContextMenuTrigger>,
				<IconButton icon="eye slash" title={LocalizationService.getOverlayText("blur_names")} key="player-blur" onClick={self.togglePlayerBlur.bind(self)}/>,
				<IconButton icon="cut" title={LocalizationService.getOverlayText("split_encounter")} key="split-encounter" onClick={plugin_service.splitEncounter.bind(plugin_service)}/>,
				<IconButton icon="cog" title={LocalizationService.getOverlayText("settings")} key="settings" class={version_notice} onClick={SettingsService.openSettingsWindow}/>
			];

			return actions;
		}

		return (
			<div id="footer">
				{navigation()}
				<div id="footer-actions">
					{actions()}
					<EncounterMenu/>
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
		language             : state.settings.interface.language,
		table_type           : state.settings.intrinsic.table_type,
		player_blur          : state.settings.intrinsic.player_blur,
		viewing              : state.internal.viewing,
		overlayplugin        : state.internal.overlayplugin,
		overlayplugin_author : state.internal.overlayplugin_author,
		new_version          : state.internal.new_version,
		encounter            : state.internal.game.Encounter,
		show_dps             : state.settings.interface.footer_dps
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);