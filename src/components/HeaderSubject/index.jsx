import React from 'react';
import './styles.css';
import { apiUrl } from '../../services/api';
const HeaderSubject = ({subject}) => {
    return (
        <div className='course-header p-0'>
            <div className="ps-2 course">
                <img src={`${apiUrl}/${subject?.university}`} alt="Universidade" className='university' />
                <div className='course-description text-nowrap px-2 py-1'>
                    <span className='name'>{subject?.name}</span>
                    <span className=''>Tipo de Disciplina: {subject?.type}</span>
                    <span className=''>Carga Horária: {subject?.time} horas</span>
                    <span className=''>Créditos: {subject?.credits}</span>
                </div>
            </div>
        </div>
    );
}
export default HeaderSubject;