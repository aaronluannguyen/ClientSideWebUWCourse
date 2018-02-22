import React from "react";
import {Link} from "react-router-dom";
import {ROUTES} from "../constants";
import "./SignIn.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class SignInView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: undefined,
            email: undefined,
            password: undefined,
            displayName: undefined
        }
    }

    componentDidMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => this.setState({currentUser: user}));
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    handleSignIn() {
        this.setState({working: true});
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                this.props.history.push(ROUTES.generalChannel)
            })
            .catch(err => this.setState({fberror: err}))
            .then(() => this.setState({working: false}))
    }

    handleSubmit(evt) {
        evt.preventDefault();
    }

    render() {
        return(
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
                            <label htmlFor="password">Password</label>
                            <input type="password"
                                   id="password"
                                   className="form-control"
                                   placeholder="Your Password"
                                   value={this.state.password}
                                   onInput={evt => this.setState({password: evt.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" onClick={() => this.handleSignIn()}>Sign In</button>
                        </div>
                    </form>
                    <p>Don't have an account yet? <Link to={ROUTES.signUp}> Sign Up! </Link></p>
                </div>
            </div>
        );
    }
}