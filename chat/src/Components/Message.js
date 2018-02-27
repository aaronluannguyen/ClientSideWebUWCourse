import React from "react";

export default class Message extends React.Component {
    render() {
        let message = this.props.messageSnap.val();

        return (
            <div className="container">
                <div className="row">
                    <div className="col-1">
                        <img src={message.author.photoURL} alt="profile picture"/>
                    </div>
                    <div className="col-11">
                        <p>{message.author.displayName} ------ Posted at: {message.createdAt}</p>
                        <p>{message.body}</p>
                    </div>
                </div>
            </div>
        );
    }
}