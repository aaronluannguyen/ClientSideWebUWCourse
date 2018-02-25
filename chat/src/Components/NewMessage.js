import React from "react";

export default class NewMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageObj: {
                author: {
                    displayName: undefined,
                    photoURL: undefined,
                    uid: undefined
                },
                body: undefined,
                createdAt: undefined
            }
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();

        let messageObj = {

        };

        this.props.channelMessageRef.push(messageObj)
            .then(() => this.setState({messageObj: messageObj, fbError: undefined}))
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