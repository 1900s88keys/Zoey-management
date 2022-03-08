import React, { Component } from 'react'
import { message, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { deleteAdmin } from "../../../api/index"

interface IProps {
    id: number
    deleteAdmin: Function
}

export default class DeleteAdmin extends Component<IProps> {
    deleteAdmin = async () => {
        try {
            const result = await deleteAdmin(this.props.id);
            const { code, msg } = result.data;

            if (code === 1000) {
                message.success(msg)
                this.props.deleteAdmin(this.props.id)
            } else {
                message.error(msg)
            }
        } catch (error) {
            message.error("出错啦")
        }
    }
    render() {
        return (
            <>
                <Popconfirm
                    title="您确定删除吗？"
                    onConfirm={
                        this.deleteAdmin
                    }>
                    <a><DeleteOutlined />删除</a>
                </Popconfirm>
            </>
        )
    }
}
