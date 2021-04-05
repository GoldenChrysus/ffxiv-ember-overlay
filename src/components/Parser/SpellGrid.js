import React from "react";

import SkillData from "../../constants/SkillData";

import OverlayInfo from "./PlayerTable/OverlayInfo";
import Spell from "./SpellGrid/Spell";

class SpellGrid extends React.Component {
	timer          = null;
	spells         = null;
	pending_update = false;
	mounted        = false;

	constructor(props) {
		super(props);

		this.spells = {};
		this.state  = {
			spells : {}
		};

		this.processSpells(this.props.spells);
	}

	componentDidUpdate(prev_props) {
		let new_spells = {};

		for (let id in this.props.spells) {
			if (!prev_props.spells[id]) {
				new_spells[id] = this.props.spells[id];
			}
		}

		if (Object.keys(new_spells).length) {
			this.processSpells(new_spells);
		}
	}

	componentWillMount() {
		this.mounted = true;
	}

	componentDidMount() {
		if (this.pending_update) {
			this.pending_update = false;

			this.processSpells();
		}
	}

	componentWillUnmount() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	render() {
		let overlay_info = ((this.props.encounter && Object.keys(this.props.encounter).length) || Object.keys(this.props.spells).length) ? "" : <OverlayInfo/>;
		let row_limit    = this.props.settings.spells_per_row;
		let width        = (100 / row_limit);
		let spells       = this.buildSpells();
		let style        = `
			#container #inner #content #spell-grid .spell-container {
				width: calc(${width}% - 5px);
				margin-right: 5px;
			}

			#container #inner #content #spell-grid .spell-container:nth-of-type(${row_limit}n) {
				width: ${width}%;
				margin-right: 0;
			}
		`;

		return (
			<React.Fragment>
				<style type="text/css">
					{style}
				</style>
				<div id="spell-grid" className="spell-grid" ref="spell_grid">
					{spells}
				</div>
				{overlay_info}
			</React.Fragment>
		);
	}

	buildSpells() {
		let spells = Object.keys(this.state.spells);
		let items  = [];

		spells.sort((a, b) => {
			if (+this.state.spells[a] === +this.state.spells[b]) {
				return 0;
			}

			return (+this.state.spells[a] < +this.state.spells[b]) ? -1 : 1;
		});

		for (let id of spells) {
			items.push(<Spell key={"spell-" + id} id={id} cooldown={this.state.spells[id]} settings={this.props.settings}/>);
		}

		return items;
	}

	processSpells(spells) {
		let state = this.state;

		for (let id in spells) {
			let date  = new Date(spells[id]);
			let skill = SkillData.oGCDSkills[id];

			date.setSeconds(date.getSeconds() + skill.recast);

			this.spells[id] = date;

			state.spells[id] = skill.recast;
		}
		
		if (this.mounted) {
			this.setState(state);

			if (this.timer === null) {
				this.startTimer();
			}
		} else {
			this.pending_update = true;
		}
	}

	cancelTimer() {

	}

	startTimer() {
		setInterval(
			this.updateCooldowns.bind(this),
			100
		);
	}

	updateCooldowns() {
		let now   = new Date();
		let state = this.state;

		for (let id in this.spells) {
			let diff = this.spells[id] - now;

			if (diff <= 0) {
				delete this.state.spells[id];
				continue;
			}

			state.spells[id] = (diff / 1000).toFixed(1);
		}

		this.setState(state);
	}
}

export default SpellGrid;