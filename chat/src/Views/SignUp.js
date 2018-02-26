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
            email: "",
            password: "",
            passwordConfirm: "",
            userID: undefined,
            userRef: undefined,
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
            userUid: this.state.userID,
            photoUrl: `https://www.gravatar.com/avatar/${md5(this.state.email.toLowerCase().trim())}`
        };
        let ref = firebase.database().ref(`users`);
        this.valueListener = ref.on("value", snapshot => this.setState({userSnap: snapshot}));
        ref.push(userInfo)
            .catch(err => this.setState({fbError: err}));
        //ref.off("value", this.valueListener);
    }

    handleSignUp() {
        if (this.passwordMatch()) {
            this.setState({working: true});
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(user => {
                    this.setState({userID: user.uid});
                    this.inputUser();
                    this.props.history.push(ROUTES.generalChannel);
                })
                .catch(err => this.setState({fberror: err}))
                .then(() => this.setState({working: false}));
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();
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
            <div className="page">
                <div className="container">
                    {
                        this.state.fberror ?
                            <div className="alert alert-danger">
                                {this.state.fberror.message}
                            </div> :
                            undefined
                    }
                    <form onSubmit={evt => this.handleSubmit(evt)}>
                        <div className="form-group">
                            <label htmlFor="displayName">Desired Display Name</label>
                            <input type="text"
                                   id="displayName"
                                   className="form-control"
                                   placeholder="Your Display Name"
                                   value={this.state.displayName}
                                   onInput={evt => this.setState({displayName: evt.target.value})}
                                   required
                            />
                            {
                                this.state.displayName === "" ?
                                    <p className="text-danger">
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
                                    <div>
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
                                    <div>
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