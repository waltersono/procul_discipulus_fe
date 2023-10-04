import React, { useContext, useState } from "react";
import loginbanner from '../../../assets/images/loginbanner.jpg';
import { Image, Spinner } from "react-bootstrap";
import './style.css';
import { AuthContext } from "../../../contexts/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import api from "../../../services/api";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setLoading(true);
        api.post("login", { email, password })
            .then(response => {
                console.log(response.data);
                signIn(response.data);
                navigate("/cursos");
            })
            .catch(error => {
                console.error(error.response.data)

                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    toast.error(error.response.data.message);
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="container-fluid">
            <div className="row" style={{ height: '100vh' }}>
                <div className="col-12 col-md-5 form-content">
                    <form autoComplete="off" onSubmit={handleSubmit} className="px-0 px-md-3">
                        <div className="text-center mb-2">
                            <span className="text-uppercase" style={{ fontSize: '2rem' }}><span className="text-danger"><b><b>Procul</b></b></span><span className="text-dark"><b><b>Discipulus</b></b></span></span>
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="inputEmail"
                                placeholder="E-mail"
                                value={email}
                                onChange={({ target }) => setEmail(target.value)}
                            />
                            {errors.email && <p className="text-danger">{errors.email}</p>}
                        </div>
                        <div className="form-group mb-3">
                            <div class="input-group">
                                <input type={showPassword ? 'text' : 'password'} value={password} className="form-control" placeholder="Senha" onChange={({ target }) => setPassword(target.value)} />
                                <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                            </div>
                            {errors.password && <p className="text-danger">{errors.password}</p>}
                        </div>
                        <div className="form-group mb-2">
                            {loading ?
                                <button type="button" className="btn btn-dark bg_tracking text-white w-100" disabled={true}>
                                    <Spinner
                                        as="span"
                                        variant="white"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        animation="grow"
                                    />
                                </button> :
                                <button type="submit" className="btn btn-dark bg_tracking text-white w-100">
                                    Iniciar sessão
                                </button>
                            }
                        </div>
                        <p className="orline mb-2">OU</p>
                        <div className="form-group mb-2">
                            <button type="submit" className="btn btn-outline-dark w-100" onClick={() => navigate("/recover_password")}>
                                Esqueci minha senha
                            </button>
                        </div>
                    </form>
                </div>
                <div className="d-none d-md-block col-12 col-md-7 bg-img">
                    <div className="d-flex justify-content-between align-items-center h-100">
                        <Image src={loginbanner} width={"100%"} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;