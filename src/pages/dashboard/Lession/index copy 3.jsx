import React, { useState, useEffect } from 'react';
import { /*useNavigate,*/ useParams } from 'react-router-dom';
import FileViewer from 'react-file-viewer';
import './styles.css';
import api, { apiUrl } from '../../../services/api';
import Header from '../../../components/Header';
import HeaderSubject from '../../../components/HeaderSubject';

const Question = ({ question, index }) => {
    return (
        <div id='quiz'>
            <p className='question mb-1'>{++index}. {question.question}</p>
            <div className="form-check">
                <input className="form-check-input" type="radio" name={`quizOption${question.id}`} id={`flexRadioDefault${question.id}1`} />
                <label className="form-check-label" htmlFor={`flexRadioDefault${question.id}1`}>{question.optionA}</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name={`quizOption${question.id}`} id={`flexRadioDefault${question.id}2`} />
                <label className="form-check-label" htmlFor={`flexRadioDefault${question.id}2`}>{question.optionB}</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name={`quizOption${question.id}`} id={`flexRadioDefault${question.id}3`} />
                <label className="form-check-label" htmlFor={`flexRadioDefault${question.id}3`}>{question.optionC}</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name={`quizOption${question.id}`} id={`flexRadioDefault${question.id}4`} />
                <label className="form-check-label" htmlFor={`flexRadioDefault${question.id}4`}>{question.optionD}</label>
            </div>
        </div>
    );
}

const Lession = () => {

    // const navigation = useNavigate();
    const { idLession } = useParams();
    
    const [lastTopic, setLastTopic] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [subject, setSubject] = useState(null);
    const [lession, setLession] = useState(null);
    const [active, setActive] = useState(null);
    const [summary, setSummary] = useState([]);
    const [quiz, setQuiz] = useState([]);
    
    useEffect(() => {
        api.get(`/students/lessions/${idLession}`)
        .then(response => {
            console.log('Lession Response', response);
            setSubject(response.data.subject);
            setActive(response.data.lession.summary[0]);
            setLession(response.data.lession);
            setSummary(response.data.lession.summary);
            setQuiz(response.data.quiz);
            setLastTopic(response.data.lession.summary[response.data.lession.summary.length-1]);
            
        })
        .catch(error => {
            console.error(error.response.data);
        });
    }, [idLession]);
    
    const showTopic = (currentTopic) => {
        for (let i = 0; i < summary.length; i++) {
            if (summary[i].id === currentTopic.id) {
                setActive(currentTopic);
            }
        } 
        if (lastTopic.id === lession.id) {
            setShowQuiz(true);
        } else {
            setShowQuiz(false);
        }
    }
    
    const endLession = (lession) => {
        api.post('/students/lessions/end', { lession_id: lession.id })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error.response);
        });
    }

    // const file = 'https://www.youtube.com/watch?v=PN4dBJvvKYs';
    // const type = 'mp4';
    // const file = 'http://localhost:8000/storage/uploads/lessions/1/summay/2/aula_01.pdf';
    // const type = 'pdf';    

    return (
        <>
        <Header />
        {!lession && !active ? <h1>Loading...</h1> :
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12 col-md-8">
                    <HeaderSubject subject={subject} />
                    <div id='title-box'>
                        <span className='title'>{lession?.name}</span>
                    </div>
                    {showQuiz ?
                        <div className="pt-2">
                            <div className='d-flex justify-content-between align-items-center' id='quiz_header'>
                                <span className="">Realizar teste</span>
                                <button className='btn btn-sm btn-success' onClick={() => endLession(lession)}>Submeter</button>
                            </div>
                            <div className={'quizView'}>
                                <div>{quiz.map((value, index) => <div key={index}> <Question question={value} index={index} /></div>)}</div>
                            </div>
                        </div>
                        :
                        <FileViewer
                            filePath={'http://localhost:8000/storage/uploads/university/photo/ujc.png'}
                            fileType={'png'}
                            className={'documentView'}
                            // errorComponent={CustomErrorComponent}
                            // onError={this.onError}
                        />
                    }
                </div>
                <div className="col-12 col-md-4">
                    <div id='summry' className='pb-1'>
                        <span>Sumário</span>
                    </div>
                    <ul className='' id='lessions'>
                        {summary.map((value) => <li
                            id={value.id}
                            className={active?.id === value.id ? 'active': ''}
                            onClick={() => showTopic(value)}
                            key={value.id}>{value.name}</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>}
        </>
    );
};

export default Lession;