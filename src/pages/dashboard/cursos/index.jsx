import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutContext } from '../../../contexts/layout';
import { AiOutlineMonitor, AiOutlineCheck } from 'react-icons/ai';
import pictureCourse from '../../../assets/images/procul.jpg';
import Header from '../../../components/Header';
import api, { apiUrl } from '../../../services/api';
import './styles.css';
import { Spinner } from "react-bootstrap";

const Cursos = () => {
    const navigate = useNavigate();
    const { setPageTitle } = useContext(LayoutContext);
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState(null);

    setPageTitle('Cursos');

    useEffect(() => {
        api.get('/students/courses')
            .then(response => {
                console.log(response.data.courses);
                setCourses(response.data.courses);
                handleActive(response.data.courses[0].id);
            })
            .catch(error => {
                console.error(error.response);
            });
    }, []);

    const handleActive = (id) => {
        api.get(`/courses/${id}`)
            .then(response => {
                const data = {
                    id: response.data.course.id,
                    name: response.data.course.name,
                    degree: response.data.course.degree,
                    skills: response.data.course.skills || [],
                    description: response.data.course.description,
                }
                setCourse(data);
            })
            .catch(error => {
                console.error(error.response);
            });
    };

    return (
        <>
            <Header />
            <div className='container-fluid mt-3'>
                <div className='row'>
                    <div className='col-12 col-md-7'>
                        <div className='row'>
                            <div className='col-12 col-md-6'>
                                <div className='filter-link mb-2'>
                                    <Link to='' className='item active'>Todos</Link>
                                    <Link to='' className='item'>Activos</Link>
                                    <Link to='' className='item'>Terminados</Link>
                                </div>
                            </div>
                            <div className='col-12 col-md-6'>
                                <div className='filter-search mb-2'>
                                    <input type='search' name='' id='' placeholder='Pesquisar' />
                                    <AiOutlineMonitor />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            {courses.map((value, index) => (
                                <div className='col-12 col-md-6 course' key={index} onClick={() => handleActive(value.id)}>
                                    <img src={`${apiUrl}/${value.university}`} alt='Universidade' className='university' />
                                    <div className='course-description'>
                                        <span className='name'>{value.name}</span>
                                        <span className='degree'>{value.degree}</span>
                                        <small className='duration'>Duração: {value.duration}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='col-12 col-md-5'>
                        <div className='view-course'>
                            <div className="d-flex flex-column">
                                <img src={pictureCourse} className='mx-auto' alt='Foto do Curso' width={'85%'} />
                                {/* <img src={simbolo} alt='Foto do Curso' width={'100%'} /> */}
                                {/* <img src={tipografia} alt='Foto do Curso' width={'100%'} /> */}
                                <span className='name text-center'>Curso de {course?.degree} em {course?.name}</span>
                            </div>
                            <div className='legend'>
                                {!course ?
                                    <button type="button" className="" disabled={true}>
                                        <Spinner
                                            as="span"
                                            variant="white"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            animation="grow"
                                        />
                                    </button> : <button onClick={() => navigate(`/cursos/${course.id}`)}>Ver Curso</button>
                                }
                            </div>
                            <div className='description'><p>{course?.description}</p></div>
                            <span className='name'>Objectivo do Curso e Perfis ocupacionais</span>
                            <ul className='objectives-list'>
                                {(course?.skills.length > 0) ? (course?.skills.map((value, index) => <li key={index}><span><AiOutlineCheck /> {value.name}</span></li>)) : (<li>No skills found.</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cursos;