import React, {Fragment, useState, useEffect} from "react";
import { Button, Field, Control, Input, Column, Title, Help, Label } from "rbx";
import UsersService from "../../../services/users";

function UsersEditForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [uf, setUf] = useState("");
    const [whats, setWhats] = useState("");
     const [status, setStatus] = useState(null)

    const initializeUser = async () => {
        const user = await JSON.parse(localStorage.getItem('user'))
        setName(user['name'])
        setEmail(user['email'])
        setAddress(user['address'])
        setCity(user['city'])
        setUf(user['uf'])
        setWhats(user['whats'])
    }

    useEffect(() => {
        initializeUser()
    }, [])

    const HandleSubmit = async (evt) => {
        evt.preventDefault()

        try {
            await UsersService.update({name: name, email: email, address: address, city: city, uf: uf, whats: whats})
            setStatus("success")
        } catch (error) {
            setStatus("error")
        }
    }

    return (
        <Fragment>
            <form onSubmit={HandleSubmit}>
                <Field>
                    <Control>
                        <Label className="has-text-custom-green">Nome Completo</Label>
                        <Input type="text" value={name || ""} onChange={e => setName(e.target.value)} required name="name"/>
                    </Control>
                </Field>

                <Field>
                    <Control>
                        <Label className="has-text-custom-green">E-mail</Label>
                        <Input type="email" value={email || ""} onChange={e => setEmail(e.target.value)} required name="email"/>
                    </Control>
                </Field>

                <Field>
                    <Control>
                        <Label className="has-text-custom-green">Endereço</Label>
                        <Input type="text" value={address || ""} onChange={e => setAddress(e.target.value)} required name="address"/>
                    </Control>
                </Field>

                <Field>
                    <Control>
                        <Label className="has-text-custom-green">Cidade</Label>
                        <Input type="text" value={city || ""} onChange={e => setCity(e.target.value)} required name="city"/>
                    </Control>
                </Field>

                <Field>
                    <Control>
                        <Label className="has-text-custom-green">Estado</Label>
                        <Input type="text" value={uf || ""} onChange={e => setUf(e.target.value)} required name="uf"/>
                    </Control>
                </Field>

                <Field>
                    <Control>
                        <Label className="has-text-custom-green">Celular</Label>
                        <Input type="text" value={whats || ""} onChange={e => setWhats(e.target.value)} required name="whats"/>
                    </Control>
                </Field>

                <Field>
                    <Control>
                        <Column.Group>
                            <Column className="has-text-right">
                                <Button color="custom-yellow">Atualizar informações</Button>
                            </Column>
                        </Column.Group>
                    </Control>
                </Field>
                {status == "error" &&
                    <Help color="danger">Problemas em atualizar informações do usuário</Help>
                }
                {status == "success" &&
                    <Help color="primary">Informações atualizadas com sucesso</Help>
                }
            </form>
        </Fragment>
    )
}

export default UsersEditForm