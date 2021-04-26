import React from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";

import DiscordService from "../../../services/DiscordService";
import LocalizationService from "../../../services/LocalizationService";

class DiscordMenu extends React.Component {
	render() {
		let options = [
			<MenuItem key="discord-menu-join" onClick={DiscordService.openDiscordWindow}>
				{LocalizationService.getOverlayText("join_discord")}
			</MenuItem>
		];
		
		if (this.props.webhook) {
			options.push(
				<MenuItem key="discord-menu-webhook" onClick={DiscordService.postToWebhook}>
					{LocalizationService.getOverlayText("discord_webhook")}
				</MenuItem>
			);
		}

		return (
			<ContextMenu id="discord-menu" className="container-context-menu">
				<div className="item-group">
					{options}
				</div>
			</ContextMenu>
		);
	}
}



export default DiscordMenu;