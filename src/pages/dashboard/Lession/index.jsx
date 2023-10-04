import React, { useContext, useState, useEffect } from 'react';
import { /*useNavigate,*/ useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/auth';
// import FileViewer from 'react-file-viewer';
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import ReactPlayer from 'react-player';
import './styles.css';
import api from '../../../services/api';
import Header from '../../../components/Header';
import HeaderSubject from '../../../components/HeaderSubject';

const Lession = () => {
    const { user } = useContext(AuthContext);
    // const navigation = useNavigate();
    const { idLession } = useParams();
    const [loading, setLoading] = useState(false);
    const [lastTopic, setLastTopic] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showMarks, setShowMarks] = useState(false);
    const [marks, setMarks] = useState(null);
    const [subject, setSubject] = useState(null);
    const [lession, setLession] = useState(null);
    const [active, setActive] = useState(null);
    const [summary, setSummary] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [showSummary, setShowSummary] = useState(false);
    const toggle = () => setShowSummary(!showSummary);

    useEffect(() => {
        api.get(`/students/lessions/${idLession}`)
            .then(response => {
                console.log('Lession Response', response.data);
                setSubject(response.data.subject);
                if(response.data.lession.summary.length > 0){
                    setActive(response.data.lession.summary[0]);
                }
                setLession(response.data.lession);
                setSummary(response.data.lession.summary);
                setQuestions(response.data.quiz);
                setLastTopic(response.data.lession.summary[response.data.lession.summary.length - 1]);

            })
            .catch(error => {
                console.error(error.response.data);
            });
    }, [idLession]);

    const showTopic = (currentTopic) => {
        console.log(currentTopic)
        for (let i = 0; i < summary.length; i++) {
            if (summary[i].id === currentTopic.id) {
                setActive(currentTopic);
                setShowQuiz(true);
                setShowMarks(false);
            }
        }
        if (lastTopic.id === lession.id) {
            setShowQuiz(true);
        } else {
            setShowQuiz(false);
        }
    }

    // const endLession = (lession) => {
    //     api.post('/students/lessions/end', { lession_id: lession.id })
    //         .then(response => {
    //             console.log(response);
    //         })
    //         .catch(error => {
    //             console.error(error.response);
    //         });
    // }

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers(prevState => ({
            ...prevState,
            [questionId]: answer
        }));
    };

    const handleSubmit = () => {
        setLoading(true);
        if(Object.keys(userAnswers).length === questions.length){
            api.post('/students/quiz/answers', { answers: userAnswers })
                .then(response => {
                    console.log('/students/quiz/answers', response.data);
                    setLession(response.data.lession);
                    getMarks();
                })
                .catch(error => {
                    console.error(error.response);
                })
                .finally(() => setLoading(false));
        }else{
            toast.error('Por favor, responda todas questões');
            setLoading(false);
        }
    };

    const handleShowQuiz = () => {
        if (lession.status === 'Concluída') {
            getMarks();
        } else {
            setShowQuiz(true);
        }
    };
    
    const getMarks = () => {
        api.post('/students/quiz/marks', { lession: lession.id })
            .then(response => {
                console.log('/students/quiz/marks', response.data);
                setMarks(response.data);
                setShowQuiz(false);
                setShowMarks(true);
            })
            .catch(error => {
                console.error(error.response);
            });
    };

    const handleReplyQuiz = () => {
        setUserAnswers({});
        setShowQuiz(true);
        setShowMarks(false);
    }

    const handleShowSummary = () => {
        toggle();
    }

    // const file = 'https://www.youtube.com/watch?v=ahoMpbZQcnY';
    // const type = 'mp4';
    // const file = 'https://www.youtube.com/watch?v=7aoh8fDfdhc';
    // const type = 'pdf';    

    return (
        <>
            <Header />
            {!active || !lession? 
            <div className='d-flex align-items-center justify-content-center h-100'><Spinner as="span" variant="primary" size="lg" role="status" aria-hidden="true" animation="grow" /></div> :
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className={showSummary ? 'col-12 col-md-8' : 'col-12'}>
                        <div className={showSummary ? '' : 'd-none'}>
                            <HeaderSubject subject={subject} />
                        </div>
                        <div className='title-box px-2 d-flex justify-content-between'>
                            <span className='title'>{lession.name} - {active.name}</span> <button className='btn btn-sm btn-success' onClick={handleShowSummary}>{showSummary ? 'Ocultar sumário':'Mostrar sumário'}</button>
                        </div>
                        {showMarks ?
                        <div className="pt-2">
                            <div className='d-flex justify-content-between align-items-center' id='quiz_header'>
                                <span className="">Visualizar nota do teste</span>
                                <button className='btn btn-sm btn-success' onClick={handleReplyQuiz}>Refazer</button>
                            </div>
                            <div className='title-box mt-2 text-uppercase'>
                                <h4 className='text-center'><b>{marks.school}</b></h4>
                                <h5 className='text-center'>curso de {marks.course.degree} em {marks.course}</h5>
                                <h6 className='text-center'>Resultados da Avaliação do programa online da disciplina de {marks.subject}</h6>
                            </div>
                            {/* <div className='title-box mt-2 text-uppercase'>
                                <h5>Resultados da Avaliação do programa online da disciplina de {marks.subject}, curso de {marks.course} na {marks.school}</h5>  
                            </div> */}
                            <br />
                            <br />
                            <div className='my-3'>
                                <h5>Nome do Estudante: {user.name} {user.surname}</h5>
                                <h5>Número de questões da Avalição: {marks.total}</h5>
                                <h5>Número de questões correctas: {marks.corrects}</h5>
                                <h5>Resultado de desempenho: {marks.marks}</h5>
                            </div>
                            <br />
                            <br />
                            <p className='text-center'><b>Data: {marks.date}</b></p>
                        </div>
                        :
                        <>
                        {showQuiz ?
                            <div className="pt-2">
                                <div className='d-flex justify-content-between align-items-center' id='quiz_header'>
                                    <span className="">Realizar teste</span>
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
                                    </button>:
                                    <button className='btn btn-sm btn-success text-white' onClick={handleSubmit}>Submeter</button>
                                    }
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
                            :
                            <>
                            {['webm','mp4','mp3'].includes(active.type) ?
                            <ReactPlayer width="100%" height="400px" controls={true} url={active.file_path} />
                            : 
                            <iframe width="100%" height="400px" src={`data:application/pdf;base64,${active.file_path}`} title={active.name} frameborder="0"></iframe>
                            }
                            </>
                        }
                        </>
                        }
                    </div>
                    <div className={showSummary ? 'col-12 col-md-4' : 'col-12 d-none'}>
                        <div id='summry' className='pb-1'>
                            <span>Sumário</span>
                        </div>
                        <ul className='' id='lessions'>
                            {summary.map((value) => <li
                                id={value.id}
                                className={active?.id === value.id && !showQuiz && !showMarks? 'active' : ''}
                                onClick={() => showTopic(value)}
                                key={value.id}>{value.name}</li>
                            )}
                            <li 
                                onClick={handleShowQuiz}
                                className={showQuiz || showMarks? 'active' : ''}
                            >
                                {lession.status === 'Concluída' ? 'Visualizar Nota' : 'Realizar Teste'}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            }
        </>
    );
};

export default Lession;