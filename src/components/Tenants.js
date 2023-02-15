import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TenantsInvites from "./TenantsInvites";
import TenantsNotOwn from "./TenantsNotOwn";
import TenantsOwn from "./TenantsOwn";
import './Tenants.css'

function Tenants() {

  return(
    <div>
      <Container
        // fluid
      >
        <Row>
          <Col>
            <TenantsInvites/>
          </Col>
          <Col>
            <TenantsNotOwn/>
          </Col>
          <Col>
            <TenantsOwn/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Tenants;