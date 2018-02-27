import React from "react";
import {Link} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {ROUTES} from "../constants";
import ChannelMessages from "../Components/ChannelMessages";
import NewMessage from "../Components/NewMessage";
import "./Main.css";

export default class mainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: firebase.auth().currentUser,
            currentChannel: this.props.match.params.channelName,
            channelMessageRef: undefined,
            channelMessageSnap: undefined
        }
    }

    componentDidMount() {
        this.unListenAuth = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                user.providerData.forEach(profile => {
                    this.setState({
                        userInfo: {
                            userID: profile.uid,
                            displayName: profile.displayName,
                            photoUrl: profile.photoURL
                        }
                    });
                });
                let ref = firebase.database().ref(`messages/${this.state.currentChannel}`);
                this.valueListener = ref.on("value", snapshot => this.setState({channelMessageSnap: snapshot}));
                this.setState({channelMessageRef: ref});
            }
        });
    }

    componentWillUnmount() {
        this.unListenAuth();
        this.state.channelMessageRef.off("value", this.valueListener);
    }

    handleSignOut() {
        firebase.auth().signOut();
        this.props.history.push(ROUTES.signIn);
    }

    render() {
        return (
            <div id="page">
                <header className="bg-secondary text-white" id="header">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col">
                                <h1 className="col">#{this.props.match.params.channelName}</h1>
                            </div>
                            <div className="col-auto">
                                <button onClick={() => this.handleSignOut()}>
                                    <svg width="24" height="24" fill="#FFF" viewBox="0 0 24 24"
                                         role="button"
                                         aria-label="sign out button"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h24v24H0z" fill="none" />
                                        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <main>
                    <div className="container" id="main-view">
                        <div className="row">
                            <div className="col-1">
                                <ul>
                                    <li>
                                        {
                                            this.props.match.params.channelName !== "general" ? <Link to={ROUTES.generalChannel}>General</Link> : "General"
                                        }
                                    </li>
                                    <li><Link to={ROUTES.randomChannel}>Random</Link></li>
                                </ul>
                            </div>
                            <div className="col-11">
                                <div>
                                    <ChannelMessages channelMessageSnap={this.state.channelMessageSnap}/>
                                </div>
                                <div>
                                    <NewMessage id="text-input" channelMessageRef={this.state.channelMessageRef} userInfo={this.state.userInfo}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}