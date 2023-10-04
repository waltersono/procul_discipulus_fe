import React, { useContext, useState } from "react";
import logo from '../../../assets/images/logo.png';
import loginbanner from '../../../assets/images/loginbanner.jpg';
import { Image } from "react-bootstrap";
import './style.css';
import { AuthContext } from "../../../contexts/auth";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import api from "../../../services/api";

const Register = () => {
    const { signIn } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cellphone, setCellPhone] = useState("");
    const [identityCard, setIdentityCard] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [registrationKey, setRegistrationKey] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(email !== "" && name !== "" && registrationKey !== "" && dateOfBirth !== "" && cellphone !== "" && identityCard !== "" && password !== "" && password2 !== ""){
            if(password === password2){
                const admin = { email, name, registrationKey, password }
                api.post("/admin/register", admin)
                .then(response => {
                    toast.success("Conta criada com sucesso!");
                    //Fazer Login com a conta do administrador registado
                    api.post("/admin/authenticate", { email, password })
                    .then(response => {
                        signIn(response.data);
                        navigate("/");
                    });
                })
                .catch(error => {
                    toast.error(error.response.data.error);
                });
            }else{
                toast.error("confirmar password!");
                setPassword("");
                setPassword2("");
            }
        }else{
            toast.error("Preencher todos campos!");
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-5 form-content">
                    <form autoComplete="off" onSubmit={handleSubmit} className="px-0 px-md-3" style={{ width: "90%" }}>
                        <div className="text-center">
                            <Image src={logo} width={130} height={130}/>
                        </div>
                        <div className="form-row">
                            <div className="form-group mb-1">
                                <label htmlFor="inputName">Nome do utilizador</label>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="inputName"
                                        placeholder="Nome do utilizador"  
                                        autoComplete="off" 
                                        value={name}
                                        onChange={({ target }) => setName(target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>                        
                        <div className="form-group mb-1">
                            <label htmlFor="inputEmail">E-mail</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="inputEmail" 
                                placeholder="E-mail"  
                                value={email}
                                onChange={({ target }) => setEmail(target.value)}
                                required
                            />
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-7 form-group mb-2">
                                <label htmlFor="inputName">Bilhete de identidade</label>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm" 
                                        id="inputName"
                                        placeholder="Bilhete de identidade"  
                                        autoComplete="off" 
                                        value={identityCard}
                                        onChange={({ target }) => setIdentityCard(target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-5 form-group mb-2">
                                <label htmlFor="dateOfBirth">Data de Nascimento</label>
                                <div className="input-group">
                                    <input 
                                        type="date" 
                                        className="form-control form-control-sm" 
                                        id="dateOfBirth" 
                                        autoComplete="off" 
                                        value={dateOfBirth}
                                        onChange={({ target }) => setDateOfBirth(target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group mb-2">
                                <label htmlFor="inputPhone">Celular</label>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm" 
                                        id="inputPhone"
                                        placeholder="Celular"  
                                        autoComplete="off" 
                                        value={cellphone}
                                        onChange={({ target }) => setCellPhone(target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-6 form-group mb-2">
                                <label htmlFor="inputPassword1">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="inputPassword1" 
                                    placeholder="Password"  
                                    value={password}
                                    onChange={({ target }) => setPassword(target.value)}
                                    required
                                />
                            </div>
                            <div className="col-12 col-md-6 form-group mb-2">
                                <label htmlFor="inputPassword2">Confirmar Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="inputPassword2" 
                                    placeholder="Confirmar Password"  
                                    value={password2}
                                    onChange={({ target }) => setPassword2(target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="inputKey">Chave de registro</label>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="inputKey"
                                    placeholder="Chave de registro"  
                                    autoComplete="off" 
                                    value={registrationKey}
                                    onChange={({ target }) => setRegistrationKey(target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <button type="submit" className="btn btn-dark bg_tracking text-white w-100">Registar</button>
                        </div>
                        <p className="orline mb-2">OU</p>
                        <div className="form-group mb-2">
                            <Link to="/" className="btn btn-outline-dark w-100">Login</Link>
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

export default Register;