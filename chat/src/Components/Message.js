import React from "react";

export default class Message extends React.Component {
    render() {
        let message = this.props.messageSnap.val();

        return (
            <div>
                {message.author.displayName}
                {message.author.photoURL}
                {message.author.uid}
                {message.body}
                {message.createdAt}
            </div>
        );
    }
}