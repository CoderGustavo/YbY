import React, {useState} from "react";
import {Navbar, Container, Column, Button, Dropdown} from 'rbx'
import logoImage from '../../assets/images/logo2.png'
import '../../styles/header.scss'
import UsersService from "../../services/users"
import {Navigate, Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

function HeaderLoggedEditUser(props) {
    const [redirectToHome, setRedirectToHome] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('user'))
   
    const logOut = async () => {
        await UsersService.logout();
        setRedirectToHome(true);
    }
   
    if (redirectToHome == true)
        return <Navigate to="/"/>
   
    return (
        <Navbar color="custom-green" className="navbar-logged">
            <Navbar.Brand>
                <Column.Group>
                    <Column size="12" offset={3}>
                        <Link to="/sensors">
                            <img src={logoImage} className="logo"/>
                        </Link>
                    </Column>
                </Column.Group>

                <Navbar.Burger className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </Navbar.Burger>
            </Navbar.Brand>
   
            <Navbar.Menu>
                <Navbar.Segment as="div" className="navbar-item navbar-end" align="right">    
                    <Navbar.Item as="div">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <Button className="button" color="custom-yellow" outlined>
                                    <span>{JSON.parse(user)['name']} ▼</span>
                                </Button>
                            </Dropdown.Trigger>
                            <Dropdown.Menu className="menuzinho">
                                <Dropdown.Content>
                                    <Dropdown.Item as="div">
                                        <Link to="/users/edit" className="btn-menuzinho">Editar Usuário</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as="div">
                                        <a href="#" className="btn-menuzinho" onClick={e => logOut()}>Sair</a>
                                    </Dropdown.Item>
                                </Dropdown.Content>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Item>
                </Navbar.Segment>
            </Navbar.Menu>
        </Navbar>
    )
}
   
export default HeaderLoggedEditUser;