import React from "react";
import { connect } from "react-redux";
import { ContextMenu, MenuItem } from "react-contextmenu";
import { loadHistoryEntry } from "../../../redux/actions/index";

class EncounterMenu extends React.Component {
	render() {
		const options = [];
		let i         = 0;

		for (const encounter of this.props.history) {
			if (!encounter.game.Encounter) {
				continue;
			}

			let title = [];

			title.push((encounter.game.Encounter.title !== "Encounter") ? encounter.game.Encounter.title : encounter.game.Encounter.CurrentZoneName);
			title.push(encounter.game.Encounter.duration);

			title = title.join(" - ");

			options.push(
				<MenuItem key={"encounter-history-item-" + i} onClick={this.loadHistoryEntry.bind(this, i)}>
					{title}
				</MenuItem>,
			);

			i++;
		}

		if (!options.length) {
			options.push(
				<MenuItem key='no-encounter'>
					No encounters available.
				</MenuItem>,
			);
		}

		return (
			<ContextMenu id='encounter-history-menu' className='container-context-menu'>
				<div className='item-group'>
					{options}
				</div>
			</ContextMenu>
		);
	}

	loadHistoryEntry(index) {
		this.props.loadHistoryEntry(index);
	}
}

const mapDispatchToProps = dispatch => ({
	loadHistoryEntry(data) {
		dispatch(loadHistoryEntry(data));
	},
});

const mapStateToProps = state => ({
	history : state.internal.encounter_history,
});

export default connect(mapStateToProps, mapDispatchToProps)(EncounterMenu);
