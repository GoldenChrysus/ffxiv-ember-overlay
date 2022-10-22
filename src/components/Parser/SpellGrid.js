import React from "react";
import clone from "lodash.clonedeep";

import EmberComponent from "../EmberComponent";
import LocalizationService from "../../services/LocalizationService";

import OverlayInfo from "./PlayerTable/OverlayInfo";
import Spell from "./SpellGrid/Spell";
import SpellService from "../../services/SpellService";

class SpellGrid extends EmberComponent {
	constructor(props) {
		super(props);

		this.mounted = false;
		this.state = {
			active : false,
		};
	}

	componentDidUpdate() {
		this.determineState();
	}

	componentDidMount() {
		this.mounted = true;

		this.determineState();
	}

	determineState() {
		if (!this.state.active) {
			const state = {
				active : (
					this.props.from_builder ||
					(this.props.encounter && Object.keys(this.props.encounter).length) ||
					Object.keys(this.props.spells).length
				),
			};

			if (this.mounted) {
				this.setState(state);
			} else {
				this.state = state;
			}
		}
	}

	render() {
		const overlay_info = (this.state.active) ? "" : <OverlayInfo mode='spells' settings={this.props.settings}/>;
		const row_limit    = this.props.settings.spells_per_row;
		const uuid         = this.props.settings.uuid || "default";
		const width        = (100 / row_limit);
		const spells       = this.buildSpells();
		const style        = `
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

		const props   = clone(this.props);
		const classes = [props.className || ""];

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
				<style type='text/css'>
					{style}
				</style>
				<div {...props} className={classes.join(" ")} data-key={uuid} ref='spell_grid'>
					{spells}
				</div>
				{overlay_info}
			</React.Fragment>
		);
	}

	buildSpells() {
		const uuid = this.props.settings.uuid || "default";

		if (this.props.is_draggable) {
			const spell = SpellService.getDemoSpell();

			const text   = [];
			const spells = [];

			for (let value of this.props.section.types) {
				value = value.split("-");
				value = LocalizationService.getSpellTrackingOption(value[0], value[1]) || LocalizationService.getSpellTrackingOption(value[0], value[1], undefined, true);

				if (value === false) {
					continue;
				}

				text.push(value);
			}

			for (let i = 1; i <= 5; i++) {
				spells.push(
					<Spell
						key={"demo-spell-" + i}
						base_key={"demo-spell-" + i}
						order={i}
						grid_uuid='demo'
						spell={spell}
						cooldown={spell.cooldown}
						reverse={false}
						layout={this.props.settings.layout}
						spells_per_row={this.props.settings.spells_per_row}
						show_icon={this.props.settings.show_icon}
						warning_threshold={0}
						warning={false}
						border={false}
						indicator={"none"}
						bottom_left={false}
					/>,
				);
			}

			return (
				<React.Fragment>
					{spells}
					<span className='types'>{text.join(", ")}</span>
				</React.Fragment>
			);
		}

		const spells           = Object.keys(this.props.spells);
		const items            = [];
		const decimal_accuracy = (this.props.settings.layout === "icon") ? 0 : 1;
		const default_types    = [
			"you-skill",
			"you-effect",
			"you-dot",
			"you-debuff",
		];

		spells.sort((a, b) => {
			const a_spell  = this.props.spells[a];
			const static_a = this.props.settings[`always_${a_spell.subtype}_static`];
			const b_spell  = this.props.spells[b];
			const static_b = this.props.settings[`always_${b_spell.subtype}_static`];

			if (a_spell.defaulted || b_spell.defaulted) {
				if (a_spell.defaulted && !b_spell.defaulted) {
					return -1;
				}

				if (b_spell.defaulted && !a_spell.defaulted) {
					return 1;
				}

				if (static_a && !static_b) {
					return -1;
				}

				if (static_b && !static_a) {
					return 1;
				}

				if (static_a && static_b) {
					if (a_spell.subtype === b_spell.subtype) {
						return (a_spell.type_position > b_spell.type_position) ? 1 : -1;
					}

					const types = (this.props.section) ? this.props.section.types : default_types;

					return (types.indexOf(a_spell.log_type) > types.indexOf(b_spell.log_type)) ? 1 : -1;
				}
			}

			if (Number(a_spell.cooldown) === Number(b_spell.cooldown)) {
				if (a_spell.type !== b_spell.type || a_spell.dot || b_spell.dot) {
					if (a_spell.type === "skill") {
						return -1;
					}

					if (b_spell.type === "skill") {
						return 1;
					}

					if (!a_spell.dot) {
						return -1;
					}

					if (!b_spell.dot) {
						return 1;
					}

					return (a_spell.name < b_spell.name) ? -1 : 1;
				}

				return (a_spell.name < b_spell.name) ? -1 : 1;
			}

			return (Number(a_spell.cooldown) < Number(b_spell.cooldown)) ? -1 : 1;
		});

		for (const i in spells) {
			const key      = spells[i];
			const spell    = this.props.spells[key];
			const type     = spell.subtype;
			const party    = (spell.party) ? "party_" : "";
			let cooldown = spell.cooldown;

			if (cooldown <= 9.9) {
				cooldown = cooldown.toFixed(1);
			} else {
				cooldown = cooldown.toFixed(decimal_accuracy);
			}

			items.push(
				<Spell
					key={key}
					base_key={key}
					order={Number(i) + 1}
					grid_uuid={uuid}
					spell={spell}
					cooldown={cooldown}
					reverse={this.props.settings[`${party}reverse_${type}`]}
					layout={this.props.settings.layout}
					spells_per_row={this.props.settings.spells_per_row}
					show_icon={this.props.settings.show_icon}
					warning_threshold={this.props.settings.warning_threshold}
					warning={this.props.settings.designer[type].warning}
					border={this.props.settings.designer[type].border}
					indicator={this.props.settings.designer[type].indicator}
					bottom_left={this.props.settings.designer[type].cooldown_bottom_left}
					show_hover_names={this.props.settings.designer.general.show_hover_names}
				/>,
			);
		}

		return items;
	}
}

export default SpellGrid;
