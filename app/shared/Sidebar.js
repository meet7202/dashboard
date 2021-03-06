import React,{Component} from 'react';
import { Link } from 'react-router';
import classNames from "classnames";
import Tooltip from 'rc-tooltip';
import { eventEmitter } from './helper';
import { getConfig } from '../config';
import { appbaseService } from '../service/AppbaseService';

const $ = require("jquery");

export default class Sidebar extends Component {

	constructor(props) {
		super(props);
		this.config = getConfig();
		this.contextPath = appbaseService.getContextPath();
		this.state = {
			activeApp: this.props.appName,
			currentView: null
		};
		this.stopUpdate = false;
		this.links = [{
			label: 'Dashboard',
			link: `${this.contextPath}dashboard/`,
			type: 'internal',
			name: 'dashboard',
			tooltip: 'View app usage stats',
			img: (<img className="img-responsive" src={`../../../assets/images/${this.config.name}/sidebar/dashboard.svg`}></img>)
		}, {
			label: 'Browser',
			link: `${this.contextPath}browser/`,
			type: 'internal',
			name: 'browser',
			tooltip: 'Create, view and manage app data',
			img: (<img className="img-responsive" src={`../../../assets/images/${this.config.name}/sidebar/browser.svg`}></img>)
		}, {
			label: 'Mappings',
			link: `${this.contextPath}mappings/`,
			type: 'internal',
			name: 'gem',
			tooltip: 'View app mappings',
			img: (<img className="img-responsive mappings" src={`../../../assets/images/${this.config.name}/sidebar/mapping.svg`}></img>)
		},{
			label: 'Builder',
			link: `${this.contextPath}builder/`,
			type: 'internal',
			name: 'mirage',
			tooltip: 'Create and save queries with a GUI',
			img: (<img className="img-responsive" src={`../../../assets/images/${this.config.name}/sidebar/builder.svg`}></img>)
		}, {
			label: 'Credentials',
			link: `${this.contextPath}credentials/`,
			type: 'internal',
			name: 'credentials',
			tooltip: 'View and manage API access credentials',
			img: (<img className="img-responsive" src={`../../../assets/images/${this.config.name}/sidebar/credentials.svg`}></img>)
		}, {
			label: 'Team',
			link: `${this.contextPath}team/`,
			type: 'internal',
			name: 'team',
			tooltip: 'Manage who can access your app data',
			img: (<img className="img-responsive" src={`../../../assets/images/${this.config.name}/sidebar/team.svg`}></img>)
		}];
	}

	changeView(name) {
		this.props.changeView(name);
	}

	componentWillMount() {
		this.listenEvent = eventEmitter.addListener('activeApp', (activeApp) => {
			if(!this.stopUpdate) {
				this.setState(activeApp);
			}
		});
	}

	componentDidMount() {
		const seSidebarHeight = () => {
			$(".ad-detail").css({
				"min-height": $(this.sidebarRef).height()+30
			});
		};
		setTimeout(seSidebarHeight.bind(this), 1000);
		$(window).resize(seSidebarHeight.bind(this));
	}

	componentWillUnmount() {
		this.stopUpdate = true;
		if (this.listenEvent) {
			this.listenEvent.remove();
		}
		$(window).unbind("resize");
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'links':
				const filteredList = this.links.filter((item) => this.config.appDashboard.indexOf(item.name) > -1);
				generatedEle = filteredList.map((item, index) => {
					const cx = classNames({
						"active": this.props.currentView === item.name
					});
					const img = (<div className="img-container">{item.img}</div>);
					const anchor = (
						<Link className={cx} to={item.link+this.state.activeApp}>
							{img}
							<span className="ad-detail-sidebar-item-label">
								{item.label}
							</span>
						</Link>
					);
					return (
						<Tooltip
							overlay={<div>{item.tooltip}</div>}
							mouseLeaveDelay={0}
							key={index}
						>
							<li className="ad-detail-sidebar-item" key={index}>
								{anchor}
							</li>
						</Tooltip>
					);
				})
				break;
		}
		return generatedEle;
	}

	render() {
		return (
			<aside className="ad-detail-sidebar">
				<ul className="ad-detail-sidebar-container" ref={(aside) => this.sidebarRef = aside}>
					{this.renderElement('links')}
				</ul>
			</aside>
		);
	}

}
