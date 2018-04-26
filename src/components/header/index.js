import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { Topbar, CollapsibleNav, Nav, NavItem } from 'amazeui-react';
import style from './style.less';

export default class Header extends Component {
	constructor(props) {
		super(props);
		let list = [
			{ url: '/', name: "Home"},
			{ url: '/profile', name: "Me"},
			{ url: '/profile/john', name: "John"}
		];
		let idx = list.map(function(item) {
			return item.url;
		}).indexOf(location.pathname);
		this.state = {
			list: list,
			tab: idx
		}
	}
	componentWillReceiveProps(nextProps){
		let list = this.state.list;
		let idx = list.map(function(item) {
			return item.url;
		}).indexOf(location.pathname);
  	}
	render() {
		return (
			<Topbar brand="Amaze UI" toggleNavKey="nav">
				<CollapsibleNav eventKey="nav">
					<Nav topbar>
						{this.state.list.map((item, index) => {
								if(index === this.state.tab)
									return (<NavItem active href={item.url}>{item.name}</NavItem>);
								else
									return (<NavItem href={item.url}>{item.name}</NavItem>);
						})}
					</Nav>
				</CollapsibleNav>
			</Topbar>
		);
	}
}
