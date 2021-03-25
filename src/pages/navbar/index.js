import React, { useState } from 'react';
import { Icon, Navbar, Dropdown, Nav, Modal, Button } from 'rsuite';
import { history } from '../../history';
import "./styles.css";

export default function App() {

  const [activeKey, setActiveKey] = useState()
  const [expanded, setExpanded] = useState(true)

  const [show, setShow] = useState(false)

  const NavBarInstance = ({ onSelect, activeKey, ...props }) => {
    return (
      <Navbar {...props} id="menu">
        <Navbar.Body>
          <Nav onSelect={onSelect} activeKey={activeKey}>
            <Nav.Item onClick={() => history.replace('/home')} icon={<Icon icon="home" />} >Home</Nav.Item>
            <Nav.Item onClick={() => history.replace('/pedidos')} icon={<Icon icon="shopping-basket" />} >Pedidos</Nav.Item>
            <Nav.Item onClick={() => history.replace('/produtos')} icon={<Icon icon="cutlery" />} >Produtos</Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
    );
  };

  function handleSelect(eventKey) {
    setActiveKey(eventKey)
  }
  return (
    <div>
      <NavBarInstance onSelect={handleSelect} />
    </div>
  );


}
