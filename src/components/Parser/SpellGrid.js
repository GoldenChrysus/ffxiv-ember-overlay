import React from "react";

import SkillData from "../../constants/SkillData";
import LocalizationService from "../../services/LocalizationService";
import TTSService from "../../services/TTSService";

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

		for (let i in this.props.spells) {
			if (!prev_props.spells[i] || prev_props.spells[i].time < this.props.spells[i].time) {
				new_spells[i] = this.props.spells[i];
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

		for (let i of spells) {
			items.push(<Spell key={i} spell={this.spells[i]} cooldown={this.state.spells[i]} settings={this.props.settings}/>);
		}

		return items;
	}

	processSpells(spells) {
		let state = this.state;

		for (let i in spells) {
			let date   = new Date(spells[i].time);
			let recast = 0;

			switch (spells[i].type) {
				case "skill":
					recast = SkillData.oGCDSkills[spells[i].id].recast

					break;

				case "effect":
					recast = spells[i].duration;

					break;

				default:
					break;
			}

			date.setSeconds(date.getSeconds() + recast);

			this.spells[i] = {
				type   : spells[i].type,
				id     : spells[i].id,
				time   : date,
				name   : spells[i].name,
				recast : recast
			};

			state.spells[i] = recast;
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

		for (let i in this.spells) {
			let diff = this.spells[i].time - now;

			if (diff <= 0) {
				if (this.props.settings.use_tts) {
					let name = this.spells[i].name;

					if (!name) {
						switch (this.spells[i].type) {
							case "skill":
								TTSService.sayNow(LocalizationService.getoGCDSkillName(this.spells[i].id));
								break;

							case "effect":
								TTSService.sayNow(LocalizationService.getEffectOptions(this.spells[i].id));
								break;

							default:
								break;
						}
					}

					TTSService.sayNow(name);
				}

				delete this.spells[i];
				delete this.state.spells[i];
				continue;
			}

			state.spells[i] = (diff / 1000).toFixed(1);
		}

		this.setState(state);
	}
}

export default SpellGrid;