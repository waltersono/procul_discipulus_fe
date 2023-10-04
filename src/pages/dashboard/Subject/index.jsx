import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AiOutlineMonitor, AiOutlineCheck } from 'react-icons/ai';

import Table from 'react-bootstrap/Table';
import { Tab, Tabs } from 'react-bootstrap';
import './styles.css';

import Header from '../../../components/Header';
import HeaderSubject from '../../../components/HeaderSubject';

import api from '../../../services/api';

const Subject = () => {

    const navigation = useNavigate();
    const { idSubject } = useParams();
    
    const [subject, setSubject] = useState(null);
    const [lessions, setLessions] = useState([]);
    const [testes, setTestes] = useState([]);
    const [totalTime, setTotalTime] = useState(0);
    const [media, setMedia] = useState(0);
    const [status, setStatus] = useState('');
    const [statusText, setStatusText] = useState('');
    
    useEffect(() => {
        api.get(`/subjects/${idSubject}`)
        .then(response => {
            const data = {
                id: response.data.id,
                name: response.data.name,
                time: response.data.time,
                type: response.data.type,
                level: response.data.level,
                credits: response.data.credits,
                semester: response.data.semester,
                university: response.data.university,
                lessions: response.data.lessions || [],
                thematics: response.data.thematics || [],
                objectives: response.data.objectives || [],
            }
            setSubject(data);
            // setCourse(response.data.course);
            const sum = response.data.thematics.reduce((soma, thematic) => soma + thematic.time, 0);
            setTotalTime(sum);
        })
        .catch(error => {
            console.error(error.response.data)
        });

        api.get(`/students/subjects/${idSubject}/lessions`)
        .then(response => {
            setLessions(response.data.lessions);
        })
        .catch(error => {
            console.error(error.response.data)
        });

        api.get(`/students/subjects/${idSubject}/tests`)
        .then(response => {
            console.log(response.data)
            setTestes(response.data.testes);
            setMedia(response.data.results.media)
            setStatus(response.data.results.status)
            if(response.data.results.status === 'Aprovado Recorrência'){
                setStatusText('Aprovado')
            }else if(response.data.results.status === 'Reprovado Recorrência'){
                setStatusText('Reprovado')
            }else{
                setStatusText(response.data.results.status)
            }
        })
        .catch(error => {
            console.error(error.response.data)
        });
        
    }, [idSubject]);

    const handleLession = (lession) => {
        if(lession.status === 'Iniciar Aula'){
            api.post('/students/lessions/start',{lession_id: lession.id})
            .then(response => {
                navigation(`/cursos/subject/lession/${response.data.id}`);
            })
            .catch(error => {
                console.error(error.response);
            });
        }else {
            navigation(`/cursos/subject/lession/${lession.id}`);
        }
    };

    const handleTeste = (teste) => {
        if(teste.status === null){
            console.log('Heeee',teste)
            api.post('/students/tests/start',{teste_id: teste.id})
            .then(response => {
                console.log('/students/tests/start', response.data)
                navigation(`/cursos/subject/test/${response.data.id}`);
            })
            .catch(error => {
                console.error(error.response);
            });
        }else{            
            navigation(`/cursos/subject/test/${teste.id}`);
            console.log('yoooooo',teste)
        }
    }
    
    return (
        <>
            <Header />
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-12">
                        <HeaderSubject subject={subject}/>
                    </div>
                </div>
                <div id="nav-header">
                    <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
                        <Tab eventKey="general" title="Geral" className='pt-3'>
                            <span className='' style={{fontWeight: 600}}>I. Objectivos da Cadeira</span>
                            <ul className='objectives-list'>
                                {(subject?.objectives.length > 0) ? (subject.objectives.map((value, index) => <li key={index}><span><AiOutlineCheck /> {value.name}</span></li>)):(<li className='text-danger'>Objectivos não definidos!</li>)}
                            </ul>
                            <span className='' style={{fontWeight: 600}}>II. Unidades Temáticas</span>
                            <Table responsive="sm" className='text-nowrap'>
                                <thead>
                                    <tr className='header-table'>
                                        <th style={{fontWeight: 600}}>Tema</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Carga Horária</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(subject?.thematics.length > 0) ? (subject.thematics.map((value, index) => 
                                        <tr key={index}>
                                            <td className='w-100'>{value.name}</td>
                                            <td className='text-center'>{value.time} h</td>
                                        </tr>
                                    )):(<tr><td colSpan={2} className='text-center text-danger'>Nenhum tema encontrado!</td></tr>)}
                                    <tr className='footer-table'><td colSpan={2} className='w-100 p-0'></td></tr>
                                    <tr className='footer-table'>
                                        <td className='w-100'><span style={{fontWeight: 600}}>Total de Horas</span></td>
                                        <td className='text-center'><span style={{fontWeight: 600}}>{totalTime} Hrs</span></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey="subjects" title="Aulas" className='pt-3'>
                            <div className='row'>
                                <div className='col-12 col-md-8'>
                                    <span className="name">Plano Analítico</span>
                                </div>
                                <div className='col-12 col-md-4'>
                                    <div className='filter-search mb-2'>
                                        <input type='search' name='' id='' placeholder='Pesquisar' />
                                        <AiOutlineMonitor />
                                    </div>
                                </div>
                            </div>
                            <Table responsive="sm" className='text-nowrap'>
                                <thead>
                                    <tr className='header-table'>
                                        <th style={{fontWeight: 600}}>Tema</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Estado</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Acção</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(lessions.length > 0) ? (lessions.map((value, index) => 
                                        <tr key={index}>
                                            <td className='w-100'>{value.name}</td>
                                            <td className='text-center'>{value.status === 'Iniciar Aula' ? 'Dísponivel' : value.status}</td>
                                            <td className='text-center'>
                                                {value.status !== 'Indísponivel' ?
                                                    <button 
                                                        className={value.status === 'Concluída' ? 'btn btn-sm btn-success' : 'btn btn-sm btn-primary bg_primary'} 
                                                        onClick={() => handleLession(value)}
                                                    >
                                                        {value.status === 'Concluída' ? 'Visualizar' : value.status === 'Em Progresso' ? 'Continuar':'Iniciar Aula'}
                                                    </button> 
                                                    : 
                                                    <button className='btn btn-sm btn-outline-dark' disabled>Pendente</button>
                                                }
                                            </td>
                                        </tr>
                                    )):(<tr><td colSpan={3} className='text-center text-danger'>Nenhuma aula encontrada!</td></tr>)}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey="tests" title="Avaliações" className='pt-3'>
                            <div className='row'>
                                <div className='col-12 col-md-8'>
                                    {/* <span className="name">Avaliações</span> */}
                                </div>
                                <div className='col-12 col-md-4'>
                                    <div className='filter-search mb-2'>
                                        <input type='search' name='' id='' placeholder='Pesquisar' />
                                        <AiOutlineMonitor />
                                    </div>
                                </div>
                            </div>
                            <Table responsive="sm" className='text-nowrap'>
                                <thead>
                                    <tr className='header-table' id='avaliacao'>
                                        <th style={{fontWeight: 600}}>Avaliação</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Duração</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Nota</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Acção</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {(testes.length > 0) ? (testes.map((value, index) => 
                                    <>{((status === 'Dispensado' || status === 'Excluído') && (value.name === 'Exame Normal' || value.name === 'Exame de Recorrência')) ? '' :
                                    <>{((status === 'Admitido' && value.name === 'Exame de Recorrência') || (status === 'Aprovado' && value.name === 'Exame de Recorrência')) ? '':
                                    <tr key={index}>
                                        <td className=''>{value.name}</td>
                                        <td className='text-center'>{value.date}</td>
                                        <td className={value.marks < 10 ? 'text-danger text-center':value.marks >= 14 ? 'text-success text-center':'text-dark text-center'}>{value.marks}</td>
                                        <td className='text-center'>
                                            {value.status !== 'Indísponivel' ?
                                                <>{(value.name === 'Exame Normal' || value.name === 'Exame de Recorrência') ? 
                                                    <>
                                                        {(status === 'Dispensado' || status === 'Excluído') ? ''
                                                        :
                                                        <>
                                                        {(status === 'Admitido' && value.name === 'Exame de Recorrência') || (status === 'Aprovado' && value.name === 'Exame de Recorrência')? '':
                                                        <button 
                                                            className={(value.status === 'Concluída') ? 'btn btn-sm btn-success' : 'btn btn-sm btn-primary bg_primary'} 
                                                            onClick={() => handleTeste(value)}
                                                        >
                                                            {(value.status === 'Concluída') ? 'Visualizar' : value.status === 'Em Progresso' ? 'Continuar':'Iniciar Avaliação'}
                                                        </button>}

                                                        </>}
                                                    </>
                                                    :
                                                    <button 
                                                        className={(value.status === 'Concluída') ? 'btn btn-sm btn-success' : 'btn btn-sm btn-primary bg_primary'} 
                                                        onClick={() => handleTeste(value)}
                                                    >
                                                        {(value.status === 'Concluída') ? 'Visualizar' : value.status === 'Em Progresso' ? 'Continuar':'Iniciar Avaliação'}
                                                    </button>
                                                }</>
                                                // <button 
                                                //     className={value.status === 'Concluída' ? 'btn btn-sm btn-success' : 'btn btn-sm btn-primary bg_primary'} 
                                                //     onClick={() => handleTeste(value)}
                                                // >
                                                //     {value.status === 'Concluída' ? 'Visualizar' : value.status === 'Em Progresso' ? 'Continuar':'Iniciar Avaliação'}
                                                // </button> 
                                                : 
                                                <button className='btn btn-sm btn-outline-danger' disabled>Indísponivel</button>
                                            }
                                        </td>
                                    </tr>
                                    }</>
                                    }</>
                                )):(<tr><td colSpan={4} className='text-center text-danger'>Nenhuma avaliação encontrada!</td></tr>)}
                                    <tr className='footer-table'><td colSpan={4} className='w-100 p-0'></td></tr>
                                    <tr className='footer-table'>
                                        <td colSpan={2} className='text-center'><span style={{fontWeight: 600}}>Média Final</span></td>
                                        <td className={(statusText === 'Reprovado' || statusText === 'Excluído') ? 'text-danger text-center':'text-success text-center'}><span style={{fontWeight: 600}}>{media}</span></td>
                                        <td className={(statusText === 'Reprovado' || statusText === 'Excluído') ? 'text-danger text-center':'text-success text-center'}><span style={{fontWeight: 600}}>{statusText}</span></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default Subject;