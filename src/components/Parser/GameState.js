import React from "react";
import { connect } from "react-redux";
import { changeCollapse } from "../../redux/actions/index";

import IconButton from "./Container/IconButton";
import LocalizationService from "../../services/LocalizationService";

class GameState extends React.Component {
	render() {
		let encounter_class = (this.props.active) ? "active" : "inactive";
		let rank_class      = (this.props.show_rank) ? "" : "hidden";
		let collapse_item   = () => {
			let icon = (this.props.collapsed) ? "expand" : "compress";
			let data = { state: !this.props.collapsed };

			return(
				<IconButton icon={icon} title={LocalizationService.getOverlayText("toggle_collapse")} key="toggle-collapsed" onClick={this.changeCollapse.bind(this, data)}/>
			);
		};

		let encounter       = this.props.encounter;
		let encounter_state = [];

		if (!encounter.title) {
			encounter_state.push("Awaiting encounter data...");
		} else {
			encounter_state.push(encounter.duration);

			if (encounter.title !== "Encounter") {
				encounter_state.push(encounter.title);
			}

			encounter_state.push(encounter.CurrentZoneName);
		}

		encounter_state = encounter_state.join(" - ");

		return (
			<div id="game-state">
				<span className={encounter_class}>{encounter_state}</span>
				<span>
					<span className={rank_class}>{this.props.rank}</span>
					{collapse_item()}
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
		collapsed : state.settings.intrinsic.collapsed
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameState);