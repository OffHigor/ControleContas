import React from 'react';
import './App.css';
import Rotas from "../rotas"
import {Navbar, BlocoReceitas, Transacoes} from './Receitas';




function Bloco(){
  return( 
  <div className='TelaInicial'>
      <Rotas/>
  </div>
  )
}
export default Bloco