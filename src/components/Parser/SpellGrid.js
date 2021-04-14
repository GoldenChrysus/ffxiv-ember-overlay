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
		this.cancelTimer();
	}

	render() {
		let overlay_info = ((this.props.encounter && Object.keys(this.props.encounter).length) || Object.keys(this.props.spells).length) ? "" : <OverlayInfo mode="spells" settings={this.props.settings}/>;
		let row_limit    = this.props.settings.spells_per_row;
		let width        = (100 / row_limit);
		let spells       = this.buildSpells();
		let style        = `
			#root-inner:not(.right) #container #inner #content #spell-grid .spell-container {
				width: calc(${width}% - 5px);
				margin-right: 5px;
			}

			#root-inner:not(.right) #container #inner #content #spell-grid .spell-container:nth-child(${row_limit}n) {
				width: ${width}%;
				margin-right: 0;
			}

			#root-inner.right #container #inner #content #spell-grid .spell-container {
				width: calc(${width}% - 5px);
				margin-left: 5px;
			}

			#root-inner.right #container #inner #content #spell-grid .spell-container:nth-child(${row_limit}n) {
				width: ${width}%;
				margin-left: 0px;
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

		for (let i in spells) {
			let key = spells[i];

			items.push(<Spell key={key} order={+i + 1} spell={this.spells[key]} cooldown={this.state.spells[key]} settings={this.props.settings}/>);
		}

		return items;
	}

	processSpells(spells) {
		let state = this.state;

		for (let i in spells) {
			let date     = spells[i].time;
			let new_date = new Date(date);
			let recast   = 0;
			let dot      = false;

			switch (spells[i].type) {
				case "skill":
					recast = SkillData.oGCDSkills[spells[i].id].recast;

					break;

				case "effect":
					recast = spells[i].duration;
					dot    = SkillData.Effects[spells[i].id].dot;

					break;

				default:
					break;
			}

			new_date.setSeconds(date.getSeconds() + recast);

			this.spells[i] = {
				type   : spells[i].type,
				id     : spells[i].id,
				time   : new_date,
				name   : spells[i].name,
				recast : recast,
				dot    : dot
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
		if (this.timer) {
			clearInterval(this.timer);

			this.timer = null;
		}
	}

	startTimer() {
		this.timer = setInterval(
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
								TTSService.sayNow(LocalizationService.getEffectName(this.spells[i].id));
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

		if (!Object.keys(this.state.spells)) {
			this.cancelTimer();
		}

		this.setState(state);
	}
}

export default SpellGrid;