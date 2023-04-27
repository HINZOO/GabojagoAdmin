const sequelize=require("../SequelizePool");
const usersEntity=require("../entity/UsersEntity")(sequelize);
const {Op, where}=require("sequelize");
const PageVo=require("../vo/PageVo");
class UsersService{
    async list(reqParams){
        const whereObj={};
<<<<<<< HEAD
        if(permission!=null){
            whereObj["permission"]=permission;
        }

        return await usersEntity.findAll({
            where: whereObj,
            offset:(page-1)*limit,
            limit :limit}); // limit offset,rowLength;
=======
        const orderArr=[];
        if(reqParams.field && reqParams.value){
            whereObj[reqParams.field]={[Op.like]:`%${reqParams.value}%`};
        }
        if(reqParams.orderField && reqParams.orderDirect){
            orderArr.push(reqParams.orderField);
            orderArr.push(reqParams.orderDirect);
        }
        const totalCnt=await usersEntity.count({
            where: whereObj
        })

        const pageVo=new PageVo(reqParams.page,totalCnt,reqParams);
        try {
            const users= await usersEntity.findAll({
                offset:pageVo.offset,
                limit:pageVo.rowLength,
                where:whereObj,
                order:[orderArr]
            })
            users.pageVo=pageVo;

            return users;
        }catch (e) {
            new Error(e);
        }
>>>>>>> 664044b011c53cdcfc08c744d40482a2346690d5
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