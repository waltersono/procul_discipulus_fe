import React, { createContext, useState } from 'react';

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [isShow, setIsShow] = useState(false);
    const showProfile = () => setIsShow(!isShow);
    const [pageTitle, setPageTitle] = useState('');
    
    return (
        <LayoutContext.Provider
            value={{ isOpen, isShow, showProfile, toggle, pageTitle, setPageTitle }}
        >
            {children}
        </LayoutContext.Provider>
    );
}
export { LayoutContext, LayoutProvider }