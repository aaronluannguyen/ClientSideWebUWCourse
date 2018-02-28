import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "./Message.css";

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            message: this.props.messageSnap.val()
        }
    }

    handleEdit() {

    }

    handleDelete() {

    }

    render() {
        return (
            <div className="container" id="messageBox">
                <div className="imgContainer">
                    <img src={this.state.message.author.photoURL} alt="profile picture"/>
                </div>
                <div className="wordContent">
                    <p>{this.state.message.author.displayName} ------ <span id="timestamp">Posted at: {Date(this.state.message.createdAt)}</span></p>
                    <p>{this.state.message.body}</p>
                    {
                        this.props.userInfo.userID === this.state.message.author.uid ?
                            <p>
                                <button type="button" className="btn btn-link">Edit</button>
                                <button type="button" className="btn btn-link">Delete</button>
                            </p> :
                            undefined
                    }
                </div>
            </div>
        );
    }
}