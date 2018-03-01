import React from "react";
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
        if (evt) {
            evt.preventDefault();
        }
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
                    <img src={this.state.message.author.photoURL} alt="gravatar"/>
                </div>
                <div className="wordContent">
                    <p><span id="username">{this.state.message.author.displayName}</span> <span id="timestamp">Posted at: {Date(this.state.message.createdAt)}</span>
                        {
                            this.props.userInfo.userID === this.state.message.author.uid ?
                                !this.state.edit ?
                                    <span>
                                        <button type="button" onClick={() => this.setState({edit: true})} className="btn btn-warning btn-sm">Edit</button>
                                        <button type="button" onClick={() => this.handleDelete()} className="btn btn-danger btn-sm">Delete</button>
                                    </span> :
                                    <span>
                                        <button type="button" onClick={() => this.handleEdit()} className="btn btn-success btn-sm">Update</button>
                                        <button type="button" onClick={() => this.setState({edit: false})} className="btn btn-danger btn-sm">Cancel</button>
                                    </span>
                                : undefined
                        }
                    </p>
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
                                       onChange={evt => this.setState({content: evt.target.value})}
                                       placeholder={this.state.content}
                                />
                            </form> :
                            <p>{this.state.content}</p>
                    }
                </div>
            </div>
        );
    }
}