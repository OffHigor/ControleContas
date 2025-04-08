import React from 'react';
import './cadastro.css';


const Cadastro = function (){
    return(
    <div className='BlocoCadastro'>
        <form action="../Banco.cjs" method="POST">
            <div className='Controle'>
  
                <div className='InputUsuario2'>
                <label htmlFor="caracter">Digite seu nome:</label>
                <input id='nome' type="text" placeholder='Nome' className='Inputs' />
                </div>

                <div className='InputUsuario2'>
                <label htmlFor="caracter">Digite o Email:</label>
                <input id='email' type="email" placeholder='name@example.com' className='Inputs' />
                </div>

                <div className='InputUsuario2'>
                <label htmlFor="caracter">Digite o nome do Usuario:</label>
                <input id='usuario' type="text" placeholder='Higorwz' className='Inputs' />
                </div>

                <div className='InputUsuario2'>
                <label htmlFor="caracter">Insira a data de Nascimento</label>
                <input id='data' type="date" className='Inputs' />
                </div>

  
                <div className='InputUsuario2'>
                <label htmlFor="caracter">Senha:</label>
                <input id='senha' type="password" placeholder='Digite sua senha:' className='Inputs' />
                </div>
  
                <button type='submit' id='BtnEntrar' value="Cadastrar">Cadastrar</button>
            </div>
        </form>
              
    </div>
  )
}

export default Cadastro