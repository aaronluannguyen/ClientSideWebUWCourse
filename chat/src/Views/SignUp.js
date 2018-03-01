import React from "react";
import {Link} from "react-router-dom";
import {ROUTES} from "../constants";
import "./SignUp.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import md5 from "blueimp-md5";

export default class SignUpView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: undefined,
            displayName: "",
            displayNamePresent: true,
            email: "",
            password: "",
            passwordConfirm: "",
            passwordMatch: undefined
        }
    }

    componentDidMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => this.setState({currentUser: user}));
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    inputUser() {
        let userInfo = {
            displayName: this.state.displayName,
            //userUid: this.state.userID,
            photoUrl: `https://www.gravatar.com/avatar/${md5(this.state.email.toLowerCase().trim())}`
        };
        let ref = firebase.database().ref(`users`);
        this.valueListener = ref.on("value", snapshot => this.setState({userSnap: snapshot}));
        ref.push(userInfo)
            .catch(err => this.setState({fberror: err}))
            .then(ref.off("value", this.valueListener));
    }

    handleSignUp(evt) {
        if (evt) {
            evt.preventDefault();
        }
        if (this.displayNameIsPresent() && this.passwordMatch()) {
            this.setState({working: true});
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(user => {
                    user.updateProfile({
                        displayName: this.state.displayName,
                        photoURL: `https://www.gravatar.com/avatar/${md5(this.state.email.toLowerCase().trim())}`
                    });
                    this.props.history.push(ROUTES.generalChannel);
                })
                .catch(err => this.setState({fberror: err}))
                .then(() => this.setState({working: false}));
        } else {
            this.setState({displayNamePresent: false});
        }
    }

    displayNameIsPresent() {
        if (this.state.displayName === "") {
            this.setState({displayNamePresent: false});
            return false;
        } else {
            this.setState({displayNamePresent: true});
            return true;
        }
    }

    passwordMatch() {
        if (this.state.password === this.state.passwordConfirm) {
            this.setState({passwordMatch: true});
            return true;
        } else {
            this.setState({passwordMatch: false});
            return false;
        }
    }


    render() {
        return (
            <div className="sign-in-page">
                <div className="container" id="sign-in-container">
                    <h1>Sign Up!</h1>
                    {
                        this.state.fberror ?
                            <div className="alert alert-danger">
                                {this.state.fberror.message}
                            </div> :
                            undefined
                    }
                    <form onSubmit={evt => this.handleSignUp(evt)}>
                        <div className="form-group">
                            <label htmlFor="displayName">Desired Display Name</label>
                            <input type="text"
                                   id="displayName"
                                   className="form-control"
                                   placeholder="Your Display Name"
                                   value={this.state.displayName}
                                   onChange={evt => this.setState({displayName: evt.target.value})}
                            />
                            {
                                !this.state.displayNamePresent ?
                                    <p className="text-danger required-warning">
                                        Please Choose A Display Name
                                    </p> :
                                    undefined
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="text"
                                   id="email"
                                   className="form-control"
                                   placeholder="Your Email Address"
                                   value={this.state.email}
                                   onInput={evt => this.setState({email: evt.target.value})}
                                   required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Create Password</label>
                            <input type="password"
                                   id="password"
                                   className="form-control"
                                   placeholder="Your Password"
                                   value={this.state.password}
                                   onInput={evt => this.setState({password: evt.target.value})}
                                   required
                            />
                            {
                                this.state.passwordMatch === false ?
                                    <div className="required-warning">
                                        Passwords do not match
                                    </div> :
                                    undefined
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password"
                                   id="confirmPassword"
                                   className="form-control"
                                   placeholder="Confirm Your Password"
                                   value={this.state.passwordConfirm}
                                   onInput={evt => this.setState({passwordConfirm: evt.target.value})}
                                   required
                            />
                            {
                                this.state.passwordMatch === false ?
                                    <div className="required-warning">
                                        Passwords do not match
                                    </div> :
                                    undefined
                            }
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" onClick={() => this.handleSignUp()}>Sign Up</button>
                        </div>
                    </form>
                    <p>Already have an account? <Link to={ROUTES.signIn}> Sign In! </Link></p>
                </div>
            </div>
        );
    }
}