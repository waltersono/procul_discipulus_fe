import React, { useContext, useState, useEffect } from "react";
import loginbanner from '../../../assets/images/loginbanner.jpg';
import { Image, Spinner } from "react-bootstrap";
import './style.css';
import { AuthContext } from "../../../contexts/auth";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import api from "../../../services/api";

const ResetPassword = () => {
    const { signIn } = useContext(AuthContext);
    const [email,setEmail] = useState("");
    const [token,setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        setEmail(email);
        setToken(token);
        console.log('Token:', token);
        console.log('Email:', email);        
      }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if(email !=="" && token !=="" && password !=="" && confirmPassword !==""){
            if (password === confirmPassword) {
                setLoading(true);
                await api.post("/reset-password", { email, password, password_confirmation: confirmPassword, token })
                .then(response => {
                    console.log(response)
                    toast.success(response.data.message);
                })
                .catch(error => {
                    console.error(error.response)
                    toast.error(error.response.data.message);
                })
                .finally(() => setLoading(false));

                await api.post("/login", { email, password })
                .then(response => {
                    signIn(response.data);
                    navigate("/cursos");
                });
            }else{
                toast.error("Verficar sua senha");
            }
        }else{
            toast.error("Preencha todos os campos!");
        }
    };

    return (
        <div className="container-fluid">
            <div className="row" style={{ height: '100vh'}}>
                <div className="col-12 col-md-5 form-content">
                    <form autoComplete="off" onSubmit={handleSubmit} className="px-0 px-md-3">
                        <div className="text-center mb-2">
                            <span className="text-uppercase" style={{ fontSize: '2rem'}}><span className="text-danger"><b><b>Procul</b></b></span><span className="text-dark"><b><b>Discipulus</b></b></span></span>
                        </div>
                        <div className="form-group mb-3">
                            {/* <label htmlFor="inputEmail">E-mail</label> */}
                            <input 
                                type="email" 
                                className="form-control" 
                                id="inputEmail" 
                                placeholder="E-mail"  
                                value={email}
                                disabled={true}
                            />
                        </div>
                        <div className="form-group mb-3">
                            {/* <label htmlFor="inputPassword1">Senha</label> */}
                            <input 
                                type="password" 
                                className="form-control" 
                                id="inputPassword1" 
                                placeholder="Senha"  
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            {/* <label htmlFor="inputPassword2">Confirmar Senha</label> */}
                            <input 
                                type="password" 
                                className="form-control" 
                                id="inputPassword2" 
                                placeholder="Confirmar Senha"  
                                value={confirmPassword}
                                onChange={({ target }) => setConfirmPassword(target.value)}
                            />
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
                            </button>:
                            <button type="submit" className="btn btn-dark bg_tracking text-white w-100">
                                Salvar Senha
                            </button>
                            }
                        </div>
                        <p className="orline mb-2">OU</p>
                        <div className="form-group mb-2">
                            <Link to="/" className="btn btn-outline-dark w-100">Iniciar sessão</Link>
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

export default ResetPassword;