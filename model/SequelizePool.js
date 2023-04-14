const {Sequelize} = require("sequelize");

const sequelize=new Sequelize("gabojagoplan","gabojagoServerDev","mysql123", {
    host:"localhost",
    port:3306,
    dialect:"mysql",
    pool:{
        max:5,
        min:0,
        acquire: 30000, //db 접속하는데 까지 기다려주는 시간
        idle:10000 //유저리스트를 가져오는데 까지 기다려주는 시간
    },
    debug: true,
    logging: (msg) => console.log(msg),
});
module.exports=sequelize;