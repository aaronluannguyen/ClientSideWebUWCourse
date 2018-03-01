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

    handleSignUp() {
        if (this.passwordMatch()) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(user => {
                    return user.updateProfile({
                        displayName: this.state.displayName,
                        photoURL: `https://www.gravatar.com/avatar/${md5(this.state.email.toLowerCase().trim())}`
                    });
                })
                .then(() => this.props.history.push(ROUTES.generalChannel))
                .catch(err => this.setState({fberror: err}))
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
                    <form onSubmit={evt => this.handleSubmit(evt)}>
                        <div className="form-group">
                            <label htmlFor="displayName">Desired Display Name</label>
                            <input type="text"
                                   id="displayName"
                                   className="form-control"
                                   placeholder="Your Display Name"
                                   value={this.state.displayName}
                                   onChange={evt => this.setState({displayName: evt.target.value})}
                                   required
                            />
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