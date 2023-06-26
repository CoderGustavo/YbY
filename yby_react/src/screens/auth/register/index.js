import React, {Fragment} from "react";
import Header from '../../../components/header'
import {Column, Section, Title, Container, Card} from "rbx";
import logo from '../../../assets/images/logo.png'
import '../../../styles/auth.scss'
import RegisterForm from '../../../components/auth/register_form'

const RegisterScreen = () => (
    <Fragment>
        <Header></Header>

        <Section size="small" className="auth">
            <Container>
                <Column.Group centered>
                    <Column size={10}>
                        <Card>
                            <Card.Content>
                                <Section>
                                    <Column.Group centered>
                                        <Column size={2} className="column-logo">
                                            <img src={logo} className="logo"></img>
                                        </Column>
                                    </Column.Group>

                                    <Column.Group>
                                        <Column size={12}>
                                            <Title size={4} className="has-text-custom-yellow has-text-centered main-subtitle">
                                                Mudando vidas
                                            </Title>
                                        </Column>
                                    </Column.Group>

                                    <RegisterForm/>
                                </Section>
                            </Card.Content>
                        </Card>
                    </Column>
                </Column.Group>
            </Container>
        </Section>
    </Fragment>
)

export default RegisterScreen