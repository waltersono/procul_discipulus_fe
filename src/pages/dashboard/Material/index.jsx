import React, { useState, useEffect, useContext } from 'react';
import { LayoutContext } from '../../../contexts/layout';
import Table from 'react-bootstrap/Table';

import './styles.css';

import Header from '../../../components/Header';

import api from '../../../services/api';

const Material = () => {
    const { setPageTitle } = useContext(LayoutContext);
    const [courses, setCourses] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        api.get('/students/courses')
            .then(response => {
                setCourses(response.data.courses);
            })
            .catch(error => {
                console.error(error.response)
            });

        setPageTitle('Material');
    }, [setPageTitle]);

    const handleCourseChange = event => {
        if (event.target.value !== '') {
            api.get(`/courses/${event.target.value}/subjects`)
                .then(response => {
                    console.log('handleCourseChange', response)
                    setSubjects(response.data.subjects);
                })
                .catch(error => {
                    console.error(error.response)
                });
        } else {
            setSubjects([]);
            setMaterials([]);
        }
    };

    const handleSubjectChange = event => {
        if (event.target.value !== '') {
            api.get(`/subjects/${event.target.value}/material`)
                .then(response => {
                    console.log('handleSubjectChange', response.data)
                    setMaterials(response.data.materials);
                })
                .catch(error => {
                    console.error(error.response)
                });
        } else {
            setMaterials([]);
        }
    };

    return (
        <>
            <Header />
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-12 col-md-5">
                        <div id='summry' className='pb-1 mb-2'>
                            <span>Pesquisar Material</span>
                        </div>
                        <form autoComplete="off" className="row">
                            <div className="form-group mb-3">
                                <select
                                    className="form-select"
                                    aria-label="Selecione o curso"
                                    data-live-search="true"
                                    onChange={handleCourseChange}
                                >
                                    <option value="">Selecione o curso</option>
                                    {courses.map((value, index) => (
                                        <option value={value.id} key={index}>{value.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <select
                                    className="form-select"
                                    aria-label="Selecione a disciplina"
                                    data-live-search="true"
                                    disabled={subjects.length === 0}
                                    onChange={handleSubjectChange}
                                >
                                    <option value="">Selecione a disciplina</option>
                                    {subjects.map((value, index) => (
                                        <option value={value.id} key={index}>{value.name}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="col-12 col-md-7">
                        <div id="nav-header">
                            <Table responsive="sm" className='text-nowrap'>
                                <thead>
                                    <tr className='header-table'>
                                        <th style={{ fontWeight: 600 }}>Material</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Ficheiro</th>
                                        <th className='text-center' style={{ fontWeight: 600 }}>Acção</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(materials.length > 0) ? (materials.map((value, index) => <tr key={index}>
                                        <td className='w-100'>{value.name}</td>
                                        <td className='text-center'>{value.type}</td>
                                        <td className='text-center'>{value.id}</td>
                                    </tr>)) : (<tr><td colSpan={3} className='text-center text-danger'>Nenhum material encontrado!</td></tr>)}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Material;