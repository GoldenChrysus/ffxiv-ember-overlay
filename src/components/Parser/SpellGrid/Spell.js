import React from "react";
import ReactTooltip from "react-tooltip";

import EmberComponent from "../../EmberComponent";
import LocalizationService from "../../../services/LocalizationService";
import AnimateService from "../../../services/AnimateService";

class Spell extends EmberComponent {
	constructor(props) {
		super(props);

		this.animate_ref = React.createRef();
		this.rendered = false;
	}

	componentDidUpdate(prev_props) {
		if (prev_props.cooldown && Number(this.props.cooldown) > Number(prev_props.cooldown)) {
			if (this.animate_ref.current) {
				this.animate_ref.current.classList.remove("animate");

				// This forces DOM refresh so the animate add has effect
				// eslint-disable-next-line
				let foo = this.animate_ref.current.offsetHeight;

				this.animate_ref.current.classList.add("animate");

				this.animateTicker();
			}
		}

		if (this.props.show_hover_names !== prev_props.show_hover_names) {
			ReactTooltip.rebuild();
		}
	}

	componentDidMount() {
		if (this.props.show_hover_names) {
			ReactTooltip.rebuild();
		}

		if (this.animate_ref.current) {
			this.animateTicker();
		}
	}

	render() {
		const id           = this.props.spell.id;
		const main_type    = this.props.spell.type;
		const type         = this.props.spell.subtype;
		const name         = this.getName(main_type);
		const is_zero      = (Number(this.props.cooldown) === 0);
		const animate      = (!is_zero && this.props.indicator === "ticking") ? "animate" : false;
		const classes      = [
			"spell-container",
			this.props.base_key,
			type,
			this.props.indicator,
		];
		const breaker      = (this.props.layout === "icon" && Number(this.props.order) % Number(this.props.spells_per_row) === 0) ?
			<span key={"spell-breaker-" + this.props.base_key} className='breaker' style={{ order : this.props.order }}></span> :
			"";
		const border       = "";
		const style        = (!is_zero) ?
			`
				.spell-grid[data-key="${this.props.grid_uuid}"] .spell-container.${this.props.base_key}:not(.icon) .row.animate {
					animation: horizontal ${this.props.spell.recast}s linear !important;
				}
			` :
			"";
		const timer      = (!is_zero && this.props.layout === "icon") ?
			((animate) ?
				<canvas key={"spell-timer-" + this.props.base_key} className='timer' ref={(animate) ? this.animate_ref : ""}></canvas> :
				<div key={"spell-timer-" + this.props.base_key} className='timer'></div>
			) :
			"";
		const icon       = (!this.props.show_icon && this.props.layout !== "icon") ?
			"" :
			<div key={"spell-icon-" + this.props.base_key} className={"icon " + type}>
				<img src={"img/icons/" + main_type + "s/" + id + ".jpg"} alt={main_type + "-" + id}/>
			</div>;
		const attributes = {
			key       : "spell-container-" + this.props.base_key,
			className : "",
			style     : {
				order : this.props.order,
			},
		};

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

		attributes.className = classes.join(" ");

		if (this.props.show_hover_names) {
			attributes["data-tip"] = name;
		}

		return (
			<React.Fragment>
				<div {...attributes}>
					<style type='text/css' key={"spell-container-style-" + this.props.base_key}>
						{style}
					</style>
					{icon}
					<div key={"spell-row-" + this.props.base_key} className={"row " + animate} ref={animate && this.props.layout !== "icon" ? this.animate_ref : ""}>
						<span key={"spell-name-" + this.props.base_key} className='name'>{name}</span>
						<span key={"spell-cooldown-" + this.props.base_key} className='cooldown'>{(!is_zero) ? this.props.cooldown : ""}</span>
					</div>
					{border}
					{timer}
				</div>
				{breaker}
			</React.Fragment>
		);
	}

	animateTicker() {
		if (this.props.layout !== "icon") {
			return;
		}

		AnimateService.animateTicker(this.animate_ref.current, this.props.spell.recast, this.props.reverse);
	}

	getName(type) {
		return this.props.spell.name || LocalizationService.getSpellName(type, this.props.spell.id);
	}
}

export default Spell;
