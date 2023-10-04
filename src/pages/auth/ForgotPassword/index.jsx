import React, { useContext, useState } from "react";
import loginbanner from '../../../assets/images/loginbanner.jpg';
import { Image, Spinner } from "react-bootstrap";
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import api from "../../../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        api.post("/forgot-password", { email })
        .then(response => {
            toast.success(response.data.message);
        })
        .catch(error => {
            console.error(error.response)
            toast.error(error.response.data.message);
        })
        .finally(() => setLoading(false));
    };

    return (
        <div className="container-fluid">
            <div className="row" style={{ height: '100vh'}}>
                <div className="col-12 col-md-5 form-content">
                    <form onSubmit={handleSubmit} className="px-0 px-md-3">
                        <div className="text-center mb-2">
                            <span className="text-uppercase" style={{ fontSize: '2rem'}}><span className="text-danger"><b><b>Procul</b></b></span><span className="text-dark"><b><b>Discipulus</b></b></span></span>
                        </div>
                        <p>Informe o e-mail para o qual deseja redefinir a sua senha.</p>
                        <div className="form-group mb-3">
                            {/* <label htmlFor="inputEmail">E-mail</label> */}
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
                            <button type="submit" className="btn btn-dark bg_tracking text-white w-100">Recuperar senha</button>}
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

export default ForgotPassword;