import React from "react";
import { HashRouter as Router, Route, Redirect, NavLink } from "react-router-dom";
import { Grid, Menu } from "semantic-ui-react";

import SettingsSchema from "../constants/SettingsSchema";
import TwitchAPIService from "../services/TwitchAPIService";

import Screen from "./Settings/Screen";
import Export from "./Settings/Export";
import About from "./Settings/About";
import Streamers from "./Settings/Streamers";

import "./../styles/components/settings/settings-theme.less";

class Settings extends React.Component {
	componentWillMount() {
		TwitchAPIService.getLiveStreamers()
			.then((data) => {
				this.setState({
					stream_type : data.type,
					streamers   : data.streamers
				});
			})
			.catch((e) => {

			});
	}

	render() {
		let base_url           = this.props.match.url;
		let nav_links          = [];
		let routes             = [];
		let streamers          = (this.state && this.state.streamers) ? this.state.streamers : {};
		let stream_type        = (this.state && this.state.stream_type) ? this.state.stream_type : "offline";
		let streamer_count     = (streamers) ? Object.keys(streamers).length : 0;
		let streamer_pluralize = (streamer_count > 1) ? "Streamers" : "Streamer";
		let streamer_text      = (streamer_count && this.state.stream_type === "live") ? `${streamer_count} ${streamer_pluralize} Live` : "Streamers";

		for (let section of SettingsSchema.sections) {
			let path = `${base_url}/${section.path}`;

			nav_links.push(
				<NavLink to={path} className="item" key={section.path}>{section.title}</NavLink>
			);

			routes.push(
				<Route path={path} key={path} render={() => <Screen sections={section.sections}/>}/>
			);
		}

		return (
			<React.Fragment>
				<Router>
					<Grid celled id="settings-container">
						<Grid.Row>
							<Grid.Column width={3} id="settings-sidebar">
								<Menu vertical id="settings-menu">
									{nav_links}
									<NavLink to={base_url + "/export"} className="item">Export</NavLink>
									<NavLink to={base_url + "/about"} className="item">About</NavLink>
									<NavLink to={base_url + "/streamers"} className="streamers item">{streamer_text}</NavLink>
								</Menu>
							</Grid.Column>
							<Grid.Column width={13} id="settings-screen">
								<Route exact path={base_url} render={() => (
									<Redirect to={base_url + "/about"}/>
								)}/>
								{routes}
								<Route path={base_url + "/export"} component={Export}/>
								<Route path={base_url + "/about"} component={About}/>
								<Route path={base_url + "/streamers"} render={() => <Streamers streamers={streamers} type={stream_type}/>}/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Router>
			</React.Fragment>
		);
	}
}

export default Settings;