import React from 'react';
import './styles.css';
import { apiUrl } from '../../services/api';
const HeaderCurso = ({course}) => {
    console.log('course',course)
    return (
        <div className='course-header p-0'>
            <div className="ps-2 course">
                <img src={`${apiUrl}/${course?.university.photo}`} alt="Universidade" className='university' />
                <div className='course-description text-nowrap px-2 py-1'>
                    <span className='name'>Curso de {course?.name}</span>
                    <span className='d-none d-md-inline'>{course?.university.name}</span>
                    <span className='d-inline d-md-none'>Instrituição: {course?.university.acronym}</span>
                    <span className=''>Grau conferido: {course?.degree}</span>
                    <span className=''>Duração: {course?.duration}</span>
                </div>
            </div>
            <div className='progress-box'>
                <div>
                    <span id='progress-label'>Progresso</span>
                    <div id='progress-bar'>
                        <div id='progress-bar-content'></div>
                    </div>
                </div>
                <button>Certificado</button>
            </div>
        </div>
    );
}
export default HeaderCurso;