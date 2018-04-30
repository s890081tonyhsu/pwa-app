import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { Image } from 'amazeui-react';
import style from './style.less';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			favorite: []
		};
	}
	componentDidMount() {
		this.props.db.getPouchDocs().then(favorite => {
			console.log(favorite);
			this.setState({favorite});
		});
	}
	handleButtonClick() {
		const now = Date.now();

		const title = 'React-Web-Notification' + now;
		const body = 'Hello' + new Date();
		const tag = now;
		const icon = 'http://georgeosddev.github.io/react-web-notification/example/Notifications_button_24.png';
		
		const options = {
			tag,
			body,
			icon,
			lang: 'en',
			dir: 'ltr'
		};
		this.props.notify(title, options);
	}

	render() {
		let item = null;
		if (this.state.favorite.length !== 0)
			item = this.state.favorite[Math.floor(Math.random() * this.state.favorite.length)].full;
		return (
			<div class="am-container">
				<h1>Home</h1>
				<button onClick={this.handleButtonClick.bind(this)}>Notif!</button>
				{!item && <p>Add some favorite image from <Link href="/imgur">imgur tab</Link></p>}
				{item && <div class="am-g">
					<div className="am-u-sm-8 am-u-sm-centered">
						<p>Have a nice day.</p>
						<Image
							src={item.img}
							responsive thumbnail />
					</div>
				</div>}
			</div>
		);
	}
}
