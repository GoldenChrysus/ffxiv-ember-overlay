import React from "react";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import { changeTableType, changeViewing, changePlayerBlur } from "../../redux/actions/index";

import PlayerProcessor from "../../processors/PlayerProcessor";
import VersionService from "../../services/VersionService";
import SettingsService from "../../services/SettingsService";
import LocalizationService from "../../services/LocalizationService";
import DiscordService from "../../services/DiscordService";
import IconButton from "./Container/IconButton";
import EncounterMenu from "./Container/EncounterMenu";
import DiscordMenu from "./Container/DiscordMenu";

class Footer extends React.Component {
	componentDidMount() {
		VersionService.determineIfNewer();
	}

	render() {
		const viewing        = this.props.viewing;
		const table_type     = this.props.table_type;
		const self           = this;
		const plugin_service = this.props.plugin_service;

		const navigation = function() {
			switch (viewing) {
				case "player":
					return (
						<div id='navigation-links'>
							<span className='navigation-link' onClick={self.changeViewing.bind(self, "tables")} key='navigation-link-back'>&lsaquo; {LocalizationService.getOverlayText("back")}</span>
						</div>
					);

				default:
					const types   = {
						dps   : "",
						heal  : "",
						tank  : "",
						raid  : "24",
						aggro : "",
					};
					const links   = [];

					if (self.props.overlayplugin_author !== "ngld" || self.props.horizontal) {
						delete types.aggro;
					}

					if (self.props.horizontal) {
						delete types.raid;
					}

					for (const type_key in types) {
						const name   = (type_key === "raid") ? types[type_key] : LocalizationService.getOverlayText(type_key);
						const active = (table_type === type_key && viewing === "tables") ? "active" : "";

						links.push(
							<div className={"role-link " + active} onClick={self.changeTableType.bind(self, type_key)} key={"navigation-link-" + type_key}>{name}</div>,
						);
					}

					let dps;

					if (self.props.show_dps) {
						const dps_value = (self.props.encounter) ? PlayerProcessor.getDataValue("encdps", self.props.encounter) : "0.00";

						dps = <div className='info-item' key='info-item-dps'>rDPS: {dps_value}</div>;
					}

					return (
						<div id='role-links'>
							{links}
							{dps}
						</div>
					);
			}
		};

		let trigger    = null;
		const toggleMenu = e => {
			if (trigger) {
				trigger.handleContextClick(e);
			}
		};

		const actions    = () => {
			const actions = [
				this.getDiscordButton(toggleMenu, trigger),
				<ContextMenuTrigger id='encounter-history-menu' key='encounter-history-trigger' ref={c => trigger = c} attributes={{ className : "icon-container" }} holdToDisplay={-1}>
					<IconButton icon='history' title={LocalizationService.getOverlayText("encounter_history")} key='encounter-history-button' no_container={true} onClick={toggleMenu}/>
				</ContextMenuTrigger>,
				<IconButton icon='eye slash' title={LocalizationService.getOverlayText("blur_names")} key='player-blur' onClick={this.togglePlayerBlur.bind(this)}/>,
				<IconButton icon='cut' title={LocalizationService.getOverlayText("split_encounter")} key='split-encounter' onClick={plugin_service.splitEncounter.bind(plugin_service)}/>,
				<IconButton icon='cog' title={LocalizationService.getOverlayText("settings")} key='settings' class={SettingsService.getNoticeClass()} onClick={SettingsService.openSettingsWindow}/>,
			];

			return actions;
		};

		return (
			<div id='footer'>
				{navigation()}
				<div id='footer-actions'>
					{actions()}
					<EncounterMenu/>
					<DiscordMenu webhook={this.props.discord_webhook}/>
				</div>
			</div>
		);
	}

	getDiscordButton() {
		let trigger      = null;
		const toggleMenu = e => {
			if (trigger) {
				trigger.handleContextClick(e);
			}
		};

		if (this.props.discord_webhook) {
			return (
				<ContextMenuTrigger id='discord-menu' key='discord-trigger' ref={c => trigger = c} attributes={{ className : "icon-container" }} holdToDisplay={-1}>
					<IconButton icon='discord' title={LocalizationService.getOverlayText("discord")} key='discord-button' no_container={true} onClick={toggleMenu}/>
				</ContextMenuTrigger>
			);
		}

		return <IconButton icon='discord' title={LocalizationService.getOverlayText("discord")} key='discord' onClick={DiscordService.openDiscordWindow}/>;
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

const mapDispatchToProps = dispatch => ({
	changeTableType(data) {
		dispatch(changeTableType(data));
	},

	changeViewing(data) {
		dispatch(changeViewing(data));
	},

	changePlayerBlur(data) {
		dispatch(changePlayerBlur(data));
	},
});

const mapStateToProps = state => ({
	plugin_service       : state.plugin_service,
	language             : state.settings.interface.language,
	horizontal           : state.settings.interface.horizontal,
	table_type           : state.settings.intrinsic.table_type,
	player_blur          : state.settings.intrinsic.player_blur,
	viewing              : state.internal.viewing,
	overlayplugin        : state.internal.overlayplugin,
	overlayplugin_author : state.internal.overlayplugin_author,
	encounter            : state.internal.game.Encounter,
	show_dps             : state.settings.interface.footer_dps,
	discord_webhook      : state.settings.discord.url,
	new_ver              : state.internal.new_version,
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
