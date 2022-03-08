/* 
    发送异步ajax请求的函数模块
    封装axios
    函数返回值是promise对象
*/
import axios from 'axios';

export default function ajax(url: any, data: any = {}, type = "GET") {
    if (type === "GET") { //发送GET请求
        return axios.get(url, { //配置对象
            params: data  //指定请求参数
        })
    } else if (type === "POST") { //发送POST请求
        return axios.post(url, {
            data: data
        })
    } else if (type === "DELETE") {
        return axios.delete(url, {
            data: data
        })
    } else if (type === "PUT") {
        return axios.put(url, {
            data: data
        });
    } else {
        return axios.post(url, {
            data: data
        })
    }
}



