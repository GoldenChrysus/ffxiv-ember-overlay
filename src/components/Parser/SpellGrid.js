import React from "react";
import clone from "lodash.clonedeep";

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
		let new_spells  = false;
		let lost_spells = false;

		for (let i in this.props.spells) {
			if (!prev_props.spells[i] || prev_props.spells[i].time < this.props.spells[i].time) {
				if (!new_spells) {
					new_spells = {};
				}

				new_spells[i] = this.props.spells[i];
			}
		}

		for (let i in prev_props.spells) {
			if (!this.props.spells[i]) {
				if (!lost_spells) {
					lost_spells = {};
				}

				lost_spells[i] = true;
			}
		}

		if (new_spells || lost_spells) {
			this.processSpells(new_spells, lost_spells);
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
		let overlay_info = (
			this.props.from_builder === "true" ||
			(this.props.encounter && Object.keys(this.props.encounter).length) ||
			Object.keys(this.props.spells).length
		)
			? ""
			: <OverlayInfo mode="spells" settings={this.props.settings}/>;
		let row_limit    = this.props.settings.spells_per_row;
		let width        = (100 / row_limit);
		let spells       = this.buildSpells();
		let style        = `
			#root-inner:not(.right) #container #inner #content .spell-grid .spell-container {
				width: calc(${width}% - 5px);
				margin-right: 5px;
			}

			#root-inner:not(.right) #container #inner #content .spell-grid .spell-container:nth-child(${row_limit}n) {
				width: ${width}%;
				margin-right: 0;
			}

			#root-inner.right #container #inner #content .spell-grid .spell-container {
				width: calc(${width}% - 5px);
				margin-left: 5px;
			}

			#root-inner.right #container #inner #content .spell-grid .spell-container:nth-child(${row_limit}n) {
				width: ${width}%;
				margin-left: 0px;
			}
		`;

		let props   = clone(this.props);
		let classes = [props.className || ""];

		classes.push("spell-grid");

		if (this.props.is_draggable) {
			classes.push("draggable");
		}

		delete props.spells;
		delete props.encounter;
		delete props.settings;
		delete props.section;
		delete props.is_draggable;
		delete props.from_builder;

		return (
			<React.Fragment>
				<style type="text/css">
					{style}
				</style>
				<div {...props} className={classes.join(" ")} ref="spell_grid">
					{spells}
				</div>
				{overlay_info}
			</React.Fragment>
		);
	}

	buildSpells() {
		if (this.props.is_draggable) {
			let text = [];

			for (let value of this.props.section.types) {
				value = value.split("-");

				text.push(LocalizationService.getSpellTrackingOption(value[0], value[1]))
			}

			return <span>{text.join(", ")}</span>;
		}

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

	processSpells(spells, lost_spells) {
		if (this.props.is_draggable) {
			return;
		}

		let state     = this.state;
		let builder   = (this.props.from_builder === "true");
		let true_date = new Date();

		if (lost_spells) {
			for (let i in lost_spells) {
				this.doTTS(i);

				delete this.spells[i];
				delete state.spells[i];
			}
		}

		if (spells) {
			for (let i in spells) {
				if (builder && this.props.section.types.indexOf(spells[i].log_type) === -1) {
					continue;
				}

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

				if (new_date < true_date) {
					continue;
				}

				this.spells[i] = {
					type   : spells[i].type,
					id     : spells[i].id,
					time   : new_date,
					name   : spells[i].name,
					recast : recast,
					dot    : dot,
					party  : spells[i].party
				};

				state.spells[i] = recast;
			}
		}
		
		if (this.mounted) {
			this.setState(state);

			if (this.timer === null && Object.keys(this.state.spells).length) {
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

			if (this.props.settings.use_tts) {
				let threshold = (this.props.settings.tts_trigger === "zero") ? 0 : this.props.settings.warning_threshold * 1000;

				if (diff <= threshold) {
					this.doTTS(i);
				}
			}

			if (diff <= 0) {
				delete this.spells[i];
				delete this.state.spells[i];
				continue;
			}

			state.spells[i] = (diff / 1000).toFixed(1);
		}

		if (!Object.keys(this.state.spells).length) {
			this.cancelTimer();
		}

		this.setState(state);
	}

	doTTS(i) {
		if (!this.spells[i] || this.spells[i].tts) {
			return;
		}

		this.spells[i].tts = true;

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
}

export default SpellGrid;