import React from "react";
import clone from "lodash.clonedeep";

import EmberComponent from "../EmberComponent";
import SkillData from "../../constants/SkillData";
import LocalizationService from "../../services/LocalizationService";
import TTSService from "../../services/TTSService";

import OverlayInfo from "./PlayerTable/OverlayInfo";
import Spell from "./SpellGrid/Spell";

class SpellGrid extends EmberComponent {
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
		this.mounted = false;

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

	componentDidMount() {
		this.mounted = true;

		this.processSpells();
	}

	componentWillUnmount() {
		this.cancelTimer();
	}

	render() {
		let overlay_info = (
			this.props.from_builder ||
			(this.props.encounter && Object.keys(this.props.encounter).length) ||
			Object.keys(this.props.spells).length
		)
			? ""
			: <OverlayInfo mode="spells" settings={this.props.settings}/>;
		let row_limit    = this.props.settings.spells_per_row;
		let uuid         = this.props.settings.uuid || "default";
		let width        = (100 / row_limit);
		let spells       = this.buildSpells();
		let style        = `
			#root-inner:not(.right) #container #inner #content .spell-grid[data-key="${uuid}"] .spell-container {
				width: calc(${width}% - 5px);
				margin-right: 5px;
			}

			#root-inner:not(.right) #container #inner #content .spell-grid[data-key="${uuid}"] .spell-container:nth-of-type(${row_limit}n) {
				width: ${width}%;
				margin-right: 0;
			}

			#root-inner.right #container #inner #content .spell-grid[data-key="${uuid}"] .spell-container {
				width: calc(${width}% - 5px);
				margin-left: 5px;
			}

			#root-inner.right #container #inner #content .spell-grid[data-key="${uuid}"] .spell-container:nth-of-type(${row_limit}n) {
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
				<div {...props} className={classes.join(" ")} data-key={uuid} ref="spell_grid">
					{spells}
				</div>
				{overlay_info}
			</React.Fragment>
		);
	}

	buildSpells() {
		let uuid = this.props.settings.uuid || "default";

		if (this.props.is_draggable) {
			let text = [];

			for (let value of this.props.section.types) {
				value = value.split("-");
				value = LocalizationService.getSpellTrackingOption(value[0], value[1]) || LocalizationService.getSpellTrackingOption(value[0], value[1], undefined, true);

				if (value === false) {
					continue;
				}

				text.push(value)
			}

			return <span>{text.join(", ")}</span>;
		}

		let spells = Object.keys(this.state.spells);
		let items  = [];

		spells.sort((a, b) => {
			if (+this.state.spells[a] === +this.state.spells[b]) {
				if (this.spells[a].type !== this.spells[b].type || this.spells[a].dot || this.spells[b].dot) {
					if (this.spells[a].type === "skill") {
						return -1;
					} else if (this.spells[b].type === "skill") {
						return 1;
					}

					if (!this.spells[a].dot) {
						return -1;
					} else if (!this.spells[b].dot) {
						return 1;
					}

					return (this.spells[a].name < this.spells[b].name) ? -1 : 1;
				} else {
					return (this.spells[a].name < this.spells[b].name) ? -1 : 1;
				}
			}

			return (+this.state.spells[a] < +this.state.spells[b]) ? -1 : 1;
		});

		for (let i in spells) {
			let key   = spells[i];
			let type  = (this.spells[key].dot) ? "dot" : this.spells[key].type;
			let party = (this.spells[key].party) ? "party_" : "";

			items.push(
				<Spell
					key={key}
					base_key={key}
					order={+i + 1}
					grid_uuid={uuid}
					spell={this.spells[key]}
					cooldown={this.state.spells[key]}
					reverse={this.props.settings[`${party}reverse_${type}`]}
					layout={this.props.settings.layout}
					spells_per_row={this.props.settings.spells_per_row}
					show_icon={this.props.settings.show_icon}
					warning_threshold={this.props.settings.warning_threshold}
					warning={this.props.settings.designer[type].warning}
					border={this.props.settings.designer[type].border}
					indicator={this.props.settings.designer[type].indicator}
					bottom_left={this.props.settings.designer[type].cooldown_bottom_left}
				/>
			);
		}

		return items;
	}

	processSpells(spells, lost_spells) {
		if (this.props.is_draggable) {
			return;
		}

		let state     = clone(this.state);
		let builder   = (this.props.from_builder);
		let true_date = new Date();

		if (lost_spells) {
			for (let i in lost_spells) {
				if (this.props.settings.use_tts) {
					this.doTTS(i);
				}

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
				let type     = spells[i].type;

				if (new_date.getFullYear() !== 1970) {
					switch (type) {
						case "skill":
							recast = SkillData.oGCDSkills[spells[i].id].recast;

							break;

						case "effect":
							recast = spells[i].duration;
							dot    = SkillData.Effects[spells[i].id].dot;

							if (dot) {
								type = "dot";
							}

							break;

						default:
							break;
					}
					
					new_date.setSeconds(date.getSeconds() + recast);
				}

				if (new_date < true_date && !this.props.settings[`always_${type}`]) {
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
		} else {
			this.state = state;
		}

		if (this.timer === null && Object.keys(state.spells).length) {
			this.startTimer();
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
			250
		);
	}

	updateCooldowns() {
		let now              = new Date();
		let state            = {
			spells : {}
		};
		let decimal_accuracy = (this.props.settings.layout === "icon") ? 0 : 1;

		for (let i in this.spells) {
			let diff = this.spells[i].time - now;

			if (this.props.settings.use_tts && diff > -10000000) {
				let threshold = (this.props.settings.tts_trigger === "zero") ? 0 : this.props.settings.warning_threshold * 1000;

				if (diff <= threshold) {
					this.doTTS(i);
				}
			}

			if (diff <= 0) {
				let type = (this.spells[i].dot) ? "dot" : this.spells[i].type;

				if (!this.props.settings[`always_${type}`] || this.spells[i].party) {
					delete this.spells[i];
					delete state.spells[i];
					continue;
				} else {
					diff = 0;
				}
			}

			let cooldown = diff / 1000;

			if (cooldown <= 9.9) {
				cooldown = cooldown.toFixed(1);
			} else {
				cooldown = cooldown.toFixed(decimal_accuracy);
			}

			state.spells[i] = cooldown;
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

		TTSService.saySpell(i, this.spells[i].id, this.spells[i].type, this.spells[i].name);
	}
}

export default SpellGrid;