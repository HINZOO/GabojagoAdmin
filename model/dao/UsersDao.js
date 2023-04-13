class UsersDao {
    findByUidAndPwSql="SELECT * FROM users WHERE u_id=? AND pw=? AND permission='ADMIN'";
    findByAllSql="SELECT * FROM users LIMIT ?,?";
    findByPermissionSql="SELECT * FROM users WHERE permission=? LIMIT ?,?";
    findByUidSql="SELECT * FROM users WHERE u_id=?";
    updateSql="UPDATE users SET pw=?,name=?,nk_name=?,email=?,birth=?,phone=?,address=?,detail_address=?,pr_content=?,mbti=?,img_path=?,store_name=?,business_id=? WHERE u_id=?";
    updatePermissionSql="UPDATE users SET permission=? WHERE u_id=?";
    insertSql="INSERT INTO users (u_id,nk_name,pw,name,phone,img_path,email,birth,address,detail_address,store_name,business_id,mbti,permission) value(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    deleteSql="DELETE FROM users WHERE u_id=?";
    #pool;
    constructor(pool) {
        this.#pool=pool;
    }
    async findByUidAndPw(uId,pw){
        const [rows,f]=await this.#pool.query(this.findByUidAndPwSql,[uId,pw]);
        return rows[0] || null;
    }
    async findAll(page=1){
        let length=5;
        const [rows,f]=await this.#pool.query(this.findByAllSql,[(page-1)*length,length]);
        return rows;
    }
    async findByPermission(permission,page=1){
        let length=5;
        const values=[permission,(page-1)*length,length];
        const [rows,f]=await this.#pool.query(this.findByPermissionSql,values);
        return rows;
    }
    async findByUid(uId){
        const [rows,f]=await this.#pool.query(this.findByUidSql,[uId]);
        return  rows[0] || null;
    }
    async updateByUid(user){
        let update=0;
        const values=[
            user.permission,
            user.email,
            user.name,
            user.phone,
            user.pw,
            user.gender,
            user.birth,
            user.img_path,
            user.address,
            user.detail_address,
            user.nk_name,
            user.pr_content,
            user.mbit,
            user.store_name,
            user.business_id,
            user.u_id
        ];
        try {
            const [result]=await this.#pool.execute(this.updateSql,values);
        }catch (e){
            throw new Error(e);
        }
        return update;
    }
    async updatePermissionById (uId,permission){
        let update=0;
        const [result]=await this.#pool.execute(this.updatePermissionSql,[uId,permission]);
        update=result.affectedRows;
        return update;
    }
    async insertOne(user){
        let insert=0;
        const values=[
            user.permission,
            user.email,
            user.name,
            user.phone,
            user.pw,
            user.gender,
            user.birth,
            user.img_path,
            user.address,
            user.detail_address,
            user.nk_name,
            user.pr_content,
            user.mbit,
            user.store_name,
            user.business_id,
            user.u_id
        ];
        try {
            const [result]=await this.#pool.execute(this.insertSql,values);
            insert=result.affectedRows;
        }catch (e) {
            throw new Error(e);
        }
        return insert;
    }
    async deleteOne(uId){
        let del=0;
        try {
            const [result,f]=await this.#pool.execute(this.deleteSql,[uId]);
            del=result.affectedRows;
        }catch (e) {
            throw new Error(e);
        }
        return del;
    }
}
module.exports=UsersDao;
