import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "./Message.css";

export default class Message extends React.Component {
    getTimeStamp(stamp) {
        firebase.ref
    }

    render() {
        let message = this.props.messageSnap.val();

        return (
            <div className="container">
                <div className="imgContainer">
                    <div className="col-1">
                        <img src={message.author.photoURL} alt="profile picture"/>
                    </div>
                    <div className="wordContent">
                        <p>{message.author.displayName} ------ <span id="timestamp">Posted at: {message.createdAt}</span></p>
                        <p>{message.body}</p>
                    </div>
                </div>
            </div>
        );
    }
}