import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import {errors} from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname,'..','uploads')));

app.use(errors());

app.listen(3333);

// const users = [  
//     'Diego', //0
//     'Fabio', //1 
//     'Teste' //2
//     ];

// //Request Params: A rota exige que seja passado a informação, exemplo o ID do usuário a ser manipulado    
// //Query Params (Filtros): São parâmetros que vem na rota, porém opcionais
// //Request Body: Parâmetros para criação / atualização de informações

// // Biblioteca com linguagem centralizada (SQLite, SQLServer,...) Connection será utilizado será o KNex.JS
// // Select * from usuarios where nome='Fabio'
// // knex('usuarios').where('nome','Fabio').select('*')

// app.get('/users', (request, response) => {
//     //console.log('Listagem de usuários');

//     const search = String(request.query.search);

//     const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

//     return response.json(filteredUsers);
// });

// app.get('/users/:id', (request,response) => {
//     console.log('Retorna usuário ' + request.params.id);
//     const id = Number(request.params.id);

//     const user = users[id];
    
//     return response.json(user);
// });


// app.post('/users',(request,response) =>{
//     const data = request.body;

//     console.log(data);

//     const user = {
//         name: data.name,
//         email: data.email
//     };

//    return response.json(user);
// });

