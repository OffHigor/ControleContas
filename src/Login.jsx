import './Login.css'

const Logar = function (){
    return(
        <div className='BlocoLogin'>
        <img className='ImagemLogo' src="/src/assets/LogoControle.png" alt="" />
        <form action="" method="get">
            <div className='Control'>
  
                <div className='InputUsuario'>
                <label htmlFor="caracter">Usuario:</label>
                <input type="email" placeholder='Digite o Email do Usuario:' className='Inputs' />
                </div>
  
                <div className='InputUsuario'>
                <label htmlFor="caracter">Senha:</label>
                <input type="email" placeholder='Digite sua senha:' className='Inputs' />
                </div>
  
                <div className='EsqSenha'><a href="#">Esqueceu a senha?</a></div>
  
                <input id='BtnEntrar' type="button" value="Entrar"/>
            </div>
        </form>
          <input id='BtnRegistrar' type="button" value="Registrar"/>
              
      </div>
    )
}

export default Logar