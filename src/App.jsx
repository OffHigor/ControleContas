import './Receitas.jsx'
import './App.css'
import BlocoReceitas from './Receitas.jsx'


function Bloco(){
  return( <div className='BlocoTabela'>
    <div className='Direcionador'>
    <BlocoReceitas nome="Saldo" imagem="./src/assets/react.svg" /> 
    <BlocoReceitas nome="Receita" imagem="./public/vite.svg"/>
    <BlocoReceitas nome="Despesa" imagem="./public/vite.svg"/>

    </div>
  </div>
  )
}
export default Bloco