var express = require('express')
var app = express()
var bodyParser= require('body-parser');
var xHorizontal
var xVertical

var modeMaster = 0


var obj = {
    'v': {
        q : 0
    },
    'h': {
        p : 0
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



var rp = require('request-promise-native');
var date = new Date()
var kParam = process.argv[2] || 6


console.log('kParam: ', kParam)



function applyWatchError(){
    date = new Date(new Date(date).setSeconds(new Date(date).getSeconds() + 3))
}


function adjustTime() {
    
    let now = new Date().getSeconds()

    console.log('\n\n -- Current Time: '+ date+ ' --')

    rp('https://horadobrasil.herokuapp.com/timestamp')
    .then((value) => { 
        console.log(parseInt(value))
        let diff = (new Date().getSeconds()-now)/2
        let t = new Date(parseInt(value))
        // console.log(t)
        // console.log(diff)
        let newDate = new Date(new Date(t).setSeconds(new Date(t).getSeconds() + diff))
        
        date = newDate

        console.log('\n -- Adjusted Time: '+ date+ ' -- \n\n')
    })
    .catch((err) => {
        // Crawling failed...
        console.log(err)
    });
}

setInterval(applyWatchError, 1000)
setInterval(adjustTime, kParam ? kParam*60000 : 6*60000)

setInterval(() => { 

    xHorizontal = (obj['h']['p']) / (obj['h']['p'] + obj['v']['q'])

    if (xHorizontal < 0.2) {
        modeMaster = 1

        console.log('\n\n -------------------------- ')
        console.log('MODO: ', modeMaster)
        console.log('Valor de x: ', xHorizontal)
        console.log('--Tempo horizontal-- \nVerde : 20\nVermelho: 100')
        console.log('--Tempo vertical-- \nVerde : 100\nVermelho: 20')
        console.log(' -------------------------- \n\n')

    } else if (xHorizontal > 0.2 && xHorizontal <= 0.4) {
        modeMaster = 2

        console.log('\n\n -------------------------- ')
        console.log('MODO: ', modeMaster)
        console.log('Valor de x: ', xHorizontal)
        console.log('--Tempo horizontal-- \nVerde : 40\nVermelho: 80')
        console.log('--Tempo vertical-- \nVerde : 80\nVermelho: 40')
        console.log(' -------------------------- \n\n')

    } else if (xHorizontal > 0.4 && xHorizontal <= 0.6) {
        modeMaster = 3

        console.log('\n\n -------------------------- ')
        console.log('MODO: ', modeMaster)
        console.log('Valor de x: ', xHorizontal)
        console.log('--Tempo horizontal-- \nVerde : 60\nVermelho: 60')
        console.log('--Tempo vertical-- \nVerde : 60\nVermelho: 60')
        console.log(' -------------------------- \n\n')

    } else if (xHorizontal > 0.6 && xHorizontal <= 0.8) {
        modeMaster = 4

        console.log('\n\n -------------------------- ')
        console.log('MODO: ', modeMaster)
        console.log('Valor de x: ', xHorizontal)
        console.log('--Tempo horizontal-- \nVerde : 80\nVermelho: 40')
        console.log('--Tempo vertical-- \nVerde : 40\nVermelho: 80')
        console.log(' -------------------------- \n\n')

    } else if (xHorizontal > 0.8 && xHorizontal <= 1) {
        modeMaster = 5

        console.log('\n\n -------------------------- ')
        console.log('MODO: ', modeMaster)
        console.log('Valor de x: ', xHorizontal)
        console.log('--Tempo horizontal-- \nVerde : 100\nVermelho: 20')
        console.log('--Tempo vertical-- \nVerde : 20\nVermelho: 100')
        console.log(' -------------------------- \n\n')

    } else {

        console.log('\n\n -------------------------- ')
        console.log('MODO: ', modeMaster)
        console.log('Valor de x: ', xHorizontal)
        console.log('nenhum modo selecionado!')
        console.log(' -------------------------- \n\n')
    }

}, 6*60000)

// setInterval(() => {





// }, 120000)



app.get('/', (req, res) => {

    let text = '<!DOCTYPE html>'+
            '<html>'+
            '<body>'+
            ''+
            '<h2>Semaforo</h2>'+
            ''+
            '<table style="width:100%">'+
            '  <tr>'+
            '    <th>Valor de X</th>'+
            '    <th>Valor de P</th> '+
            '    <th>Valor de Q</th>'+
            '    <th>Data</th>'+
            '    <th>Parametro</th>'+
            '    <th>Modo de Operação</th>'+
            '  </tr>'+
            '  <tr>'+
            '    <td>'+ xHorizontal +'</td>'+
            '  </tr>'+
            '  <tr>'+
            '    <td>'+ obj['h']['p'] +'</td>'+
            '  </tr>'+
            '  <tr>'+
            '    <td>'+ obj['v']['q'] +'</td>'+
            '  </tr>'+
            '  <tr>'+
            '    <td>'+ date +'</td>'+
            '  </tr>'+
            '  <tr>'+
            '    <td>'+ kParam +'</td>'+
            '  </tr>'+
            '  <tr>'+
            '    <td>'+ modeMaster +'</td>'+
            '  </tr>'+
            '</table>'+
            ''+
            '</body>'+
            '</html>';


    res.send(text)
})


app.post('/', function (req, res) {
    
    if(req.body.t === 'h') 
        obj[req.body.t]["p"] = parseFloat(req.body.p)
    else if (req.body.t === 'v')
        obj[req.body.t]["q"] = parseFloat(req.body.q)

    console.log('---- DEBUG ----')
    // console.log('XL :' , xHorizontal)
    // console.log('VAL: ', (obj['h']['p']) / (obj['h']['p'] + obj['v']['q']))
    console.log('POSTED: ', obj)
    console.log('---- END DEBUG ----')

    res.send('ok')
});


app.listen(process.env.PORT || 5000)