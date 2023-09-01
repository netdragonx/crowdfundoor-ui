import "@rainbow-me/rainbowkit/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import Header from "./components/Header";
import NewCampaign from "./components/NewCampaign";
import ViewCampaign from "./components/ViewCampaign";

const CONTRACT_ADDRESS = "0x213676Ad8C0beF9EF948eA185Bea1E03526eB15E";

const App: React.FC = () => {
  return (
    <Container className="app">
      <Row>
        <Col className="app-header">
          <Header />
        </Col>
      </Row>
      <Row>
        <Col>
          <ViewCampaign contractAddress={CONTRACT_ADDRESS} />
        </Col>
      </Row>
      <Row>
        <Col>
          <NewCampaign contractAddress={CONTRACT_ADDRESS} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
