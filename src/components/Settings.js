import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Redirect, NavLink } from "react-router-dom";
import { Grid, Menu } from "semantic-ui-react";

import LocalizationService from "../services/LocalizationService";
import SettingsSchema from "../constants/SettingsSchema";
import TwitchAPIService from "../services/TwitchAPIService";

import Screen from "./Settings/Screen";
import Export from "./Settings/Export";
import About from "./Settings/About";
import Streamers from "./Settings/Streamers";
import Donate from "./Settings/Donate";

import "./../styles/components/settings/settings-theme.less";

class Settings extends React.Component {
	UNSAFE_componentWillMount() {
		TwitchAPIService.getLiveStreamers()
			.then(data => {
				this.setState({
					stream_type : data.type,
					streamers   : data.streamers,
				});
			})
			.catch(() => {});
	}

	render() {
		const base_url           = this.props.match.url;
		const nav_links          = [];
		const routes             = [];
		const streamers          = (this.state && this.state.streamers) ? this.state.streamers : {};
		const stream_type        = (this.state && this.state.stream_type) ? this.state.stream_type : "offline";
		const streamer_count     = (streamers) ? Object.keys(streamers).length : 0;
		const streamer_base_text = (streamer_count && stream_type === "live") ?
			LocalizationService.getMisc((streamer_count > 1) ? "streamers_live" : "streamer_live") :
			LocalizationService.getMisc("streamers");
		const streamer_text      = streamer_base_text.replace("{{number}}", streamer_count);

		for (
			const section of
			SettingsSchema.all_before.sections.concat(
				SettingsSchema[this.props.mode].sections.concat(
					SettingsSchema.all_after.sections),
			)
		) {
			const section_path = section.path;
			const path         = `${base_url}/${section_path}`;
			const title        = LocalizationService.getSettingsSectionText(section_path);

			nav_links.push(
				<NavLink to={path} className='item' key={section_path}>{title}</NavLink>,
			);

			routes.push(
				<Route path={path} key={path} render={() => <Screen sections={section.sections} path={section_path} mode={this.props.mode}/>}/>,
			);
		}

		return (
			<React.Fragment>
				<Router>
					<Grid celled id='settings-container'>
						<Grid.Row>
							<Grid.Column width={3} id='settings-sidebar'>
								<Menu vertical id='settings-menu'>
									{nav_links}
									<NavLink to={base_url + "/export"} className='item'>{LocalizationService.getSettingsSectionText("export")}</NavLink>
									<NavLink to={base_url + "/about"} className='item'>{LocalizationService.getSettingsSectionText("about")}</NavLink>
									<NavLink to={base_url + "/streamers"} className='streamers item'>{streamer_text}</NavLink>
									<NavLink to={base_url + "/donate"} className='item'>Donate</NavLink>
								</Menu>
							</Grid.Column>
							<Grid.Column width={13} id='settings-screen'>
								<Route exact path={base_url} render={() => (
									<Redirect to={base_url + "/about"}/>
								)}/>
								{routes}
								<Route path={base_url + "/export"} component={Export}/>
								<Route path={base_url + "/about"} component={About}/>
								<Route path={base_url + "/streamers"} render={() => <Streamers streamers={streamers} type={stream_type}/>}/>
								<Route path={base_url + "/donate"} component={Donate}/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Router>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	language : state.settings.interface.language,
	mode     : state.internal.mode,
});

export default connect(mapStateToProps)(Settings);
