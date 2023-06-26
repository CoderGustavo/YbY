import React, { Fragment, useState } from 'react';
import { Button, Field, Control, Input, Column, Label, Section, Help} from 'rbx';
import { Navigate} from 'react-router-dom';
import UsersService from '../../../services/users'

function RegisterForm(){
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [address, setAddress] = useState("");
   const [city, setCity] = useState("");
   const [uf, setUf] = useState("");
   const [whats, setWhats] = useState("");
   const [password, setPassword] = useState("");
   const [redirectToLogin, setRedirectToLogin] = useState(false);
   const [error, setError] = useState(false);
   
   const HandleSubmit = async (evt) => {
    evt.preventDefault()
    try {
        const user = await UsersService.register({name: name, email: email, address: address, city: city, uf: uf, whats: whats, password: password})
        setRedirectToLogin(true)
    } catch (error) {
        setError(true)
    }
   }


   if(redirectToLogin)
    return <Navigate to="/login"/> 
   
    return(
        <Fragment>
                <form onSubmit={HandleSubmit}>
                    
                    <Column.Group>

                    <Column>
                        <Field>
                            <Label size="small">Nome:</Label>
                            <Control>
                                <Input type="text" required name="name" value={name} onChange={e => setName(e.target.value)}/>
                            </Control>
                        </Field>
                    </Column>

                    <Column>
                        <Field>
                            <Label size="small">Celular:</Label>
                            <Control>
                                <Input type="text" required name="whats" value={whats} onChange={e => setWhats(e.target.value)}/>
                            </Control>
                        </Field>
                    </Column>
                    </Column.Group>
                    
                    <Column.Group>
                        <Column size={6}>
                        <Field>
                            <Label size="small">Endereço:</Label>
                            <Control>
                                <Input type="text" required name="address" value={address} onChange={e => setAddress(e.target.value)}/>
                            </Control>
                        </Field>
                        </Column>

                        <Column size={4}>
                        <Field>
                            <Label size="small">Cidade:</Label>
                            <Control>
                                <Input type="text" required name="city" value={city} onChange={e => setCity(e.target.value)}/>
                            </Control>
                        </Field>
                        </Column>

                        <Column size={2}>
                        <Field>
                            <Label size="small">Estado:</Label>
                            <Control>
                                <Input type="text" required name="uf" value={uf} onChange={e => setUf(e.target.value)}/>
                            </Control>
                        </Field>
                        </Column>
                    </Column.Group>

                    <Column.Group>
                        <Column>
                        <Field>
                            <Label size="small">Email:</Label>
                            <Control>
                                <Input type="email" required name="email" value={email} onChange={e => setEmail(e.target.value)}/>
                            </Control>
                        </Field>
                        </Column>

                        <Column>
                        <Field>
                            <Label size="small">Senha:</Label>
                            <Control>
                                <Input type="password" required name="password" value={password} onChange={e => setPassword(e.target.value)}/>
                            </Control>
                        </Field>
                        </Column>
                    </Column.Group>

                        <Field>
                            <Control>
                                <Column.Group breakpoint="mobile">
                                    <Column className="has-text-centered">
                                        <a className="button is-white has-text-custom-green" onClick={e => setRedirectToLogin(true)}>Login ou</a>
                                        <Button color="custom-yellow">Cadastro</Button>
                                    </Column>
                                </Column.Group>
                            </Control>
                        </Field>

                        {error && <Help color="danger">E-mail e/ou Senha inválidos</Help>}

                    
                </form>
           
        </Fragment>
    )

}

export default RegisterForm;