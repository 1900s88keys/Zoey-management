const express = require("express");
const router = express.Router();
const crypto = require("crypto"); //导入加密模块
const jsonwebtoken = require('jsonwebtoken'); //导入token模块
const fs = require('fs');
const path = require('path');
const multiparty = require('connect-multiparty')// 导入图片上传中间件
const multipartyMiddleWare = multiparty();
const Sequelize = require("sequelize")
const Op = Sequelize.Op;

const AdminUser = require("../../config/dbModel/sys_user");
const AdminDept = require("../../config/dbModel/sys_dept");



AdminUser.belongsTo(AdminDept, {
    foreignKey: 'dept_id',
    targetKey: 'dept_id',
})

/* 
    登录： http://localhost:8089/admins/login
*/
router.post("/login", (request, response) => {
    const user = request.body.data;
    if (!user.user_name || !user.password) {
        response.json({
            code: 3000,
            msg: "用户不存在!"
        })
        return;
    }
    const { user_name, password } = user; //结构赋值密码和用户名
    const md5 = crypto.createHash("md5"); //创建md5加密对象
    // 对密码加密
    const newPassword = md5.update(password).digest("hex");

    AdminUser.findAll({
        where: {
            user_name
        },
        raw: true
    }).then(data => {
        if (data.length) {
            const { password, nick_name } = data[0]
            if (password === newPassword) { //密码正确 合法用户
                // 生成token
                const newToken = jsonwebtoken.sign(data[0], "zoye", {
                    expiresIn: 1440, //token过期时间
                })
                response.json({
                    code: 1000,
                    msg: `${nick_name}，欢迎回来!`,
                    token: newToken
                })
            } else {
                response.json({
                    code: 2000,
                    msg: "密码错误!"
                })
            }
        } else {
            response.json({
                code: 3000,
                msg: "用户不存在"
            })
        }
    })
})

// 获取用户信息  http://localhost:8089/admins/admin/list
router.get("/admin/list", (request, response) => {
    AdminUser.findAll({
        raw: true,
        include: {
            attributes: ['dept_name'],
            model: AdminDept
        }
    },
    ).then((data) => {
        // console.log(data);
        response.json({
            code: 1000,
            data,
            msg: "success"
        })
    })
})

// 获取岗位名称 http://localhost:8089/admins/dept/list
router.get("/dept/list", (request, response) => {
    AdminDept.findAll({
        raw: true
    },
    ).then((data) => {
        // console.log(data);
        response.json({
            code: 1000,
            data,
            msg: "success"
        })
    })
})

// 删除用户信息  http://localhost:8089/admins/admin/delete
router.delete("/admin/delete", (request, response) => {
    const user_id = request.body.id;

    AdminUser.destroy({
        where: {
            user_id
        }
    }).then((data) => {
        console.log(data);
        response.send({
            code: 1000,
            msg: "删除成功!"
        })
    })

})

// 批量删除用户信息  http://localhost:8089/admins/deletes/beach
router.delete("/deletes/beach", (request, response) => {
    console.log(request);
    const { ids } = request.body
    console.log(ids);
    AdminUser.destroy({
        where: {
            user_id: {
                [Op.in]: ids
            }
        }
    }).then(result => {
        response.json({
            code: 1000,
            msg: "删除成功"
        })
    }).catch(err => {
        console.log(err);
        response.json({
            code: 2000,
            msg: "删除失败"
        })
    })
})

// 增加用户信息  http://localhost:8089/admins/admin/add
router.post("/admin/add", (request, response) => {

    const user = request.body.data;
    const { password } = user; //结构赋值密码和用户名
    const md5 = crypto.createHash("md5"); //创建md5加密对象
    // 对密码加密
    const newPassword = md5.update(password).digest("hex");
    console.log(user);
    AdminUser.create({
        user_id: user.user_id,
        dept_id: user.dept_id,
        user_name: user.user_name,
        nick_name: user.nick_name,
        user_type: "00",
        email: user.email,
        phonenumber: user.phone,
        sex: user.sex === "male" ? '1' : user.sex === "female" ? "0" : "3",
        avatar: user.avatar,
        password: newPassword,
        status: "0",
        create_by: 'admin',
        create_time: user.create_time,
        update_time: user.create_time,
        update_by: 'admin',
    }).then(({ data }) => {
        console.log(data);
        response.send({
            code: 1000,
            msg: "创建成功!"
        })
    })
})

// 头像图片上传接口 http://localhost:8089/admins/admin/upload
router.post('/admin/upload', multipartyMiddleWare, (req, res) => {
    console.log("上传文件内容", req.files);
    // 获取上传文件
    const file = req.files.avatar;
    // 文件上传的保存位置
    const desc_dir = path.join(__dirname + "../../../public/images") + '\\' + file.name
    // console.log("保存地址：", desc_dir);
    fs.readFile(file.path, function (err, data) {
        fs.writeFile(desc_dir, data, function (err) {
            if (err) {
                console.log(err)
                res.json({
                    code: 2000,
                    msg: "文件写入失败"
                })
            }
        })
    })
    res.json({
        code: 1000,
        imageUrl: `http://localhost:8089/images/${file.name}`,
        msg: "success"
    })
})

// 获取修改时用户信息  http://localhost:8089/admins/admin/info
router.get("/admin/info", (request, response) => {
    console.log(request.query);
    AdminUser.findAll({
        where: {
            user_id: request.query.id,
        },
        raw: true,
    },
    ).then((data) => {
        // console.log(data);
        response.json({
            code: 1000,
            data,
            msg: "success"
        })
    })
})

// 获取修改时用户信息  http://localhost:8089/admins/admin/update
router.put("/admin/update", (request, response) => {
    // console.log(request.body);
    AdminUser.findOne({
        where: {
            user_id: request.body.data.user_id,
        },
        // raw: true,
    }).then((user) => {
        console.log({ ...request.body.data });
        user.update({ ...request.body.data })
            .then((data) => {
                response.json({
                    code: 1000,
                    data,
                    msg: "更新成功"
                })
            }).catch((error) => {
                console.log(error);
                ers.send({
                    code: 2000,
                    msg: "更新失败"
                })
            })
    })
        .catch((error) => {
            console.log(error);
            ers.send({
                code: 2000,
                msg: "查无此人"
            })
        })
})


module.exports = router;