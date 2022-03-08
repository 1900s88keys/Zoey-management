/* 
    包含应用中所有的接口请求函数的模块
    每个函数的返回值都是promise
*/
import ajax from "./ajax";
import { PORT, HOST } from '../config/apiconfig'
import { IAdmin } from "../pages/SystemManagement/UserManger";
import { Key } from "react";

// 登录         http://localhost:8089/admins/login
export const reqLogin = (user_name: string, password: string) => ajax(`${HOST}:${PORT}/admins/login`, { user_name, password }, "POST")

// 获取管理员信息  http://localhost:8089/admins/admin/list
export const getAdminList = (number = 1) => ajax(`${HOST}:${PORT}/admins/admin/list`, {}, "GET")

// 获取岗位信息  http://localhost:8089/admins/dept/list
export const getDeptList = (number = 1) => ajax(`${HOST}:${PORT}/admins/dept/list`, {}, "GET")

//  删除管理员   http://localhost:8089/admins/admin/delete
export const deleteAdmin = (id: number) => ajax(`${HOST}:${PORT}/admins/admin/delete`, { id }, "DELETE")

//  批量删除管理员   http://localhost:8089/admins/deletes/beach`
export const beachDeleteAdmin = (ids: number[]) => ajax(`${HOST}:${PORT}/admins/deletes/beach`, { ids }, "DELETE")


// 添加管理用户  http://localhost:8089/manage/user/add
export const reqAddUser = (user: IAdmin) => ajax(`${HOST}:${PORT}/admins/admin/add`, user, "POST")

// 图片头像上传  http://localhost:8089/admins/admin/upload
export const uploadAvatar = `${HOST}:${PORT}/admins/admin/upload`;

// 获取管理员信息  http://localhost:8089/admins/admin/info
export const getAdminInfo = (id: Key) => ajax(`${HOST}:${PORT}/admins/admin/info`, { id }, "GET")

// 更新管理员信息 http://localhost:8089/admins/admin/update
export const updateAdminInfo = (user:IAdmin)=>ajax(`${HOST}:${PORT}/admins/admin/update`, user, "PUT")