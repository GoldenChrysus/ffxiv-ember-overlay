import React from "react";
import { Icon } from "semantic-ui-react";

class SocialLink extends React.Component {
	   render() {
	   		let getLink = () => {
	   			let name = this.props.name || "";

	   			switch (this.props.type) {
	   				case "twitter":
	   					return `https://twitter.com/${name}`;

	   				case "twitch":
	   					return `https://www.twitch.tv/${name}`;

	   				default:
	   					return this.props.url;
	   			}
	   		}

	   		return(
	   			<a href={getLink()} target="_blank" rel="noreferrer noopener"><Icon name={this.props.type}/></a>
	   		);
	   }
}

export default SocialLink;