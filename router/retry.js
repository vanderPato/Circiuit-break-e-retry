const apiComRetry = (url, numeroRetry) => {
    return new Promise((resolve, reject)=> {
        let tentativas = 1;
    
        const apiRetry = (url, numero) => {
            return api.get(url).then(resultado => {
                const status = resultado.data.status;

                if(status === 200) {
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
            }).catch((erro) => {
                if (numero === 1) {
                    reject(erro);
                } else {
                    console.log('tentando 2');
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