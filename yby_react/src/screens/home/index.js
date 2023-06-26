import React, {Fragment} from "react";
import celular from '../../assets/images/pontosCelular.png'
import Header from '../../components/header'
import {Column, Section, Title, Container} from "rbx";
import '../../styles/home.scss'
import {Link} from "react-router-dom";

const HomeScreen = () => (
    <Fragment>
        <Header></Header>

        <Section className="home">
            <Title size={1} spaced className="main-title">
                CONHECIMENTO QUE SALVA:
            </Title>
            <h2 className="sub-title">monitorando umidade, protegendo comunidades</h2>
            
            <Container>
                <Column.Group>
                    <Column size={6}>
                        <img src={celular} className="celular"></img>
                    </Column>

                    <Column size={5} offset={1} className="descricao">
                        <Title size={5} spaced className="has-text-black" subtitle>
                            O projeto YbY monitora a umidade do solo, oferece alertas precisos e contribui para a segurança das comunidades. Combinando tecnologia e expertise em ciências da terra, trabalhamos para alertar sobre a possibilidade de ocorrência de escorregamentos de terra e desastres associados. 
                            <br></br><br></br>
                            Com nossa plataforma, é possível tomar medidas proativas e mitigar riscos, protegendo vidas e promovendo a resiliência das comunidades.
                        </Title>

                        <Link to="/register" className="button is-large meu-cadastro">
                            <strong>Cadastre-se aqui</strong>
                        </Link>
                    </Column>
                </Column.Group>
            </Container>
        </Section>
    </Fragment>
)

export default HomeScreen