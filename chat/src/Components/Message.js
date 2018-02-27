import React from "react";

export default class Message extends React.Component {
    render() {
        let message = this.props.messageSnap.val();

        return (
            <div className="container">
                <img src={message.author.photoURL} alt="profile picture"/>
                <p>{message.author.displayName}</p>
                <p>{message.body}</p>
                <p>{message.createdAt}</p>
            </div>
        );
    }
}