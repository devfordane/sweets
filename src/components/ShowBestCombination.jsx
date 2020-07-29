import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

class ShowBestCombination extends React.Component {

    render() {
        return (<>
                <Card>
                    <Card.Header>For the order of <span className="font-weight-bold">{this.props.orderSize}</span><br/>
                        we can send <span className="font-weight-bold">{this.props.bestValue}</span> sweets <br/>
                        with <span className="font-weight-bold">{this.props.bestQty}</span> packs</Card.Header>
                    <ListGroup variant="flush">
                        {Object.entries(this.props.bestPacks).map(([index, qty]) => qty > 0 &&
                            <div key={index}>
                            <ListGroup.Item >{qty} packs of {this.props.packs[index]} </ListGroup.Item>
                        </div>)}
                    </ListGroup>
                </Card>
            </>);
    }
}

export default ShowBestCombination
