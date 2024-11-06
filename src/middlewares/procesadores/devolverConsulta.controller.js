function devolverPromesa(promesa){
    return new Promise((resolve, reject)=>{
        try{
            resolve(promesa)
        }catch(error){
            reject(error);
        }
    })
}

module.exports = devolverPromesa;