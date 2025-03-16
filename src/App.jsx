import React from 'react'
import './App.css'
import {Navbar, BlocoReceitas, Transacoes} from './Receitas'


function Bloco(){
  return( 
    <div className='body'>
      <Navbar/>
  <div className='BlocoTabela'>
    <div className='Redirecionador'>
    <div className='Direcionador'>
    <BlocoReceitas nome="Saldo"  imagem="./src/assets/IconeDinheiro.png" /> 
    <BlocoReceitas nome="Receita" imagem="./src/assets/IconeGraficoSubindo.png"/>
    <BlocoReceitas nome="Despesa" imagem="./src/assets/IconeGraficoDescendo.png"/>
    </div>
    <Transacoes/>
    </div>
  </div>
  </div>
  )
}
export default Bloco