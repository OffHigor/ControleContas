import React from 'react';
import './cadastro.css';


const Cadastro = function (){
    return(
    <div className='BlocoCadastro'>
        <form action="" method="get">
            <div className='Controle'>
  
                <div className='InputUsuario'>
                <label htmlFor="caracter">Digite seu nome:</label>
                <input type="text" placeholder='Nome' className='Inputs' />
                </div>

                <div className='InputUsuario'>
                <label htmlFor="caracter">Digite o Email:</label>
                <input type="email" placeholder='name@example.com' className='Inputs' />
                </div>

                <div className='InputUsuario'>
                <label htmlFor="caracter">Digite o nome do Usuario:</label>
                <input type="text" placeholder='Higorwz' className='Inputs' />
                </div>

                <div className='InputUsuario'>
                <label htmlFor="caracter">Insira a data de Nascimento</label>
                <input type="date" className='Inputs' />
                </div>

  
                <div className='InputUsuario'>
                <label htmlFor="caracter">Senha:</label>
                <input type="password" placeholder='Digite sua senha:' className='Inputs' />
                </div>
  
  
                <input id='BtnEntrar' type="button" value="Entrar"/>
            </div>
        </form>
              
    </div>
  )
}

export default Cadastro