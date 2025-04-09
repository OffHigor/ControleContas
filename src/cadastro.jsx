import React, { useState } from 'react'; // Corrigir a importação do useState
import './cadastro.css';

const Cadastro = function () {
  // Definindo o estado inicial dos campos do formulário
  const [formCadast, setFormCadast] = useState({
    nome: '',
    email: '',
    usuario: '',
    dataNascimento: '',
    senha: '',
  });

  // Função para atualizar o estado quando os campos forem alterados
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormCadast({
      ...formCadast,
      [name]: value, // Atualiza o valor do campo específico
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();  // Impede o comportamento padrão de recarregar a página

    // Envia os dados para o backend (substitua pela URL do seu servidor)
    fetch('http://localhost:3001/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Envia os dados como JSON
      },
      body: JSON.stringify(formCadast),  // Converte o estado do formulário em uma string JSON
    })
      .then((response) => response.json())  // Converte a resposta para JSON
      .then((data) => {
        if (data.success) {
          alert('Cadastro realizado com sucesso!');
        } else {
          alert('Erro no cadastro!');
        }
      })
      .catch((error) => {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao enviar dados.');
      });
  };

  return (
    <div className='BlocoCadastro'>
      <form onSubmit={handleSubmit}>
        <div className='Controle'>
          <h1>
            E aí parceiro, suave na nave! Se está mexendo em React, sabe que
            está no caminho certo. Vamos juntos com o Lukinha, abraço do Samel!
          </h1>

          <div className='InputUsuario2'>
            <label htmlFor="nome">Digite seu nome:</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome"
              className="Inputs"
              value={formCadast.nome} 
              onChange={handleChange}
            />
          </div>

          <div className='InputUsuario2'>
            <label htmlFor="email">Digite seu Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className="Inputs"
              value={formCadast.email}  
              onChange={handleChange}
            />
          </div>

          <div className='InputUsuario2'>
            <label htmlFor="usuario">Digite o nome do Usuário:</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="Higorwz"
              className="Inputs"
              value={formCadast.usuario}  
              onChange={handleChange}
            />
          </div>

          <div className='InputUsuario2'>
            <label htmlFor="dataNascimento">Insira a data de Nascimento:</label>
            <input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              className="Inputs"
              value={formCadast.dataNascimento}  
              onChange={handleChange}
            />
          </div>

          <div className='InputUsuario2'>
            <label htmlFor="senha">Senha:</label>
            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              className="Inputs"
              value={formCadast.senha}  
              onChange={handleChange}
            />
          </div>

          <button type="submit" id="BtnEntrar">Cadastrar</button>
        </div>
      </form>
    </div>
  );
};

export default Cadastro;
