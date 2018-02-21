import React from "react";
import {Link} from "react-router-dom";
import {ROUTES} from "../constants";
import "./SignUp.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class SignUpView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayName: undefined,
            email: undefined,
            password: undefined,
            passwordConfirm: undefined
        }
    }

    handleSignUp() {
        this.setState({working: true});
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => user.updateProfile({
                displayName: this.state.displayName
            }))
            .catch(err => this.setState({fberror: err}))
            .then(() => this.setState({working: false}));
    }

    handleSubmit(evt) {
        evt.preventDefault();
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
                            />
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