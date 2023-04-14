const sequelize=require("../SequelizePool");
const usersEntity=require("../entity/UsersEntity")(sequelize);
const {Op, where}=require("sequelize");
class UsersService{
    /*    findByUidAndPwSql="SELECT * FROM users WHERE u_id=? AND pw=? AND permission='ADMIN'";
    findByAllSql="SELECT * FROM users LIMIT ?,?";
    findByPermissionSql="SELECT * FROM users WHERE permission=? LIMIT ?,?";
    findByUidSql="SELECT * FROM users WHERE u_id=?";
    updateSql="UPDATE users SET pw=?,name=?,nk_name=?,email=?,birth=?,phone=?,address=?,detail_address=?,pr_content=?,mbti=?,img_path=?,store_name=?,business_id=? WHERE u_id=?";
    updatePermissionSql="UPDATE users SET permission=? WHERE u_id=?";
    insertSql="INSERT INTO users (u_id,nk_name,pw,name,phone,img_path,email,birth,address,detail_address,store_name,business_id,mbti,permission) value(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    deleteSql="DELETE FROM users WHERE u_id=?";
*/
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