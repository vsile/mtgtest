class TabsHeader extends React.Component {
	constructor() {
		super();
		this.createTabsHeader = this.createTabsHeader.bind(this);
	}

	createTabsHeader(item, i) {
		let active = '';
		if (i == this.props.activeTabIndex) active = 'tabs-header-active';
		return React.createElement(
			'div',
			{ className: active, onClick: () => this.props.goToTab(i) },
			item.name
		);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'tabs-header' },
			this.props.tabs.map(this.createTabsHeader)
		);
	}
}

class Dialog extends React.Component {
	constructor() {
		super();
		this.pushOk = this.pushOk.bind(this);
		this.pushCancel = this.pushCancel.bind(this);
	}

	pushOk() {
		alert('OK');
		this.props.toggleDialog(false);
	}

	pushCancel() {
		this.props.toggleDialog(false);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'dialog-background' },
			React.createElement(
				'div',
				{ className: 'dialog-block' },
				React.createElement(
					'div',
					{ className: 'dialog-header' },
					'New Dialog'
				),
				React.createElement('input', { className: 'button', type: 'button', value: 'OK', onClick: this.pushOk }),
				React.createElement('input', { className: 'button', type: 'button', value: '\u041E\u0442\u043C\u0435\u043D\u0430', onClick: this.pushCancel })
			)
		);
	}
}

class FirstTab extends React.Component {
	constructor() {
		super();
		this.state = {
			dialogDisplay: false
		};
		this.toggleDialog = this.toggleDialog.bind(this);
	}

	createDialog(showDialogState) {
		if (showDialogState) return React.createElement(Dialog, { toggleDialog: this.toggleDialog });
		return null;
	}

	toggleDialog(newState) {
		this.setState({
			dialogDisplay: newState
		});
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'tabs-content' },
			React.createElement('input', { className: 'button', type: 'button', value: 'Push', onClick: () => this.toggleDialog(true) }),
			this.createDialog(this.state.dialogDisplay)
		);
	}
}

class SecondTab extends React.Component {
	constructor(props) {
		super();
		this.state = {
			list: []
		};
		this.getFileContent = this.getFileContent.bind(this);
	}

	getFileContent(e) {
		fetch('/getFileContent', {
			method: 'POST',
			body: new URLSearchParams({
				'fileName': e.target.value
			})
		}).then(resp => resp.text()).then(data => {
			this.setState({
				list: data.trim().split('\n')
			});
		}, err => openAlert(err));
	}

	createList(item, i) {
		return React.createElement(
			'option',
			null,
			item
		);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'tabs-content tabs-content-dropdown' },
			React.createElement(
				'div',
				null,
				React.createElement(
					'select',
					{ onChange: this.getFileContent },
					React.createElement(
						'option',
						{ value: '', hidden: true },
						'Select a file...'
					),
					React.createElement(
						'option',
						{ value: 'file1' },
						'file1'
					),
					React.createElement(
						'option',
						{ value: 'file2' },
						'file2'
					)
				)
			),
			React.createElement(
				'div',
				null,
				React.createElement(
					'select',
					null,
					this.state.list.map(this.createList)
				)
			)
		);
	}
}

class Body extends React.Component {
	constructor(props) {
		super();
		this.state = {
			activeTabIndex: props.defaultActiveTab
		};
		this.goToTab = this.goToTab.bind(this);
	}

	goToTab(i) {
		this.setState({
			activeTabIndex: i
		});
	}

	render() {
		const ActiveTab = this.props.tabs[this.state.activeTabIndex].component;
		return React.createElement(
			'div',
			{ className: 'main-block' },
			React.createElement(TabsHeader, { activeTabIndex: this.state.activeTabIndex, tabs: this.props.tabs, goToTab: this.goToTab }),
			React.createElement(ActiveTab, null)
		);
	}
}

const app = document.getElementById('root');

ReactDOM.render(React.createElement(
	'div',
	null,
	React.createElement(Body, {
		tabs: [{
			'component': FirstTab,
			'name': 'First'
		}, {
			'component': SecondTab,
			'name': 'Second'
		}],
		defaultActiveTab: 0 })
), app);