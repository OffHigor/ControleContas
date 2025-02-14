import './Receitas.css'

function BlocoReceitas ({nome, imagem}) {
    return(
        <div className='BlocoReceitas'>
        <p className='tt'>{nome}</p>
        <img src={imagem} alt="" />
        </div>
    )
}
export default BlocoReceitas