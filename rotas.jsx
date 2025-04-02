import React from "react";
import Logar from "./src/Login";
import Cadastro from "./src/cadastro";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Rotas = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Logar/>}></Route>
                <Route path="/cadastro" element={<Cadastro/>}></Route>
            </Routes>
        </Router>
    )
}
export default Rotas