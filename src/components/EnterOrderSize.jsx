import React from "react";
import {Button, Form} from "react-bootstrap";

class EnterOrderSize extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            orderValue: '',
            buttonActive: true,
            buttonText: 'Submit'
        };
    }

    submitForm = (e) =>{
        e.preventDefault();
        this.setState({
            buttonActive: false,
            buttonText: 'Please Wait'
        } );
        setTimeout(() => {
            this.props.enterOrderSize(this.state.orderValue).then(res => {
                this.setState({
                    buttonActive: true, buttonText: 'Submit'
                });
            });
        }, 500);

    };

    render() {
        return (<Form className="m-5" onSubmit={this.submitForm}>
            <Form.Group controlId="formAddPack" >
                <Form.Label>Enter the order value</Form.Label>
                <Form.Control onChange={(e) => this.setState({orderValue: e.target.value})} type="number" placeholder="Enter Order Size"/>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!this.state.buttonActive}>
                {this.state.buttonText}
            </Button>
        </Form>);
    }

}

export default EnterOrderSize;
