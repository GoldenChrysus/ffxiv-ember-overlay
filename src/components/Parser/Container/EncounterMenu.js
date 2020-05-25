import React from "react";
import { connect } from "react-redux";
import { ContextMenu, MenuItem } from "react-contextmenu";

class EncounterMenu extends React.Component {
	render() {
		let options = [];
		let i       = 0;

		for (let encounter of this.props.history) {
			options.push(
				<MenuItem key={"encounter-history-item-" + i}>
					{encounter.game.Encounter.title} - {encounter.game.Encounter.duration}
				</MenuItem>
			);

			i++;
		}

		if (!options.length) {
			options.push(
				<MenuItem key="no-encounter">
					No encounters available.
				</MenuItem>
			);
		}

		return (
			<ContextMenu id="encounter-history-menu" className="container-context-menu">
				<div className="item-group">
					{options}
				</div>
			</ContextMenu>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		history : state.internal.encounter_history
	};
};

export default connect(mapStateToProps)(EncounterMenu);