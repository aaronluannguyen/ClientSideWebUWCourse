import React from "react";
import {Link} from "react-router-dom";
import {ROUTES} from "../constants";

export default class SignInView extends React.Component {
    handleSubmit(evt) {
        evt.preventDefault();
        // Do authentication here
        this.props.history.push(ROUTES.generalChannel);
    }

    render() {
        return(
            <div>
                <div className="container">
                    <form onSubmit={evt => this.handleSubmit(evt)}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="text"
                                   id="email"
                                   className="form-control"
                                   placeholder="Your Email Address"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password"
                                   id="password"
                                   className="form-control"
                                   placeholder="Your Password"/>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </div>
                    </form>
                    <p>Don't have an account yet? <Link to={ROUTES.signUp}> Sign Up! </Link></p>
                </div>
            </div>
        );
    }
}