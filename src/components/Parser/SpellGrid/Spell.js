import React from "react";

import EmberComponent from "../../EmberComponent";
import LocalizationService from "../../../services/LocalizationService";

class Spell extends EmberComponent {
	constructor(props) {
		super(props);

		this.animate_ref = React.createRef();
		this.rendered    = false;
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
		let id          = this.props.spell.id;
		let real_type   = this.props.spell.type;
		let type        = (this.props.spell.dot) ? "dot" : real_type;
		let is_zero     = (+this.props.cooldown === 0);
		let animate     = (!is_zero && this.props.indicator === "ticking") ? "animate" : false;
		let classes     = [
			"spell-container",
			this.props.base_key,
			type,
			this.props.indicator
		];
		let half_cd     = this.props.spell.recast / 2;
		let breaker     = (this.props.layout === "icon" && +this.props.order % +this.props.spells_per_row === 0)
			? <span key={"spell-breaker-" + this.props.base_key} className="breaker" style={{order: this.props.order}}></span>
			: "";
		let inverse     = (this.props.reverse) ? "-inverse" : "";
		let left_delay  = (this.props.reverse) ? half_cd : 0;
		let right_delay = (!this.props.reverse) ? half_cd : 0;
		let style       = (!is_zero)
			? `
				.spell-grid[data-key="${this.props.grid_uuid}"] .spell-container.icon.${this.props.base_key} .timer.animate .container.left .block {
					animation: right${inverse} ${half_cd}s linear;
					animation-delay: ${left_delay}s;
				}

				.spell-grid[data-key="${this.props.grid_uuid}"] .spell-container.icon.${this.props.base_key} .timer.animate .container.right .block {
					animation: left${inverse} ${half_cd}s linear;
					animation-delay: ${right_delay}s;
				}

				.spell-grid[data-key="${this.props.grid_uuid}"] .spell-container.${this.props.base_key}:not(.icon) .row.animate {
					animation: horizontal ${this.props.spell.recast}s linear !important;
				}
			`
			: "";
		let timer     = (!is_zero && this.props.layout === "icon")
			? 
				<div key={"spell-timer-" + this.props.base_key} className={"timer " + animate} ref={(animate) ? this.animate_ref : ""}>
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

		if (this.props.warning && this.props.cooldown <= this.props.warning_threshold && this.props.cooldown > 0) {
			classes.push("warning");
		}

		if (this.props.border) {
			classes.push("border");
		}

		if (icon && this.props.bottom_left) {
			classes.push("bottom-left");
		}

		if (is_zero) {
			classes.push("off-cooldown");
		}

		return(
			<React.Fragment>
				<div key={"spell-container-" + this.props.base_key} className={classes.join(" ")} style={{order: this.props.order}}>
					<style type="text/css" key={"spell-container-style-" + this.props.base_key}>
						{style}
					</style>
					{icon}
					<div key={"spell-row-" + this.props.base_key} className={"row " + animate} ref={animate && this.props.layout !== "icon" ? this.animate_ref : ""}>
						<span key={"spell-name-" + this.props.base_key} className="name">{this.getName(real_type)}</span>
						<span key={"spell-cooldown-" + this.props.base_key} className="cooldown">{(!is_zero) ? this.props.cooldown : ""}</span>
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