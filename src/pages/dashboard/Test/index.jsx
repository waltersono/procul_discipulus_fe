import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/auth';
import { Spinner } from "react-bootstrap";
import './styles.css';
import api from '../../../services/api';
import Header from '../../../components/Header';
import HeaderSubject from '../../../components/HeaderSubject';
import logo from '../../../assets/images/simbolo.png';

const Test = () => {
    const { user } = useContext(AuthContext);
    const { idTest } = useParams();
    const [loading, setLoading] = useState(false);
    const [marks, setMarks] = useState(null);
    const [subject, setSubject] = useState(null);
    const [teste, setTeste] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(60);

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers(prevState => ({
            ...prevState,
            [questionId]: answer
        }));
    };

    const getMarks = (t) => {
        api.get(`/students/test/${idTest}/marks`)
            .then(response => {
                console.log('Marks Response', response.data);
                setTeste(t);
                setMarks(response.data);
            })
            .catch(error => {
                console.error(error.response.data);
            });
    }

    const handleSubmit = () => {
        console.log(userAnswers);
        if (Object.keys(userAnswers).length === questions.length) {
            setAnswerQuestions();
        } else {
            const result = window.confirm("Deseja realmente submeter o : " + teste.name + " sem ter respondido a todas questões ?");
            if (result === true) {
                setAnswerQuestions();
            }
        };
    };

    const setAnswerQuestions = () => {
        setLoading(true);
        api.post('/students/test/answers', { answers: userAnswers })
            .then(response => {
                console.log('/students/test/answers', response.data);
                const t = response.data.teste;
                getMarks(t);
            })
            .catch(error => {
                console.error(error.response);
            })
            .finally(() => setLoading(false));
    }

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}min e ${seconds.toString().padStart(2, '0')}s`;
    };

    // Função para verificar se o tempo acabou
    const checkTimeIsUp = () => {
        if (timeLeft <= 0) {
            console.log('Tempo acabou!');
            // setAnswerQuestions();
        }
    };

    // Efeito para atualizar o cronômetro a cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        // Função de limpeza do efeito
        return () => clearInterval(timer);
    }, []);

    // Verificar se o tempo acabou a cada mudança no state do cronômetro
    useEffect(() => {
        checkTimeIsUp();
    }, [timeLeft]);

    // Manipulador do evento beforeunload para exibir um aviso personalizado antes do reload
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            const confirmationMessage = 'Você tem respostas não enviadas. Tem certeza de que deseja sair?';
            e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
            return confirmationMessage;
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        // Função de limpeza do efeito
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        api.get(`/students/teste/${idTest}`)
            .then(response => {
                setSubject(response.data.subject);
                if (response.data.teste.status === 'Concluída') {
                    getMarks(response.data.teste)
                } else {
                    setQuestions(response.data.exercises);
                    setTeste(response.data.teste);
                    setTimeLeft(response.data.exercises.length * 15 * 60);
                }
            })
            .catch(error => {
                console.error(error.response.data);
            });
    }, [idTest]);

    return (
        <>
            <Header />
            {!teste ? <h1>Loading...</h1> :
                <div className="container-fluid mt-3">
                    <div className="row">
                        <div className="col-12">
                            <HeaderSubject subject={subject} />
                            <div className='title-box'>
                                <span className='title'>Tempo restante: {formatTime(timeLeft)}</span>
                            </div>
                            {marks ?
                                <div className="pt-2">
                                    <div className='d-flex justify-content-between align-items-center' id='quiz_header'>
                                        <span className="">Visualizar nota do {teste.name}</span>
                                    </div>
                                    <div className='title-box mt-2 text-uppercase'>
                                        <h4 className='text-center'><b>{marks.school.name}</b></h4>
                                        <h5 className='text-center'>curso de {marks.course.degree} em {marks.course.name}</h5>
                                        <h6 className='text-center'>Resultados da Avaliação do PPrograma online da Disciplina de {marks.subject}</h6>
                                    </div>
                                    <br />
                                    <div className='my-3'>
                                        <h5>Nome do Estudante: {user.name} {user.surname}</h5>
                                        <h5>Número de questões da Avalição: {marks.total}</h5>
                                        <h5>Número de questões correctas: {marks.corrects}</h5>
                                        <h5>Resultado de desempenho: {marks.marks}</h5>
                                    </div>
                                    <br />
                                    <p className='text-center'><b>Data: {marks.date}</b></p>
                                    <div className='w-100 d-flex justify-content-center'>
                                        {/* <div><img src={`${apiUrl}/${subject?.university}`} alt="Universidade" className='university' /></div> */}
                                        <div><img src={logo} alt="Procul Discipulus" className='university' /></div>
                                    </div>
                                </div>
                                :
                                <div className="pt-2">
                                    <div className='d-flex justify-content-between align-items-center' id='quiz_header'>
                                        <span className="">Realizar {teste.name}</span>
                                        {loading ?
                                            <button type="button" className="btn btn-sm btn-success text-success">
                                                <Spinner
                                                    as="span"
                                                    variant="white"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    animation="grow"
                                                />
                                                Submet
                                            </button> :
                                            <button type='button' className='btn btn-sm btn-success' onClick={handleSubmit}>Submeter</button>}
                                    </div>
                                    <div className={'quizView'}>
                                        {questions.map((question, index) => <div key={question.id} className="quiz">
                                            <p className='question mb-1'>{++index}. {question.question}</p>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`quizOption${question.id}`}
                                                    id={`flexRadioDefault${question.id}1`}
                                                    value="A"
                                                    checked={userAnswers[question.id] === 'A'}
                                                    onChange={() => handleAnswerChange(question.id, 'A')}
                                                />
                                                <label className="form-check-label" htmlFor={`flexRadioDefault${question.id}1`}>{question.optionA}</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`quizOption${question.id}`}
                                                    id={`flexRadioDefault${question.id}2`}
                                                    value="B"
                                                    checked={userAnswers[question.id] === 'B'}
                                                    onChange={() => handleAnswerChange(question.id, 'B')}
                                                />
                                                <label className="form-check-label" htmlFor={`flexRadioDefault${question.id}2`}>{question.optionB}</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`quizOption${question.id}`}
                                                    id={`flexRadioDefault${question.id}3`}
                                                    value="C"
                                                    checked={userAnswers[question.id] === 'C'}
                                                    onChange={() => handleAnswerChange(question.id, 'C')}
                                                />
                                                <label className="form-check-label" htmlFor={`flexRadioDefault${question.id}3`}>{question.optionC}</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`quizOption${question.id}`}
                                                    id={`flexRadioDefault${question.id}4`}
                                                    value="D"
                                                    checked={userAnswers[question.id] === 'D'}
                                                    onChange={() => handleAnswerChange(question.id, 'D')}
                                                />
                                                <label className="form-check-label" htmlFor={`flexRadioDefault${question.id}4`}>{question.optionD}</label>
                                            </div>
                                        </div>)}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>}
        </>
    );
};

export default Test;