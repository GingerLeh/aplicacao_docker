const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clound',
});

app.use(express.json());

// Rota para criar tabela
app.get('/criar-tabela', (req, res) => {
  connection.connect((error) => {
    if (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
    }

    const query = `
      CREATE TABLE funcionarios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        rg VARCHAR(20) NOT NULL,
        cpf VARCHAR(14) NOT NULL
      )
    `;

    connection.query(query, (error) => {
      if (error) {
        console.error('Erro ao criar tabela:', error);
        return res.status(500).json({ error: 'Erro ao criar tabela' });
      }

      console.log('Tabela criada com sucesso!');
      res.json({ message: 'Tabela criada com sucesso!' });

      connection.end();
    });
  });
});

// Rota para inserir um funcionário na tabela
app.post('/inserir-funcionario', (req, res) => {
  const funcionario = {
    nome: req.body.nome,
    rg: req.body.rg,
    cpf: req.body.cpf
  };

  const query = 'INSERT INTO funcionarios SET ?';

  connection.query(query, funcionario, (error, result) => {
    if (error) {
      console.error('Erro ao inserir na tabela:', error);
      return res.status(500).json({ error: 'Erro ao inserir na tabela' });
    }

    console.log('Registro inserido com sucesso!');
    res.json({ message: 'Registro inserido com sucesso!', insertedId: result.insertId });
  });
});

// Rota para exibir os funcionários da tabela
app.get('/funcionarios', (req, res) => {
  const query = 'SELECT * FROM funcionarios';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao executar consulta:', error);
      return res.status(500).json({ error: 'Erro ao executar consulta' });
    }

    console.log('Funcionários encontrados:', results);
    res.json({ funcionarios: results });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/`);
});
