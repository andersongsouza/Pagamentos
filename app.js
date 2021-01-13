
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require('moment');
const session = require('express-session');
const flash = require('connect-flash');
const Pagamento = require('./models/Pagamento');
const path = require("path");

//////////////////////////////////////PARAMETERS//////////////////////////////////////////


//uso do Handlebars e formatar datas 
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: {
    formatDate: (date) => {
      return moment.utc(date).format('DD/MM/YYYY');
    },
    formatDateT: (date) => {
      return moment.utc(date).format('YYYY/MM/DD');
    }
  },
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
  },
}))

//handlebars
app.set('view engine', 'handlebars')

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//session
app.use(session({
  secret: 'agdssession',
  resave: true,
  saveUninitialized:true
}));

app.use(flash());

//Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("Success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

///////////////////////////////////END PARAMETERS////////////////////////////////////////

////////////////////////////////////Rotas/////////////////////////////////////////////////

//listar Pagamentos
app.get('/', function (req, res) {
  Pagamento.findAll({order: [['id', 'DESC']]}).then(function(pagamentos) {
    res.render('pagamento', {pagamentos: pagamentos});
  })
});

app.get('/cad-pagamento', function (req, res) {
  res.render('cad-pagamento');
});

//cadastrar pagamentos
app.post('/add-pagamento', function(req, res) {
  Pagamento.create({
    nome : req.body.nome,
    valor : req.body.valor.replace(/[.]/g,'').replace(',','.'),
    vencimento : req.body.vencimento
  }).then(function(){
    req.flash("Success_msg","Pagamento cadastrado com sucesso!");
    res.redirect('/');
    //res.send("Pagamento cadastrado com sucesso!");
  }).catch(function(erro){
    req.flash("error_msg", "Ocorreu um erro ao cadastrar o lançamento!");
  });
});

//Carregar formulario para editar o pagamento
app.get('/edit-pagamento/:id', function(req, res) {
  Pagamento.findByPk(req.params.id)
      .then(post => {
        res.render('edit-pagamento', {
        id: req.params.id,
        nome: post.nome,
        valor: post.valor,
        //vencimento: post.vencimento
        vencimento: moment.utc(post.vencimento).format('DD/MM/YYYY')
      })
    }).catch(function(erro){
        req.flash("error_msg", "Pagamento não encontrado!")
      })
     
});

//Editar o pagamento
//Editar no banco de dados o pagamento
app.post('/update-pagamento/:id', function (req, res) {
  Pagamento.update({
      nome: req.body.nome,
      valor: req.body.valor.replace(/[.]/g,'').replace(',','.'),
      vencimento: moment.utc(req.body.vencimento, ["DD-MM-YYYY", "YYYY-MM-DD"])
  }, {
      where: { id: req.params.id }
  }).then(function () {
    req.flash("Success_msg","Pagamento Editado com sucesso!");
      res.redirect('/')
  }).catch(function (erro) {
      req.flash("error_msg", "Erro: Pagamento não foi editado com sucesso!")
  })

})

//Visualizar detalhes do pagamento
app.get('/vis-pagamento/:id', function(req, res) {
  Pagamento.findByPk(req.params.id)
      .then(post => {
        res.render('vis-pagamento', {
        id: req.params.id,
        nome: post.nome,
        valor: post.valor,
        vencimento: post.vencimento        
      })
    }).catch(function(erro){
        req.flash("error_msg", "Pagamento não encontrado!")
      })
     
});

app.get('/del-pagamento/:id', function(req, res) {
  Pagamento.destroy({
    where: {'id': req.params.id}
  }).then(function(){
    req.flash("Success_msg","Pagamento apagado com sucesso!");
    res.redirect('/');
    // res.send("Pagamento apagado com sucesso!");
  }).catch(function(erro) {
    req.flash("error_msg", "Ocorreu um erro ao apagar o lançamento!");
    // res.send("Ocorreu um erro ao apagar o lançamento!")
  });
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Umbler listening on port %s', port);
});


////////////////////////Trabalhando com sequelize////////////////////////////////////////


//Inserir dados na tabela
// Pagamento.create({
//   nome: "Condomínio",
//   valor: 810
// });


////////////////////////////////Conexão SQL////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//conexão com DB MySQL
// const mysql = require('mysql');

// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'andersongarcia',
//     password : '172244',
//     database : 'celse'
//   });

//   connection.connect(function(err) {
//     if (err)
//       console.error('error connecting: ' + err.stack);
//       return;
//     });

    //INSERT
  // connection.query("INSERT INTO users (nome, email) VALUES ('Marcos Carvalho Machado', 'marcos@gmail.com')",
  // function(err,result) {
  //   if (!err) {
  //       console.log('Usuário Cadastrado com sucesso!');
  //   }else{
  //       console.log('Erro ao cadastrar o usuario!')
  //   }
  // })

      //UPDATE
  //  connection.query("UPDATE users SET nome =  'Marinho de Souza', email = 'marinho.souza@gmail.com' WHERE idusers = 5",
  //  function(err,result) {
  //    if (!err) {
  //        console.log('Usuário editado com sucesso!');
  //    }else{
  //        console.log('Erro: o usuário não foi editado com sucesso!');
  //    }
  //  })

  //       //DELETE
  //  connection.query("DELETE FROM users WHERE idusers = 7",
  //  function(err,result) {
  //    if (!err) {
  //        console.log('Usuário apagado com sucesso!');
  //    }else{
  //        console.log('Erro: o usuário não foi apagado com sucesso!');
  //    }
  //  })
