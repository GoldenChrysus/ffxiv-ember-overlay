import React from "react";
import clone from "lodash.clonedeep";

import EmberComponent from "../EmberComponent";
import LocalizationService from "../../services/LocalizationService";

import OverlayInfo from "./PlayerTable/OverlayInfo";
import Spell from "./SpellGrid/Spell";

class SpellGrid extends EmberComponent {
	constructor(props) {
		super(props);

		this.state = {
			active : false
		};
	}

	componentDidUpdate() {
		if (!this.state.active) {
			this.setState({
				active : (
					this.props.from_builder ||
					(this.props.encounter && Object.keys(this.props.encounter).length) ||
					Object.keys(this.props.spells).length
				)
			});
		}
	}

	render() {
		let overlay_info = this.state.active ? "" : <OverlayInfo mode="spells" settings={this.props.settings}/>;
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

		let spells           = Object.keys(this.props.spells);
		let items            = [];
		let decimal_accuracy = (this.props.settings.layout === "icon") ? 0 : 1;

		spells.sort((a, b) => {
			if (+this.props.spells[a].cooldown === +this.props.spells[b].cooldown) {
				if (this.props.spells[a].type !== this.props.spells[b].type || this.props.spells[a].dot || this.props.spells[b].dot) {
					if (this.props.spells[a].type === "skill") {
						return -1;
					} else if (this.props.spells[b].type === "skill") {
						return 1;
					}

					if (!this.props.spells[a].dot) {
						return -1;
					} else if (!this.props.spells[b].dot) {
						return 1;
					}

					return (this.props.spells[a].name < this.props.spells[b].name) ? -1 : 1;
				} else {
					return (this.props.spells[a].name < this.props.spells[b].name) ? -1 : 1;
				}
			}

			return (+this.props.spells[a].cooldown < +this.props.spells[b].cooldown) ? -1 : 1;
		});

		for (let i in spells) {
			let key      = spells[i];
			let spell    = this.props.spells[key];
			let type     = spell.subtype;
			let party    = (spell.party) ? "party_" : "";
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
					order={+i + 1}
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
				/>
			);
		}

		return items;
	}
}

export default SpellGrid;