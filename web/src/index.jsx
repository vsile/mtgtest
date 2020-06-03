class TabsHeader extends React.Component {
	constructor() {
		super();
		this.createTabsHeader = this.createTabsHeader.bind(this);
	}

	//Создаем вкладки
	createTabsHeader(item, i) {
		let active = '';
		if (i == this.props.activeTabIndex)
			active = 'tabs-header-active';
		return (
			<div className={active} onClick={() => this.props.goToTab(i)}>{item.name}</div>
		)
	}

	render() {
		return (
			<div className="tabs-header">
				{this.props.tabs.map(this.createTabsHeader)}
			</div>
		)
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
		this.props.toggleDialog(false)
	}

	pushCancel() {
		this.props.toggleDialog(false)
	}

	render() {
		return (
			<div className="dialog-background">
				<div className="dialog-block">
					<div className="dialog-header">New Dialog</div>
					<input className="button" type="button" value="OK" onClick={this.pushOk} />
					<input className="button" type="button" value="Отмена" onClick={this.pushCancel} />
				</div>
			</div>
		)
	}
}

class FirstTab extends React.Component {
	constructor() {
		super();
		this.state = {
			dialogDisplay: false
		}
		this.toggleDialog = this.toggleDialog.bind(this);
	}

	createDialog(showDialogState) {
		if (showDialogState) return <Dialog toggleDialog={this.toggleDialog} />
		return null
	}

	toggleDialog(newState) {
		this.setState({
			dialogDisplay: newState
		})
	}

	render() {
		return (
			<div className="tabs-content">
				<input className="button" type="button" value="Push" onClick={() => this.toggleDialog(true)} />
				{this.createDialog(this.state.dialogDisplay)}
			</div>
		)
	}
}

class SecondTab extends React.Component {
	constructor(props) {
		super();
		this.state = {
			list: []
		}
		this.getFileContent = this.getFileContent.bind(this);
	}

	getFileContent(e) {
		//Передаем на сервер значение из первого select
		fetch('/getFileContent', {
			method: 'POST',
			body: new URLSearchParams({
				'fileName': e.target.value
			})
		})
		.then(resp => resp.text())
		.then(data => {
			this.setState({
				list: data.trim().split('\n')
			})
		}, err => openAlert(err))
	}

	createList(item, i) {
		return <option>{item}</option>
	}

	render() {
		return (
			<div className="tabs-content tabs-content-dropdown">
				<div>
					<select onChange={this.getFileContent}>
						<option value="" hidden>Select a file...</option>
						<option value="file1">file1</option>
						<option value="file2">file2</option>
					</select>
				</div>
				<div>
					<select>
						{this.state.list.map(this.createList)}
					</select>
				</div>
			</div>
		)
	}
}

class Body extends React.Component {
	constructor(props) {
		super();
		this.state = {
			activeTabIndex: props.defaultActiveTab
		}
		this.goToTab = this.goToTab.bind(this);
	}

	//Переходим на вкладку по индексу
	goToTab(i) {
		this.setState({
			activeTabIndex: i
		})
	}

	render() {
		const ActiveTab = this.props.tabs[this.state.activeTabIndex].component;
		return (
			<div className="main-block">
				<TabsHeader activeTabIndex={this.state.activeTabIndex} tabs={this.props.tabs} goToTab={this.goToTab}/>
				<ActiveTab />
			</div>
		)
	}
}

const app = document.getElementById('root');

ReactDOM.render(
	<div>
		<Body
			tabs={[
				{
					'component': FirstTab,
					'name': 'First'
				},
				{
					'component': SecondTab,
					'name': 'Second'
				}
			]}
			defaultActiveTab={0}	//Индекс активной вкладки по умолчанию
		/>
	</div>,
	app
)
