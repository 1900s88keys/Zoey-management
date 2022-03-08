const Sequelize = require("sequelize");
const DB = require("../dbconfig");
const AdminDept = require("./sys_dept");


module.exports = Sys_user = DB.define("sys_user", {
    user_id: {
        type: Sequelize.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    dept_id: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
    },
    user_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    nick_name: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    user_type: {
        type: Sequelize.STRING(2),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
    phonenumber: {
        type: Sequelize.STRING(11),
        allowNull: true,
    },
    sex: {
        type: Sequelize.STRING(1),
        allowNull: true,
    },
    avatar: {
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    status: {
        type: Sequelize.STRING(1),
        allowNull: true,
    },
    del_flag: {
        type: Sequelize.STRING(1),
        allowNull: true,
    },
    login_ip: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
    login_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    create_by: {
        type: Sequelize.STRING(64),
        allowNull: true,
    },
    create_time: {
        type: Sequelize.DATE,
        allowNull: false
    },
    remark:{
        type: Sequelize.TEXT,
        allowNull: true
    }
},
    {
        freezeTableName: true,
        timestamps: false
    })
