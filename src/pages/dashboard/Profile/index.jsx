import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutContext } from '../../../contexts/layout';
import Table from 'react-bootstrap/Table';

import './styles.css';

import Header from '../../../components/Header';

import api, { apiUrl } from '../../../services/api';

const Profile = () => {

    const navigation = useNavigate();
    const { setPageTitle } = useContext(LayoutContext);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filter, setFilter] = useState('courses');
    useEffect(() => {
        setPageTitle('Certificados');
    }, []);
    
    return (
        <>
            <Header />
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-12 col-md-3">
                        <div id='summry' className='pb-1 mb-2'>
                            <span>Pesquisar Certificados</span>
                        </div>
                        <form autoComplete="off" className="row">
                            <div className="form-group mb-3">
                                <select
                                    className="form-select"
                                    aria-label="Pesquisar Certificados"
                                    data-live-search="true"
                                    onChange={handleTypeChange}
                                >
                                    <option value="" disabled>Selecionar certificados</option>
                                    <option value="courses">Certificados de Cursos</option>
                                    <option value="subjects">Certificados de Disciplinas</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="col-12">
                        <div id="nav-header">
                            {filter === 'courses' ? 
                            <Table responsive="sm" className='text-nowrap'>
                                <thead>
                                    <tr className='header-table'>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Escola</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Curso</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Média</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Acção</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(courses.length > 0) ? (courses.map((course, index) => <tr key={index}>
                                        <td className='text-center'><img src={`${apiUrl}/${course.school.photo}`} alt='Escola' className='school-photo' /></td>
                                        <td className='text-center'>{course.course}</td>
                                        <td className='text-center'>{course.media}</td>
                                        <td className='text-center'>
                                            <button className='btn btn-sm btn-success' onClick={handleDownloadCourseCertificate}>
                                                Baixar
                                            </button>
                                        </td>
                                    </tr>)) : (<tr><td className='text-center text-danger' colSpan={4}>Nenhum Certificado encontrada!</td></tr>)}
                                </tbody>
                            </Table>:
                            <Table responsive="sm" className='text-nowrap'>
                                <thead>
                                    <tr className='header-table'>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Escola</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Curso</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Disciplina</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Média</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Acção</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(subjects.length > 0) ? (subjects.map((subject, index) => <tr key={index}>
                                        <td className='text-center'><img src={`${apiUrl}/${subject.school.photo}`} alt='Escola' className='school-photo' /></td>
                                        <td className='text-center'>{subject.course}</td>
                                        <td className='text-center'>{subject.subject}</td>
                                        <td className='text-center'>{subject.media.media}</td>
                                        <td className='text-center'>
                                            <button className='btn btn-sm btn-success' onClick={() => handleDownloadSubjectCertificate(subject.id)}>
                                                Baixar
                                            </button>
                                        </td>
                                    </tr>)) : (<tr><td className='text-center text-danger' colSpan={5}>Nenhum Certificado encontrado!</td></tr>)}
                                </tbody>
                            </Table>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;