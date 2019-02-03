let dataBase = require('../database/database');

module.exports = {
    //return servers snapshot from database
    getServersDB() {
        return new Promise(resolve => {
          setTimeout(() => {
            dataBase.ref('/servers').once('value').then(async (snapshot) => {
                resolve(snapshot.val());
            });
          }, 2000);
        });
    },
    //store data from database offline
    async refreshServersDB(client){
        client.serversDB = await this.getServersDB();
        console.log(client.serversDB);
    }
}