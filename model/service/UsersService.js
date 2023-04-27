const sequelize=require("../SequelizePool");
const usersEntity=require("../entity/UsersEntity")(sequelize);
const {Op, where}=require("sequelize");
class UsersService{
     async list(permission,page=1){
        let limit=10;
        const whereObj={};
        if(permission!=null){
            whereObj["permission"]=permission;
        }

        return await usersEntity.findAll({
            where: whereObj,
            offset:(page-1)*limit,
            limit :limit}); // limit offset,rowLength;
    }
    async detail(uId){
        return await usersEntity.findByPk(uId);
    }

    async login(uId, pw) {
        return await usersEntity.findOne(
            {
                where:
                    {
                        u_id: uId,
                        pw: pw
                    }
            }
        );
    }


    async permissionModify(uId, permission) {
        try {
            let modify=await usersEntity.update(
                    {permission: permission},
                    {where: {u_id: uId}}
            );
            return modify;
        } catch (e) {
            throw new Error(e);
        }

    }
    async modify(user){
        try {
            let modify=await usersEntity.update(
                user,
                {
                    where: {u_id: user.u_id}
                }
            );
            return modify;
        } catch (e) {
            throw new Error(e);
        }

    }
    async register(user){
        try {
            const insertUser=await usersEntity.create(user);
            return insertUser;
        }catch (e) {
            throw new Error(e);
        }
    }
    async remove(uId){
        try {
            return await usersEntity.destroy({where:{u_id:uId}});
        }catch (e) {
            throw new Error(e);
        }
    }
}
module.exports=new UsersService();