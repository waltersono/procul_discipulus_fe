import React, { useState, useEffect, useContext } from 'react';
import { LayoutContext } from '../../../contexts/layout';
import Table from 'react-bootstrap/Table';

import './styles.css';
import { Image, Spinner } from "react-bootstrap";
import Header from '../../../components/Header';

import api, { apiUrl } from '../../../services/api';

const Certificates = () => {
    const [loading, setLoading] = useState(false);
    const { setPageTitle } = useContext(LayoutContext);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filter, setFilter] = useState('courses');
    useEffect(() => {
        setPageTitle('Certificados');
    }, [setPageTitle]);

    const handleTypeChange = event => {
        const type = event.target.value;
        if (type !== '') {
            console.log('type', type)
            api.get(`/students/${type}/certificates`)
                .then(response => {
                    console.log('handleTypeChange', response.data)
                    if (type === 'subjects') {
                        setSubjects(response.data.subjects);
                    } else {
                        setCourses(response.data.courses);
                    }
                    setFilter(event.target.value);
                })
                .catch(error => {
                    console.error(error.response)
                });
        } else {
            setSubjects([]);
            setCourses([]);
        }
    };

    const handleDownloadSubjectCertificate = (subjectId) => {
        setLoading(true);
        api.post("students/certificates/generate", { subject_id: subjectId })
            .then(response => {
                console.log(response);

                const certificateBase64 = response.data.certificate;
                const downloadLink = document.createElement('a');
                downloadLink.href = `data:application/pdf;base64,${certificateBase64}`;
                downloadLink.download = 'certificado.pdf';
                downloadLink.target = '_blank';
                downloadLink.click();

            })
            .catch(error => {
                console.error(error.response.data);
            })
            .finally(() => setLoading(false));
    };

    const handleDownloadCourseCertificate = (courseId) => {
        setLoading(true);
        api.post("students/certificates/generate", { course_id: courseId })
            .then(response => {
                console.log(response);
                const certificateBase64 = response.data.certificate;
                const downloadLink = document.createElement('a');
                downloadLink.href = `data:application/pdf;base64,${certificateBase64}`;
                downloadLink.download = 'certificado.pdf';
                downloadLink.target = '_blank';
                downloadLink.click();

            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => setLoading(false));
    };
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
                                                {loading ?
                                                    <button type="button" className="btn btn-sm btn-success" disabled={true}>
                                                        <Spinner
                                                            as="span"
                                                            variant="white"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            animation="grow"
                                                        />
                                                    </button> :
                                                    <button className='btn btn-sm btn-success' onClick={() => handleDownloadCourseCertificate(course.id)}>
                                                        Baixar
                                                    </button>
                                                }
                                            </td>
                                        </tr>)) : (<tr><td className='text-center text-danger' colSpan={4}>Nenhum Certificado encontrada!</td></tr>)}
                                    </tbody>
                                </Table> :
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
                                                {loading ?
                                                    <button type="button" className="btn btn-sm btn-success" disabled={true}>
                                                        <Spinner
                                                            as="span"
                                                            variant="white"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            animation="grow"
                                                        />
                                                    </button> :
                                                    <button className='btn btn-sm btn-success' onClick={() => handleDownloadSubjectCertificate(subject.id)}>
                                                        Baixar
                                                    </button>
                                                }
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

export default Certificates;