import React, {Fragment} from "react";
import Header from '../../../components/header'
import {Column, Section, Title, Container, Card} from "rbx";
import logo from '../../../assets/images/logo.png'
import '../../../styles/auth.scss'
import LoginForm from '../../../components/auth/login_form'

const LoginScreen = () => (
    <Fragment>
        <Header></Header>
        <Section size="small" className="auth">
            <Container>
                <Column.Group centered>
                    <Column size={6}>
                        <Card>
                            <Card.Content>
                                <Section>
                                    <Column.Group centered>
                                        <Column size={4}>
                                            <img src={logo} className="logo"></img>
                                        </Column>
                                    </Column.Group>

                                    <Column.Group>
                                        <Column size={12}>
                                            <Title size={8} className="has-text-custom-yellow has-text-centered main-subtitle">
                                                Mudando vidas
                                            </Title>
                                        </Column>
                                    </Column.Group>

                                    <LoginForm></LoginForm>
                                </Section>
                            </Card.Content>
                        </Card>
                    </Column>
                </Column.Group>
            </Container>
        </Section>
    </Fragment>
)

export default LoginScreen