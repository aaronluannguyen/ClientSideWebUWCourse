import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class NewMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: undefined
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();
        let messageObj = {
            author: {
                displayName: this.props.userInfo.displayName,
                photoURL: this.props.userInfo.photoUrl,
                uid: this.props.userInfo.userID
            },
            body: this.state.body,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        this.props.channelMessageRef.push(messageObj)
            .then(() => this.setState({body: "", fbError: undefined}))
            .catch(err => this.setState({fbError: err}));
    }

    render() {
        return (
            <form onSubmit={evt => this.handleSubmit(evt)}>
                {
                    this.state.fbError ?
                        <div className="alert alert-danger">
                            {this.state.fbError.message}
                        </div> :
                        undefined
                }
                <input type="text"
                    className="form-control"
                       value={this.state.body}
                       onInput={evt => this.setState({body: evt.target.value})}
                       placeholder="Type your message..."
                />
            </form>
        );
    }
}