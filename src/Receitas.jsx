import './Receitas.css'

const BlocoReceitas = function({nome, imagem}) {
    return(
        <div className='BlocoReceitas'>
        <p className='tt'>{nome}</p>
        <img src={imagem} alt="" />
        </div>
    )
}
const Transacoes = function(){
    return(
        <div className='Teste'>
            <input type="text" name="Titulo" id="" placeholder='Titulo' />
            <input type="text" name="Descricao" id="" placeholder='Ex: Lanchonete' />
            <input type="date" name="Data" id=""  />

            <select id="options">
            <option value="" disabled selected>Tipo da Transacao</option>
            <option value="opcao1">Despesa</option>
            <option value="opcao2">Receita</option>
            </select>

            <input type="value" name="Valor" id="" placeholder='R$ 200,00' />
            
        </div>
    )
}

  
export {BlocoReceitas, Transacoes}