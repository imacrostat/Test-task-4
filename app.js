
var data;
setData();


/* --------- Root component --------- */
class Wrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: localStorage.getItem("user"), 
		};
	}
	
	componentDidMount() {
		this.timerID = setInterval(
			() => this.checkSigned(),
			500
		);
	}
	
	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	
	checkSigned() {
		this.setState({
			user: localStorage.getItem("user")
		});
	}
	
	render() {
		return (
			<div className="wrapper">
				<Header 
					user={this.state.user}
					messages={data.menuMessages}
				/>
				<Subheader
					user={this.state.user}
				/>
				<ContentContainer 
					user={this.state.user}
					data={data}
				/>
				<Footer />
			</div>
		);
	}
}


/* --------- Children components --------- */
class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<div className="header-logo">
					<img src="logo.png" width="70" />
				</div>
				<h1 className="header-title">ECONOMIC INDICATORS IN UKRAINE <br /> (STATISTICS AND ANALYTICS)
				</h1>
				<div>
					<ul className="main-menu">
						<li><a href="#s">Statistics</a>
							<ul className="sub-menu">
								<li><a href="#1">Industrial production</a></li>
								<li><a href="#2">Real GDP</a></li>
								<li><a href="#3">Agricultural production</a></li>
								<li><a href="#4">Consumer price index</a></li>
								<li><a href="#5">Producer price index</a></li>
							</ul>
						</li>
						<li>
							<a href="#a">Analytics</a>
							<ul className="sub-menu">
								<li><a href="#1">Industrial production</a></li>
								<li><a href="#2">Real GDP</a></li>
								<li><a href="#3">Agricultural production</a></li>
								<li><a href="#4">Consumer price index</a></li>
								<li><a href="#5">Producer price index</a></li>
							</ul>
						</li>
						<li><a href="#c">Contacts</a></li>
						<MenuMessage
							user={this.props.user}
							messages={this.props.messages}
						/>
					</ul>
				</div>
			</div>
		);
	}
}

class MenuMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			item: 0
		};
		this.toggleMessage = this.toggleMessage.bind(this);
	}
		
	toggleMessage() {
		this.setState(prevState => ({
			item: -(prevState.item - 1)
		}));
		
		document.querySelector("form.signin").classList.toggle("hidden");
		document.querySelector("form.signup").classList.toggle("hidden");
	}
		
	render() {
		return (
			((this.props.user == "") &&
			<li id="menu-message">
				<a href ="javascript:;" onClick={this.toggleMessage}>
					<b>{this.props.messages[this.state.item]}</b>
				</a>
			</li>)
		);
	}
}

class Subheader extends React.Component {
	constructor(props) {
		super(props);
	}
	
	handleSignUp(e) {
		e.preventDefault();
		
		if (register_password.value != register_confirmation.value) {
			alert("Fill out the 'Password' and 'Confirmation' fields again!");
			register_password.value = "";
			register_confirmation.value = "";
			return;
		}
		
		fetch('https://test-task-3.firebaseio.com/users.json?orderBy="login"&equalTo="' + register_login.value + '"')
		.then(response => {
			return response.json();
		})
		.then(jsonUser => {
			for (var i in jsonUser) {
				var userId = i;
			}
			
			if (userId) {
				alert("Choose other login!");
				return;
			}
			
			writeCredentials();
		})
		.catch(alert);
	
		function writeCredentials() {
			var newUserRef = firebase.database().ref('users').push();
			newUserRef.set({
				"login": register_login.value,
				"password": register_password.value
			})
			.then(() => {
				alert("Congratulations!\nYou've been registered successfully!");
				auth_login.value = register_login.value;
				auth_password.value = register_password.value;
				register_password.value = "";
				register_confirmation.value = "";
				signIn();
			})
			.catch(alert);
		}
	}
	
	handleSignIn(e) {
		e.preventDefault();
		signIn();
	}
	
	handleSignOut() {
		localStorage.setItem("user", "");
	}
	
	handleBurgerClick() {
		var eltSidebar = document.querySelector("#sidebar");
		eltSidebar.classList.toggle("folded");
			
		setTimeout('setBurgerArrow();', getHiddenTimeout(false));
		setTimeout('document.querySelector("#controls").classList.toggle("hidden");', getHiddenTimeout(true));
		
		function getHiddenTimeout(isControlsTimeout) {
			var transDuration = parseFloat(getComputedStyle(eltSidebar).transitionDuration) * 1000;
			return isControlsTimeout ? !(eltSidebar.classList.contains("folded")) * transDuration: transDuration * 0.9;
		}
	}
	
	render() {
		return (
			<div className="subheader">
                {this.props.user == "" &&
					<form 
						className="signup hidden"
						onSubmit={this.handleSignUp}
						>
						<label htmlFor="register_login">Login</label>
						<input type="text" id="register_login" required />
						<label htmlFor="register_password">Password</label>
						<input type="password" id="register_password" required />
						<label htmlFor="register_confirmation">Confirmation</label>
						<input type="password" id="register_confirmation" required />
						<input type="submit" id="register" value="Sign up" />
					</form>
				}
                
				{this.props.user == "" &&
					<form 
						className="signin" 
						onSubmit={this.handleSignIn}
						>
						<label htmlFor="auth_login">Login</label>
						<input type="text" id="auth_login" required />
						<label htmlFor="auth_password">Password</label>
						<input type="password" id="auth_password" required />
						<input type="submit" id="auth" value="Sign in" />
					</form>
				}
                
				{this.props.user != "" &&
					<div className="greeting">
						<span>
							Hello {this.props.user} !
						</span>
						<button
							type="button" className="signout" 
							onClick={this.handleSignOut}
							>
							Sign out
						</button>
					</div>
				}
                
				<button
					type="button"
					id="burger"
					onClick={this.handleBurgerClick}
					title="Toggle the sidebar">
					{setBurgerArrow()}
				</button>
            </div>
		);
	}
}

class Footer extends React.Component {
	render() {
		return (
			<div className="footer"><div className="footer-author">&copy; &nbsp; Alexander Varfolomieiev,&nbsp; 2018<address><br /><a href="mailto:mymailhere@gmail.com">mymailhere@gmail.com</a> </address></div><div className="footer-moddate"><br /><br />Last modified: 04/03/2018</div><div className="clearfix"></div></div>
		);
	}
}


/* --------- Content components --------- */
class ContentContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fontSize: 14,
			backgroundColor: "#add8e6",
			fontFamily: '"PT Sans", sans-serif'
        };
		this.handleFontSizeChange = this.handleFontSizeChange.bind(this);
		this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(this);
		this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this);
	}
	
	handleFontSizeChange(fontSize) {
		this.setState(
			{fontSize: fontSize}
		);
	}
	
	handleBackgroundColorChange(backgroundColor) {
		this.setState(
			{backgroundColor: backgroundColor}
		);
	}
	
	handleFontFamilyChange(fontFamily) {
		this.setState(
			{fontFamily: fontFamily}
		);
	}
		
	render() {
		return (
			<div>
			<Sidebar
				user={this.props.user}
				fonts={this.props.data.fonts}
				fontSize={this.state.fontSize}
				backgroundColor={this.state.backgroundColor}
				fontFamily={this.state.fontFamily}
				onFontSizeChange={this.handleFontSizeChange}
				onBackgroundColorChange={this.handleBackgroundColorChange}
				onFontFamilyChange={this.handleFontFamilyChange}
			/>
			<Content
				contentHTML={this.props.data.contentHTML}
				fontSize={this.state.fontSize}
				backgroundColor={this.state.backgroundColor}
				fontFamily={this.state.fontFamily}
			/>
			</div>
		);
	}
}

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.handleFontSizeChange = this.handleFontSizeChange.bind(this);
		this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(this);
		this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this);
	}
	
	handleFontSizeChange(e) {
		var eltFontSize = document.querySelector("#fontsize");
		var fontSize = eltFontSize.value;
		
		if (!fontSize.trim().match(/^\d{1,2}$/)) {
			// default message displayed
			return;
		}
		
		fontSize = +fontSize;
		if (fontSize < +eltFontSize.min || fontSize > +eltFontSize.max) {
			alert("The font size should lie between " + eltFontSize.min + " and " + eltFontSize.max + "!");
			return;
		}
		
		this.props.onFontSizeChange(e.target.value);
	}
		
	handleBackgroundColorChange(e) {
		this.props.onBackgroundColorChange(e.target.value);
	}
	
	handleFontFamilyChange(fontFamily) {
		this.props.onFontFamilyChange(fontFamily);
	}
	
	handleRemoverClick() {
		document.querySelector("div.content > div > p:last-of-type").remove();
		if (!document.querySelector("div.content > div > p:last-of-type")) {
			document.querySelector("#remover").disabled = true;
		}
	}

	render() {
		const isDisabled = (this.props.user) ? false : true;
		return (
			<div id="sidebar" className="sidebar">
			<form id="controls">
				<div>
					<label>Font size:</label>
                    <input
						id="fontsize"
						type="number" min="8" max="24"
						value={this.props.fontSize}
						onChange={this.handleFontSizeChange}
						disabled={isDisabled}
					/>
				</div>
				<div>
					<label>Background color:</label>
                    <input 
						id="bgcolor"
						type="color"
						value={this.props.backgroundColor}
						onChange={this.handleBackgroundColorChange}
						disabled={isDisabled}
					/>
				</div>
				<FontList
					user={this.props.user}
					fonts={this.props.fonts}
					fontFamily={this.props.fontFamily}
					onFontFamilyChange={this.handleFontFamilyChange}
				/>
				<div>
					<button
						id="remover" 
						type="button" 
						onClick={this.handleRemoverClick}
						title="Remove the last 'p' element"
						disabled={isDisabled}
					>&times;
					</button>
				</div>
			 </form>
			 </div>
		);
	}
}

class FontList extends React.Component {
	constructor(props) {
		super(props);
		this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this);
	}
	
	handleFontFamilyChange(e) {
		this.props.onFontFamilyChange(e.target.value);
	}
	
	render() {
		const fonts = this.props.fonts;
		const currentFont = this.props.fontFamily;
		const isDisabled = (this.props.user) ? false : true;
		
		const inputs = [];
		for (let i in fonts) {
			let v = fonts[i];
			let c = (fonts[i] == currentFont);
			inputs.push(
				<div key={v}>
				<input
					type="radio"
					name="fontfamily" value={v}
					defaultChecked={c}
					onChange={this.handleFontFamilyChange}
					disabled={isDisabled}
				/>
				<span>{v.split(" ")[0].replace('"', "")}</span><br />
				</div>
			);
		}
				
		return (
			<div>
				<label>Font family:<br /></label>
				{inputs}
			</div>
		);
	}
}

class Content extends React.Component {
	constructor(props) {
		super(props);
	}
	
	setStyle() {
		return {
			fontSize: this.props.fontSize + "px",
			backgroundColor: this.props.backgroundColor,
			fontFamily: this.props.fontFamily
		};
	}
	
	render() {
		return (
			<div className="content" style={this.setStyle()}>{this.props.contentHTML}</div>
		);
	}
}


ReactDOM.render(
	<Wrapper />,
	document.querySelector("#react-root")
);


/* --------- autorization --------- */
function signIn() {
	fetch('https://test-task-3.firebaseio.com/users.json?orderBy="login"&equalTo="' + auth_login.value + '"')
	.then(response => {
		return response.json();
	})
	.then(jsonUser => {
		for (var i in jsonUser) {
			var userId = i;
		}
		
		if (!userId || jsonUser[userId].password != auth_password.value) {
			alert("Wrong login or password!");
			return;
		}
		
		localStorage.setItem("user", jsonUser[userId].login);
	})
	.catch(alert);
}


/* --------- interface --------- */
function setBurgerArrow() {
	var eltSidebar = document.querySelector("#sidebar");
	const tUp = "∧", tRt = ">", tDn = "∨", tLt = "<";
	// adjust for a narrow width
	var m = document.documentElement.clientWidth < 460;
	try {
		var arrow = (eltSidebar.classList.contains("folded")) ? (m ? tDn : tRt) : (m ? tUp : tLt);
		burger.innerHTML = arrow;
	} catch(e) {
		var arrow = m ? tUp : tLt;
	}
	return arrow;
}


/* --------- window functions --------- */
window.onresize = setBurgerArrow;


/* --------- data initialization --------- */
function setData() {
	data = {
		menuMessages: ["Sign up for free!", "Already signed up?"],
		fonts: ["Arial", "Courier New", "Georgia", "Lucida Sans Unicode", '"PT Sans", sans-serif', "Tahoma"],
		contentHTML: setContentHTML()
	};
	
	function setContentHTML() {
		return (
			<div>
			<p>The short-term statistical data on the major economic indicators in Ukraine and analysis of their dynamics are presented on this site. Numerical values of the indicators over the period until 2000 may be of the largest interest for the researchers in the field of economics. More miscellaneous statistical data as to the economic indicators in Ukraine can be found for example on the following official web sites:</p>
			<ul type="circle">
				<li><a href="http://www.ukrstat.gov.ua" target="_blank">State Statistics Committee of Ukraine</a></li>
				<li> <a href="http://www.bank.gov.ua" target="_blank">National Bank of Ukraine</a></li>
                <li> <a href="http://www.me.gov.ua" target="_blank">Ministry of Economy of Ukraine</a></li>
                <li> <a href="http://www.kmu.gov.ua" target="_blank">Cabinet of Ministers of Ukraine</a></li>
                <li> <a href="http://www.cisstat.org" target="_blank">Interstate Statistical Committee of the CIS Countries</a></li>	
			</ul>
			<p>and, very likely, on some others.</p>
			<p>Working with the short-term statistical data in the first 
			place concerned the volumes of total output (agricultural 
			production, industrial production, real GDP), it is 
			necessary to take into account a number of practical aspects. 
			Above all the officially disseminated monthly indices are 
			advance (or preliminary) estimates and may be revised later, 
			sometimes changing considerably enough. Such revisions are 
			applied to yearly and quarterly, but not monthly values of 
			the economic indicators, so the true short-term dynamics of 
			the studied indicators is covert to a greater or lesser 
			extent by inevitably appearing errors. Secondly, in the 
			analytical practice adopted on the top state level the 
			short-term tendencies of economic growth, as a rule, are not 
			analyzed on the ground of base values (base indices, base 
			growth coefficients) that is on the ground of time series 
			of the respective major economic indicators. Instead 
			certain relative values called "indices" are engaged, and 
			namely &ndash; the growth rates to the corresponding period 
			of the previous year (naturally, formulated so as a 
			multiplicative type seasonality would be eliminated). For 
			the goals of short-term dynamics analysis such an approach 
			apparently is not correct because one of the principal 
			disadvantages of these indices consists in their equally 
			strong dependence both on the actual (current) level of 
			the economic indicator and on its level precisely one year 
			ago. Thirdly, if one did succeed in getting the time series 
			of interesting indicator detailed by months, the short-term 
			changes may be interpreted only in the case of adjusted 
			seasonal component. This, in its queue, requires from an 
			analyst choosing the most appropriate methods of seasonal 
			adjustment and carrying out the additional calculations, 
			probably, bringing thereby a certain element of subjectivity 
			in the final results.</p>
			<p>The author of this web site is sincerely confirmed that the 
			information placed in his own section <b>"Analytics"</b> differs 
			radically from the officially disseminated data in 
			Ukraine, i.e. the section <b>"Statistics"</b> (but 
			nevertheless constructed on the official data basis). At 
			the same time it helps not only to identify much more 
			exactly the current situation in the country, but also 
			allows to make right, well-grounded decisions.</p>
			</div>
		);
	}
}

