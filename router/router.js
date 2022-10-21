const express = require('express')
const router = express.Router();
const api = require("../api")
const CircuitBreaker = require('../CircuitBreaker.js')


function circuit(status){
    const breaker = new CircuitBreaker(status)
    setInterval(() => {
        breaker
          .fire()
          .then(console.log)
          .catch(console.error)
      }, 1000)
    
}       

const apiComRetry = (url, numeroRetry) => {
    return new Promise((resolve, reject)=> {
        let tentativas = 1;
    
        const apiRetry = (url, numero) => {
            return api.get(url).then(resultado => {
                const status = resultado.data.status;

                if(status === 200) {
                    
                    console.log('estou no status 200')
                    return resolve(resultado.data);
                } else if (numero === 1) {
                    throw reject("Erro ao obter dados");
                } else {
                    console.log('tentando 1');
                    setTimeout(() => {
                        tentativas++;
                        apiRetry(url, numero -1);
                    }, tentativas * 3000);
                }
            }).catch((error) => {
                if (numero === 1) {
                    circuit({data:'Failed'})





                } else {
                    console.log('tentando' , tentativas);
                    setTimeout(() => {
                        tentativas++;
                        apiRetry(url, numero -1);
                    }, tentativas * 3000);
                }
            });
        }

        return apiRetry(url, numeroRetry); 
    });
}


router.post('/busca',  async (req, res) =>{
    const dadosApi =  req.body
    try{
        const data = await apiComRetry(`${dadosApi.dad}.json`, 4)
           return res.render('mostraDados', {datas:data})
       
        }catch(error){
                res.render('mostraDados', {error:error.response});
            
            
        }


    

})


router.get('/busca',  async (req, res) =>{
    return res.render('mostraDados');
    

    

})



module.exports = app => app.use(router)