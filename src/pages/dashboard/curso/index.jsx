import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutContext } from '../../../contexts/layout';
import { AiOutlineMonitor, AiOutlineCheck } from 'react-icons/ai';
import Table from 'react-bootstrap/Table';
import { Tab, Tabs } from 'react-bootstrap';
import './styles.css';

import Header from '../../../components/Header';
import HeaderCurso from '../../../components/HeaderCurso';

import api from '../../../services/api';

const Curso = () => {

    const navigation = useNavigate();
    const { idCourse } = useParams();
    const { setPageTitle } = useContext(LayoutContext);
    const [course, setCourse] = useState(null);

    useEffect(() => {
        api.get(`/courses/${idCourse}`)
        .then(response => {
            const data = {
                id: response.data.course.id,
                name: response.data.course.name,
                degree: response.data.course.degree,
                duration: response.data.course.duration,
                university: response.data.course.university,
                skills: response.data.course.skills  || [],
                description: response.data.course.description,
                subjects: response.data.course.subjects  || [],
                requirements: response.data.course.requirements  || [],
            }
            setCourse(data);
            setPageTitle(`Curso de ${data.name}`);
        })
        .catch(error => {
            console.error(error.response.data)
        });
    }, [idCourse,setPageTitle]);
    
    return (
        <>
            <Header />
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-12">
                        <HeaderCurso course={course}/>
                    </div>
                </div>
                <div id="nav-header">
                    <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
                        <Tab eventKey="general" title="Geral" className='pt-3'>
                            <p className='my-1'>Em geral, {course?.description}.</p>
                            <span className='' style={{fontWeight: 600}}>Requisitos de acesso</span>
                            <ul className='objectives-list'>
                                {(course?.requirements.length > 0) ? (course.requirements.map((value, index) => <li key={index}><span><AiOutlineCheck /> {value.name}</span></li>)) : (<li>No skills found.</li>)}
                            </ul>
                            <span className='' style={{fontWeight: 600}}>Perfis ocupacionais</span>
                            <p className='mb-1'>{course?.skills_description}</p>
                            <ul className='objectives-list'>
                                {(course?.skills.length > 0) ? (course.skills.map((value, index) => <li key={index}><span><AiOutlineCheck /> {value.name}</span></li>)) : (<li>No skills found.</li>)}
                            </ul>
                        </Tab>
                        <Tab eventKey="subjects" title="Disciplinas" className='pt-3'>
                            <div className='row'>
                                <div className='col-12 col-md-8'>
                                    <span className="" style={{fontWeight: 600}}>Plano de Estudos do Curso de Filosofia</span>
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
                                        <th className='text-center' style={{fontWeight: 600}}>Ano</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Semestre</th>
                                        <th style={{fontWeight: 600}}>Disciplina ou Módulo</th>
                                        <th style={{fontWeight: 600}}>Tipo</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Horas</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Créditos</th>
                                        <th className='text-center' style={{fontWeight: 600}}>Acção</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(course?.subjects.length > 0) ? (course.subjects.map((subject, index) => <tr key={index}>
                                        <td className='text-center'>{subject.level}º</td>
                                        <td className='text-center'>{subject.semester}</td>
                                        <td>{subject.name}</td>
                                        <td>{subject.type}</td>
                                        <td className='text-center'>{subject.time}</td>
                                        <td className='text-center'>{subject.credits}</td>
                                        <td className='text-center'>
                                            {subject && <button className='btn btn-sm btn-success' onClick={() => navigation(`/cursos/subject/${subject.id}`)}>visualizar</button>}
                                        </td>
                                    </tr>)) : (<tr><td className='text-center text-danger' colSpan={7}>Nenhuma disciplina encontrada!</td></tr>)}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default Curso;