import React from "react";
import {Form, Button} from 'react-bootstrap';

class AddPack extends React.Component {

   constructor(props){
       super(props);
       this.state = {
           packSize: ''
       };
       this.input = React.createRef();
   }

    submitForm = (e) =>{
       e.preventDefault();
       this.props.addPack(this.state.packSize);
       this.input.current.value='';
    };

    render() {
        return (<Form className={"m-5"} onSubmit={this.submitForm}>
                <Form.Group controlId="formAddPack" >
                    <Form.Label>Add Packs To Your Inventory</Form.Label>
                    <Form.Control ref={this.input} onChange={(e) => this.setState({packSize: e.target.value})} type="number" placeholder="Add A Pack To Your Inventory"/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>);
    }
}

export default AddPack
