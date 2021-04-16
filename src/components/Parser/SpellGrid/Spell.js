import React from "react";

import LocalizationService from "../../../services/LocalizationService";

class Spell extends React.Component {
	render() {
		let id        = this.props.spell.id;
		let width     = ((this.props.cooldown / this.props.spell.recast) * 100) + "%";
		let real_type = this.props.spell.type;
		let type      = (this.props.spell.dot) ? "dot" : real_type;
		let bg_x      = (this.props.settings[`reverse_${type}`]) ? "100%" : "0";
		let classes   = ["spell-container"];
		let breaker   = (this.props.settings.layout === "icon" && +this.props.order % +this.props.settings.spells_per_row === 0)
			? <span className="breaker" style={{order: this.props.order}}></span>
			: "";
		let icon      = () => {
			if (!this.props.settings.show_icon && this.props.settings.layout !== "icon") {
				return "";
			}

			return(
				<div className={"icon " + type}>
					<img src={"img/icons/" + real_type + "s/" + id + ".jpg"} alt={real_type + "-" + id}/>
				</div>
			);
		};

		if (this.props.settings.layout !== "default") {
			classes.push(this.props.settings.layout);
		}

		if (this.props.cooldown <= this.props.settings.warning_threshold) {
			classes.push("warning");
		}

		return(
			<React.Fragment>
				<div className={classes.join(" ")} style={{order: this.props.order}}>
					{icon()}
					<div className="row" style={{backgroundSize: width + " 100%", backgroundPosition: bg_x + " 0"}}>
						<span className="name">{this.getName(real_type)}</span>
						<span className="cooldown">{this.props.cooldown}</span>
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