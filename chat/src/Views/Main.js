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
                this.setUpChannelRef(this.props.match.params.channelName);
            } else {
                this.props.history.push(ROUTES.signIn);
            }
        });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillReceiveProps(nextProps) {
        this.state.channelMessageRef.off();
        this.setUpChannelRef(nextProps.match.params.channelName);
    }

    componentWillUnmount() {
        this.unListenAuth();
        if (this.state.channelMessageRef) {
            this.state.channelMessageRef.off("value", this.valueListener);
        }
    }

    setUpChannelRef(channel) {
        let ref = firebase.database().ref(`messages/${channel}`).limitToLast(500);
        this.valueListener = ref.on("value", snapshot => this.setState({channelMessageSnap: snapshot}));
        this.setState({channelMessageRef: ref});
        this.scrollToBottom();
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
            <main>
                <div className="container" id="main-view">
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
                    <div id="channels-section">
                        <div className="btn btn-default active btn-outline-success">Channels: </div>
                        <Link to={ROUTES.generalChannel}>
                            <button id="channel-button" type="button" className="btn btn-outline-success">General</button>
                        </Link>
                        <Link to={ROUTES.randomChannel}>
                            <button id="channel-button" type="button" className="btn btn-outline-success">Random</button>
                        </Link>
                    </div>
                    <div id="channel-messages">
                        <ChannelMessages userInfo={this.state.userInfo} channelMessageSnap={this.state.channelMessageSnap}/>
                        <div id="bottom-channel-messages" ref={bottomPlace => {this.bottom = bottomPlace;}}/>
                    </div>
                    <div>
                        <NewMessage id="text-input" channelMessageRef={this.state.channelMessageRef} userInfo={this.state.userInfo}/>
                    </div>
                </div>
            </main>
        );
    }
}