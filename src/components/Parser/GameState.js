import React from "react";
import { connect } from "react-redux";
import { changeCollapse } from "../../redux/actions/index";

import IconButton from "./Container/IconButton";
import LocalizationService from "../../services/LocalizationService";
import SettingsService from "../../services/SettingsService";
import VersionService from "../../services/VersionService";
import { getEncounterTitle } from "../../helpers/GameHelper";

class GameState extends React.Component {
	componentDidMount() {
		if (this.props.mode === "spells") {
			VersionService.determineIfNewer();
		}
	}

	render() {
		const encounter_class = (this.props.active || this.props.mode === "spells") ? "active" : "inactive";
		const rank_class      = (this.props.show_rank && this.props.mode === "stats") ? "" : "hidden";
		const rank            = (this.props.rank === "N/A") ? LocalizationService.getOverlayText("not_applicable") : this.props.rank;
		const button          = () => {
			switch (this.props.mode) {
				case "stats":
					const icon = (this.props.collapsed) ? "expand" : "compress";
					const data = { state : !this.props.collapsed };

					return (
						<IconButton icon={icon} title={LocalizationService.getOverlayText("toggle_collapse")} key='toggle-collapsed' onClick={this.changeCollapse.bind(this, data)}/>
					);

				case "spells":
					return (
						<IconButton icon='cog' title={LocalizationService.getOverlayText("settings")} key='settings' class={SettingsService.getNoticeClass()} onClick={SettingsService.openSettingsWindow}/>
					);

				default:
					break;
			}
		};

		const encounter       = this.props.encounter;
		let encounter_state = [];

		switch (this.props.mode) {
			case "stats":
				encounter_state = getEncounterTitle(encounter);

				break;

			case "spells":
				encounter_state = "Ember Spell Timers";

				break;

			default:
				break;
		}

		return (
			<div id='game-state'>
				<span className={encounter_class}>{encounter_state}</span>
				<span>
					<span className={rank_class}>{rank}</span>
					{button()}
				</span>
			</div>
		);
	}

	changeCollapse(data) {
		this.props.changeCollapse(data.state);
	}
}

const mapDispatchToProps = dispatch => ({
	changeCollapse(data) {
		dispatch(changeCollapse(data));
	},
});

const mapStateToProps = state => ({
	collapsed : state.settings.intrinsic.collapsed,
	mode      : state.internal.mode,
	new_ver   : state.internal.new_version,
});

export default connect(mapStateToProps, mapDispatchToProps)(GameState);
