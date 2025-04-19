import { Link } from "react-router-dom";
import Formlogin from "../Fragments/FormLogin";
import Authlayout from "../Layouts/AuthLayout";

const LoginPage = () => {
    return (
        <Authlayout title="Login" type="login" navType="auth">
            <Formlogin></Formlogin>
        </Authlayout>
    );
}

export default LoginPage