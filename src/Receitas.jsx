import './Receitas.css'
const Navbar = function(){
    return(
        <div className='Navbar'>
            <a href="">Home</a>
            <a href="">Extrato</a>
        </div>
    )
}
const BlocoReceitas = function({nome, imagem}) {
    return(
        <div className='BlocoReceitas'>
            <div className='Direcao'>
        <p className='tt'>{nome}</p>
        <p className='tt'>R$  200,00</p>
            </div>
        <img className='ImagemI' src={imagem} alt="" />
        </div>
    )
}
const Transacoes = function(){
    return(
    <div className='BlocoTabelas'>
        <div className='Teste'>

            <h2>Cadastrar transação</h2>

            <input type="text" name="Titulo" id="" placeholder='Titulo' />
            <input type="text" name="Descricao" id="" placeholder='Ex: Lanchonete' />
            <input type="date" name="Data" id=""  />

            <select id="options">
            <option value="" disabled selected>Tipo da Transacao</option>
            <option value="opcao1">Despesa</option>
            <option value="opcao2">Receita</option>
            </select>

            <input type="value" name="Valor" id="" placeholder='R$ 200,00' />
            <input type="button" value="Cadastrar" />
        </div>
    </div>
    )
}

  
export {Navbar, BlocoReceitas, Transacoes}