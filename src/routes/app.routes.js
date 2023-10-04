import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Cursos from "../pages/dashboard/cursos";
import Curso from "../pages/dashboard/curso";
import Material from "../pages/dashboard/Material";
import Certificates from "../pages/dashboard/Certificates";
import Subject from "../pages/dashboard/Subject";
import Lession from "../pages/dashboard/Lession";
import Test from "../pages/dashboard/Test";

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Dashboard />}>
                {/* <Route exact path="/" element={<Cursos />} /> */}
                <Route path="/cursos" element={<Cursos />} />
                <Route path="/cursos/:idCourse" element={<Curso />} />
                <Route path="/cursos/subject/:idSubject" element={<Subject />} />
                <Route path="/cursos/subject/lession/:idLession" element={<Lession />} />
                <Route path="/cursos/subject/test/:idTest" element={<Test />} />

                <Route path="/material" element={<Material />} />
                <Route path="/certificados" element={<Certificates />} />
                <Route path="/perfil" element={<Cursos />} />
            </Route>
            <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
    </BrowserRouter>
)

export default AppRoutes;