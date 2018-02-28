import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "./Message.css";

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            message: this.props.messageSnap.val(),
            content: this.props.messageSnap.val().body,
            edit: false
        }
    }

    handleEdit(evt) {
        evt.preventDefault();
        this.state.message.body = this.state.content;
        this.props.messageSnap.ref.update({body: this.state.content});
        this.setState({edit: false})
    }

    handleDelete() {
        this.props.messageSnap.ref.remove();
    }

    render() {
        return (
            <div className="container" id="messageBox">
                <div className="imgContainer">
                    <img src={this.state.message.author.photoURL} alt="profile picture"/>
                </div>
                <div className="wordContent">
                    <p>{this.state.message.author.displayName} ------ <span id="timestamp">Posted at: {Date(this.state.message.createdAt)} ------
                        {
                            this.props.userInfo.userID === this.state.message.author.uid ?
                                <span>
                                    <button type="button" onClick={() => this.setState({edit: true})} className="btn btn-link">Edit</button>
                                    <button type="button" onClick={() => this.handleDelete()} className="btn btn-link">Delete</button>
                                </span>
                                : undefined
                        }
                    </span></p>
                    {
                        this.state.edit === true ?
                            <form onSubmit={evt => this.handleEdit(evt)}>
                                {
                                    this.state.fbError ?
                                        <div className="alert alert-danger">
                                            {this.state.fbError.message}
                                        </div> :
                                        undefined
                                }
                                <input type="text" id="text-input-bar"
                                       className="form-control"
                                       value={this.state.content}
                                       onInput={evt => this.setState({content: evt.target.value})}
                                       placeholder={this.state.message.body}
                                />
                            </form> :
                            <p>{this.state.message.body}</p>
                    }
                </div>
            </div>
        );
    }
}