import React from "react";

import EmberComponent from "../../EmberComponent";
import LocalizationService from "../../../services/LocalizationService";

class Spell extends EmberComponent {
	render() {
		let id        = this.props.spell.id;
		let width     = ((this.props.cooldown / this.props.spell.recast) * 100) + "%";
		let real_type = this.props.spell.type;
		let type      = (this.props.spell.dot) ? "dot" : real_type;
		let bg_x      = (this.props.reverse) ? "100%" : "0";
		let classes   = ["spell-container"];
		let breaker   = (this.props.layout === "icon" && +this.props.order % +this.props.spells_per_row === 0)
			? <span key={"spell-breaker-" + this.props.base_key} className="breaker" style={{order: this.props.order}}></span>
			: "";
		let icon      = () => {
			if (!this.props.show_icon && this.props.layout !== "icon") {
				return "";
			}

			return(
				<div key={"spell-icon-" + this.props.base_key} className={"icon " + type}>
					<img src={"img/icons/" + real_type + "s/" + id + ".jpg"} alt={real_type + "-" + id}/>
				</div>
			);
		};

		if (this.props.layout !== "normal") {
			classes.push(this.props.layout);
		}

		if (this.props.cooldown <= this.props.warning_threshold) {
			classes.push("warning");
		}

		return(
			<React.Fragment>
				<div key={"spell-container-" + this.props.base_key} className={classes.join(" ")} style={{order: this.props.order}}>
					{icon()}
					<div key={"spell-row-" + this.props.base_key} className="row" style={{backgroundSize: width + " 100%", backgroundPosition: bg_x + " 0"}}>
						<span key={"spell-name-" + this.props.base_key} className="name">{this.getName(real_type)}</span>
						<span key={"spell-cooldown-" + this.props.base_key} className="cooldown">{this.props.cooldown}</span>
					</div>
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