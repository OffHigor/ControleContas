import React from 'react'
import './App.css'
import { BlocoReceitas, Transacoes} from './Receitas'


function Bloco(){
  return( <div className='BlocoTabela'>
    <div className='Redirecionador'>
    <div className='Direcionador'>
    <BlocoReceitas nome="Saldo" imagem="./src/assets/react.svg" /> 
    <BlocoReceitas nome="Receita" imagem="./public/vite.svg"/>
    <BlocoReceitas nome="Despesa" imagem="./public/vite.svg"/>
    </div>
    <Transacoes/>
    </div>
  </div>
  )
}
export default Bloco