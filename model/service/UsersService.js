const pool=require("../db/GabojagoPool");
const UsersDao=require("../dao/UsersDao");
const usersDao=new UsersDao(pool);

class UsersService{
    async list(permission,page=1){
        if(permission){
            return usersDao.findByPermission(permission,page);
        }else {
            return usersDao.findAll(page);
        }
    }
    async detail(uId){
        return usersDao.findByUid(uId);
    }
    async login(uId,pw){
        return usersDao.findByUidAndPw(uId,pw);
    }


    async permissionModify(uId,permission){
        return usersDao.updatePermissionById(uId,permission)
    }
    async modify(user){
        return usersDao.updateByUid(user);
    }
    async register(user){
        return usersDao.insertOne(user);
    }
    async remove(uId){
        return usersDao.deleteOne(uId);
    }
}
module.exports=new UsersService();