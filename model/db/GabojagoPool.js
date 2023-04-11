const mysql= require("mysql2");
const conInfo={
    database:"gabojagoplan",
    host:"localhost",
    port:3306,
    user:"gabojagoServerDev",
    password:"mysql123"
}
const pool=mysql.createPool(conInfo);
const poolPromise=pool.promise();
module.exports=poolPromise;