import React from 'react';
import AddPack from './components/AddPack';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ShowPacks from "./components/ShowPacks";
import EnterOrderSize from "./components/EnterOrderSize";
import ShowBestCombination from "./components/ShowBestCombination";
import getBestPacks from './lib/GetPacks';
import Jumbotron from "react-bootstrap/Jumbotron";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      packs: [500,200,100],
      orderSize: 0,
      bestValue: 0,
      bestQty: 0,
      bestPacks: [],
      buttonActive: true,
      buttonText: 'Submit'
    };
  }

  handlePackRemoval = (pack) => {
    let index = this.state.packs.indexOf(pack);
    let packs = this.state.packs;
    packs.splice(index,1);
    this.setState({
      packs,
      bestValue:0,
      bestQty:0,
      bestPack:[]
    });
  };

  handlePackAddition = ( pack ) => {
    let packs = this.state.packs;
    if ( packs.includes(parseInt(pack)) ) {
      return false;
    }
    packs.push(parseInt(pack));
    packs.sort(function(a, b) {
      return b - a;
    });
    this.setState({
      packs,
      bestValue:0,
      bestQty:0,
      bestPack:[]
    });
  };

  buttonInActive = () => {
    this.setState({
      buttonActive: false,
      buttonText: 'Please Wait'
    });
  };

  buttonActive(){
    this.setState({
      buttonActive: true,
      buttonText: 'Submit'
    });
  }

  handleOrderSize = ( orderSize ) => {

    return getBestPacks(orderSize, this.state.packs).then(orderDetails => {
      this.setState({
        orderSize: orderSize,
        bestValue: orderDetails.total,
        bestQty: orderDetails.qty,
        bestPacks: orderDetails.packs,
      });
    });

  };

  render() {
    return (
        <div className="App">
          <header>
            <Jumbotron>
             <h1>Simon's Sweet Shop</h1>
            </Jumbotron>
          </header>
          <div>
            <Container>
              <Row>
                <Col>
                  <AddPack addPack={this.handlePackAddition}/>
                  <ShowPacks packs={this.state.packs} removePack={this.handlePackRemoval}/>
                </Col>
                <Col>
                  <EnterOrderSize enterOrderSize={this.handleOrderSize} buttonActive={this.state.buttonActive} buttonText={this.state.buttonText}/>
                  {this.state.bestValue > 0  &&
                    <ShowBestCombination orderSize={this.state.orderSize} bestValue={this.state.bestValue} bestQty={this.state.bestQty} bestPacks={this.state.bestPacks} packs={this.state.packs}/>
                  }
                </Col>
              </Row>
            </Container>
          </div>
        </div>
    );
  }
}


export default App;
