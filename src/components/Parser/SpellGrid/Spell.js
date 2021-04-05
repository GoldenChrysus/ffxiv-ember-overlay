import React from "react";

import LocalizationService from "../../../services/LocalizationService";

import SkillData from "../../../constants/SkillData";

class Spell extends React.Component {
	render() {
		let id    = this.props.id;
		let width = ((this.props.cooldown / SkillData.oGCDSkills[id].recast) * 100) + "%";
		let icon  = () => {
			if (!this.props.settings.show_icon) {
				return "";
			}

			return(
				<div className="icon">
					<img src={"img/icons/skills/" + id + ".jpg"} alt={"skill-" + id}/>
				</div>
			);
		};

		return(
			<div className="spell-container">
				{icon()}
				<div className="row" style={{backgroundSize: width + " 100%"}}>
					<span className="name">{LocalizationService.getoGCDSkillName(id)}</span>
					<span className="cooldown">{this.props.cooldown}</span>
				</div>
			</div>
		);
	}
}

export default Spell;