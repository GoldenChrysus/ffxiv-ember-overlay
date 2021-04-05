import React from "react";

import LocalizationService from "../../../services/LocalizationService";

import SkillData from "../../../constants/SkillData";

class Spell extends React.Component {
	render() {
		let id      = this.props.id;
		let width   = ((this.props.cooldown / SkillData.oGCDSkills[id].recast) * 100) + "%";
		let classes = ["spell-container"];
		let icon    = () => {
			if (!this.props.settings.show_icon) {
				return "";
			}

			return(
				<div className="icon">
					<img src={"img/icons/skills/" + id + ".jpg"} alt={"skill-" + id}/>
				</div>
			);
		};

		if (this.props.settings.minimal_layout) {
			classes.push("minimal");
		}

		return(
			<div className={classes.join(" ")}>
				{icon()}
				<div className="row" style={{backgroundSize: width + " 100%"}}>
					<span className="name">{this.props.name || LocalizationService.getoGCDSkillName(id)}</span>
					<span className="cooldown">{this.props.cooldown}</span>
				</div>
			</div>
		);
	}
}

export default Spell;