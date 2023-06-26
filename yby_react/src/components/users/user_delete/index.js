import React, {useState} from "react";
import { Button } from "rbx";
import UsersService from '../../../services/users'
import { Navigate } from "react-router-dom";

function UsersDelete() {
    const [redirectToHome, setRedirectToHome] = useState(false)

    const deleteUser = async () => {
        if (window.confirm("Tem certeza de que deseja excluir seu perfil de usuário?\nEssa operação é irreversível")){
            await UsersService.delete()
            setRedirectToHome(true)
        }
    }

    if(redirectToHome){
        return <Navigate to="/"/> 
    }

    return (
        <Button color="custom-red" onClick={() => deleteUser()}>
            Excluir conta
        </Button>
    )
}

export default UsersDelete