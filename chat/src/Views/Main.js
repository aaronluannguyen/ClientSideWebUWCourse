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
                let ref = firebase.database().ref(`messages/${this.state.currentChannel}`).limitToLast(500);
                this.valueListener = ref.on("value", snapshot => this.setState({channelMessageSnap: snapshot}));
                this.setState({channelMessageRef: ref});
                this.scrollToBottom();
            } else {
                this.props.history.push(ROUTES.signIn);
            }
        });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.unListenAuth();
        if (this.state.channelMessageRef) {
            this.state.channelMessageRef.off("value", this.valueListener);
        }
    }

    handleSignOut() {
        firebase.auth().signOut();
        this.props.history.push(ROUTES.signIn);
    }

    scrollToBottom() {
        this.bottom.scrollIntoView({behavior: "smooth"});
    }

    render() {
        return (
            <div id="page">
                <main>
                    <div className="container" id="main-view">
                        <div className="row">
                            <div className="col-1">
                                <ul>
                                    <li>
                                        {
                                            this.props.match.params.channelName !== "general" ?
                                                <Link to={ROUTES.generalChannel}>General</Link> : "General"
                                        }
                                    </li>
                                    <li>
                                        {
                                            this.props.match.params.channelName !== "random" ?
                                                <Link to={ROUTES.randomChannel}>Random</Link> : "Random"
                                        }
                                    </li>
                                </ul>
                            </div>
                            <div className="col-11">
                                <header className="bg-secondary text-white" id="main-header">
                                    <div className="container-fluid">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <h1 className="col">#{this.props.match.params.channelName}</h1>
                                            </div>
                                            <div className="col-auto">
                                                <div id="sign-out" onClick={() => this.handleSignOut()}>
                                                    <button type="button" onClick={() => this.handleSignOut()} className="btn btn-danger">Sign Out</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </header>
                                <div id="channel-messages">
                                    <ChannelMessages userInfo={this.state.userInfo} channelMessageSnap={this.state.channelMessageSnap}/>
                                    <div ref={bottomPlace => {this.bottom = bottomPlace;}}/>
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