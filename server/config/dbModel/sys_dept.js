const Sequelize = require("sequelize");
const DB = require("../dbconfig");

module.exports = Sys_dept = DB.define("sys_dept", {
    dept_id: {
        type: Sequelize.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    parent_id:{
        type:Sequelize.BIGINT(20),
        allowNull:true
    },
    ancestors: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
    dept_name: {
        type: Sequelize.STRING(30),
        allowNull: true
    },
    order_num: {
        type: Sequelize.INTEGER(4),
        allowNull: true
    },
    leader:{
        type: Sequelize.STRING(30),
        allowNull: true
    },
    email:{
        type: Sequelize.STRING(50),
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING(11),
        allowNull: true,
    },
    status:{
        type: Sequelize.STRING(1),
        allowNull: true,
    },
    del_flag:{
        type: Sequelize.STRING(1),
        allowNull: true,
    },
    create_by:{
        type: Sequelize.STRING(64),
        allowNull: true,
    },
    create_time: {
        type:Sequelize.DATE,
        allowNull: true,
    },
    update_by:{
        type:Sequelize.DATE,
        allowNull: true
    },
    update_time: {
        type:Sequelize.DATE,
        allowNull: true
    }
},
    {
        freezeTableName: true,
        timestamps: false
    })