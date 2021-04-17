import React from "react";

import EmberComponent from "../../EmberComponent";
import LocalizationService from "../../../services/LocalizationService";

class Spell extends EmberComponent {
	constructor(props) {
		super(props);

		this.animate_ref = React.createRef();
	}

	componentDidUpdate(prev_props) {
		if (prev_props.cooldown && +this.props.cooldown > +prev_props.cooldown) {
			if (this.animate_ref.current) {
				this.animate_ref.current.classList.remove("animate");

				// this forces DOM refresh so the animate add has effect
				// eslint-disable-next-line
				let foo = this.animate_ref.current.offsetHeight;

				this.animate_ref.current.classList.add("animate");
			}
		}
	}

	render() {
		let id        = this.props.spell.id;
		let real_type = this.props.spell.type;
		let type      = (this.props.spell.dot) ? "dot" : real_type;
		let classes   = [
			"spell-container",
			this.props.base_key,
			type
		];
		let half_cd   = this.props.spell.recast / 2;
		let breaker   = (this.props.layout === "icon" && +this.props.order % +this.props.spells_per_row === 0)
			? <span key={"spell-breaker-" + this.props.base_key} className="breaker" style={{order: this.props.order}}></span>
			: "";
		let style     = `
			.spell-grid[data-key="${this.props.grid_uuid}"] .spell-container.icon.${this.props.base_key} .timer.animate .container.left .block {
				animation: right ${half_cd}s linear;
			}

			.spell-grid[data-key="${this.props.grid_uuid}"] .spell-container.icon.${this.props.base_key} .timer.animate .container.right .block {
				animation: left ${half_cd}s linear;
				animation-delay: ${half_cd}s;
			}

			.spell-grid[data-key="${this.props.grid_uuid}"] .spell-container.${this.props.base_key}:not(.icon) .row.animate {
				animation: horizontal ${this.props.spell.recast}s linear !important;
			}
		`;
		let timer     = (this.props.layout === "icon")
			? 
				<div key={"spell-timer-" + this.props.base_key} className="timer animate" ref={this.animate_ref}>
					<div className="container left">
						<div className="block"></div>
					</div>
					<div className="container right">
						<div className="block"></div>
					</div>
				</div>
			: "";
		let icon      = (!this.props.show_icon && this.props.layout !== "icon")
			? ""
			: <div key={"spell-icon-" + this.props.base_key} className={"icon " + type}>
				<img src={"img/icons/" + real_type + "s/" + id + ".jpg"} alt={real_type + "-" + id}/>
			</div>;

		if (this.props.layout !== "normal") {
			classes.push(this.props.layout);
		}

		if (this.props.reverse) {
			classes.push("reverse");
		}

		if (!icon) {
			classes.push("no-icon");
		}

		if (this.props.cooldown <= this.props.warning_threshold) {
			classes.push("warning");
		}

		return(
			<React.Fragment>
				<div key={"spell-container-" + this.props.base_key} className={classes.join(" ")} style={{order: this.props.order}}>
					<style type="text/css">
						{style}
					</style>
					{icon}
					<div key={"spell-row-" + this.props.base_key} className="row animate" ref={this.props.layout !== "icon" ? this.animate_ref : ""}>
						<span key={"spell-name-" + this.props.base_key} className="name">{this.getName(real_type)}</span>
						<span key={"spell-cooldown-" + this.props.base_key} className="cooldown">{this.props.cooldown}</span>
					</div>
					{timer}
				</div>
				{breaker}
			</React.Fragment>
		);
	}

	getName(type) {
		switch (type) {
			case "skill":
				return this.props.spell.name || LocalizationService.getoGCDSkillName(this.props.spell.id);

			case "effect":
				return this.props.spell.name || LocalizationService.getEffectName(this.props.spell.id);

			default:
				return this.props.spell.name;
		}
	}
}

export default Spell;