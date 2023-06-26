import React, {Fragment, useState} from 'react';
import { Button, Field, Control, Input, Column, Title, Help, Label } from 'rbx';
import UsersService from '../../../services/users'

function UsersEditFormPassword(){
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [status, setStatus] = useState(null)

    const HandleSubmit = async (evt) => {
        evt.preventDefault()

        if(password == password_confirmation) {
            try {
                await UsersService.updatePassword({password: password})
                setStatus("success")
            } catch (error) {
                setStatus("error")
            }
        } else {
            setStatus("error_confirmation_password")
        }
    }

    return (
        <Fragment>
            <form onSubmit={HandleSubmit}>
                <Field>
                    <Control>
                        <Label className="has-text-custom-green">Nova Senha</Label>
                        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required name="password"/>
                    </Control>
                </Field>

                <Field>
                    <Control>
                        <Label className="has-text-custom-green">Confirme a nova senha</Label>
                        <Input type="password" value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} required name="password_confirmation"/>
                    </Control>
                </Field>

                <Field>
                    <Control>
                        <Column.Group>
                            <Column className="has-text-right">
                                <Button color="custom-yellow">Atualizar senha</Button>
                            </Column>
                        </Column.Group>
                    </Control>
                </Field>
                {status == "error" &&
                    <Help color="danger">Problemas em atualizar a senha</Help>
                }
                {status == "error_confirmation_password" &&
                    <Help color="danger">Atenção! Senhas não correspondem. Tente novamente</Help>
                }
                {status == "success" &&
                    <Help color="primary">Senha atualizada com sucesso</Help>
                }
            </form>
        </Fragment>
    )
    
}

export default UsersEditFormPassword;