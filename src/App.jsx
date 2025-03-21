import React from 'react'
import './App.css'
import {Navbar, BlocoReceitas, Transacoes} from './Receitas'
import {Logar} from './Login'


function Bloco(){
  return( 
    <div className='TelaInicial'>
      <div className='BlocoLogin'>
        <img className='ImagemLogo' src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fbr.freepik.com%2Ficones%2Fdinheiro&psig=AOvVaw03IDGS9HvVDwep49ERC0jM&ust=1742641521395000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMDH8OWDm4wDFQAAAAAdAAAAABAE" alt="" />
        <form action="" method="get">
        <div className='InputUsuario'>
          <label htmlFor="caracter">Usuario:</label>
          <input type="email" placeholder='Digite o Email do Usuario' className='Inputs' />
        </div>
        <div className='InputUsuario'>
          <label htmlFor="caracter">Senha:</label>
          <input type="email" placeholder='Digite o Email do Usuario' className='Inputs' />
        </div>
        <div className='EsqSenha'><a href="#">Esqueceu a senha?</a></div>

        <input type="button" value="Entrar"/>
        </form>
        <a href="#"><input type="button" value="Registrar"/></a>
      </div>
    </div>
  )
}
export default Bloco