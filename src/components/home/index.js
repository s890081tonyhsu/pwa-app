import { h, Component } from 'preact';
import style from './style.less';

export default class Home extends Component {
	constructor(props) {
		super(props);
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
		return (
			<div class="am-container">
				<h1>Home</h1>
				<button onClick={this.handleButtonClick.bind(this)}>Notif!</button>
				<p>This is the Home component.</p>
			</div>
		);
	}
}
