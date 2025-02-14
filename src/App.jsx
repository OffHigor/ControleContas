import './Receitas.jsx'
import './App.css'
import BlocoReceitas from './Receitas.jsx'

function Bloco(){
  return( <div className='BlocoTabela'>
    <div className='Direcionador'>
    <BlocoReceitas nome="Saldo" imagem="https://cdn-icons-png.flaticon.com/512/2534/2534191.png"/>
    <BlocoReceitas nome="Receita"/>
    <BlocoReceitas nome="Despesa"/>

    </div>
  </div>
  )
}
export default Bloco