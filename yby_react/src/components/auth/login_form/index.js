import React, {Fragment, useState} from 'react';
import {Button, Field, Control, Input, Column, Label, Section, Help} from 'rbx';
import {Navigate} from 'react-router-dom';
import UsersService from '../../../services/users'

function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirectToRegister, setRedirectToRegister] = useState(false);
    const [redirectToSensors, setRedirectToSensors] = useState(false);
    const [error, setError] = useState(false);

    const HandleSubmit = async (evt) => {
        evt.preventDefault()
        try {
            const user = await UsersService.login({email: email, password: password})
            setRedirectToSensors(true)
        } catch (error) {
            setError(true)
        }
    }


    if(redirectToRegister){
        return <Navigate to="/register"/>
    } else if (redirectToSensors){
        return <Navigate to="/sensors"/>
    }


    return(
        <Fragment>
                <form onSubmit={HandleSubmit}>
                    <Column size={12}>
                        <Field>
                            <Label size="small">E-mail</Label>
                            <Control>
                                <Input type="email" required name="email" value={email} onChange={e => setEmail(e.target.value)}></Input>
                            </Control>
                        </Field>

                        <Field>
                            <Label size="small">Senha</Label>
                            <Control>
                                <Input type="password" required name="password" value={password} onChange={e => setPassword(e.target.value)}></Input>
                            </Control>
                        </Field>

                        <Field>
                            <Control>
                                <Column.Group breakpoint="mobile">
                                    <Column className="has-text-centered">
                                        <a className="button is-white has-text-custom-green" onClick={e => setRedirectToRegister(true)}> Cadastre-se ou</a>
                                        <Button color="custom-yellow">Login</Button>
                                    </Column>
                                </Column.Group>
                            </Control>
                        </Field>

                        {error && <Help color="danger">E-mail e/ou Senha inválidos</Help>}
                    </Column>
                </form>
        </Fragment>
    )
}

export default LoginForm