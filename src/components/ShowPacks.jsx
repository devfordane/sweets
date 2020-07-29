import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from "@fortawesome/free-solid-svg-icons";


class ShowPacks extends React.Component {
    render() {
        return (
            <>
                <ListGroup>
                    {this.props.packs.map((pack, index) =>
                        <div key={index}><ListGroup.Item>{pack} <FontAwesomeIcon icon={faTrash} onClick={() => this.props.removePack(pack)} /></ListGroup.Item></div>
                            )}
                        </ListGroup>
                </>
        );
    }
}



export default ShowPacks;
