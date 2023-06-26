import React from "react";
import {Navbar, Container, Column} from 'rbx'
import logoImage from '../../assets/images/logo2.png'
import '../../styles/header.scss'
import {Link} from "react-router-dom";

function Header(){
    return(
        <Navbar>
            <Container>
                <Navbar.Brand>
                    <Link to="/"><img src={logoImage}></img></Link>
                    <Navbar.Burger className="navbar-burguer burguer" aria-label="menu" aria-expanded="false" data-target="navbar-menu">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </Navbar.Burger>
                </Navbar.Brand>

                <Navbar.Menu id="navbar-menu">
                    <Navbar.Segment as="div" className="navbar-item navbar-end" align="right">
                        <Column.Group>
                            <Column>
                                <Link to="/register" className="button is-custom-green has-text-custom-yellow botao-nav">
                                    Cadastro
                                </Link>
                                <Link to="/login" className="button is-outlined is-custom-yellow has-text-custom-yellow botao-nav">
                                    Login
                                </Link>
                            </Column>
                        </Column.Group>
                    </Navbar.Segment>
                </Navbar.Menu>
            </Container>
        </Navbar>
    )
}
export default Header