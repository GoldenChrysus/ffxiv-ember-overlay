import React from "react";
import { connect } from "react-redux";
import { changeCollapse } from "../../redux/actions/index";

import IconButton from "./Container/IconButton";
import LocalizationService from "../../services/LocalizationService";
import SettingsService from "../../services/SettingsService";
import VersionService from "../../services/VersionService";

class GameState extends React.Component {
	componentDidMount() {
		if (this.props.mode === "spells") {
			VersionService.determineIfNewer();
		}
	}

	render() {
		let encounter_class = (this.props.active || this.props.mode === "spells") ? "active" : "inactive";
		let rank_class      = (this.props.show_rank && this.props.mode === "stats") ? "" : "hidden";
		let rank            = (this.props.rank === "N/A") ? LocalizationService.getOverlayText("not_applicable") : this.props.rank;
		let button          = () => {
			switch (this.props.mode) {
				case "stats":
					let icon = (this.props.collapsed) ? "expand" : "compress";
					let data = { state: !this.props.collapsed };

					return(
						<IconButton icon={icon} title={LocalizationService.getOverlayText("toggle_collapse")} key="toggle-collapsed" onClick={this.changeCollapse.bind(this, data)}/>
					);

				case "spells":
					return(
						<IconButton icon="cog" title={LocalizationService.getOverlayText("settings")} key="settings" class={SettingsService.getNoticeClass()} onClick={SettingsService.openSettingsWindow}/>
					);

				default:
					break;
			}
		};

		let encounter       = this.props.encounter;
		let encounter_state = [];

		switch (this.props.mode) {
			case "stats":
				if (!encounter.title) {
					encounter_state.push(LocalizationService.getOverlayText("awaiting_encounter"));
				} else {
					encounter_state.push(encounter.duration);

					if (encounter.title !== "Encounter") {
						encounter_state.push(encounter.title);
					}

					encounter_state.push(encounter.CurrentZoneName);
				}

				encounter_state = encounter_state.join(" - ");

				break;

			case "spells":
				encounter_state = "Ember Spell Timers";

				break;

			default:
				break;
		}

		return (
			<div id="game-state">
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

const mapDispatchToProps = (dispatch) => {
	return {
		changeCollapse : (data) => {
			dispatch(changeCollapse(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		collapsed : state.settings.intrinsic.collapsed,
		mode      : state.internal.mode,
		new_ver   : state.internal.new_version,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameState);