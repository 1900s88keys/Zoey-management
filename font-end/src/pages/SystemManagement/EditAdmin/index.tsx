import React, { Component, createRef, RefObject, Fragment, Key } from 'react'

import {
    Form,
    Input,
    Select,
    Modal,
    Radio,
    Button,
    FormInstance,
    message,
    Switch,
    TreeSelect
} from 'antd';
import { IAdmin, IDept } from '../UserManger';
import { updateAdminInfo, getAdminInfo, } from '../../../api/index'
import { nanoid } from 'nanoid';
import UploadAvatar from '../../../components/UploadAvatar';





interface IProps {
    visible: boolean,
    callback: (refresh?: boolean) => void
    selectedRowKeys: Key[]
    deptList: IDept[] | undefined
}

interface IState {
    deptList: IDept[],
    avatarPath: string
}

export default class EditAdmin extends Component<IProps, IState> {
    formRef: RefObject<FormInstance>
    constructor(props: IProps) {
        super(props);
        this.formRef = createRef<FormInstance>();
    }

    state = {
        deptList: [],
        avatarPath: '',
        value: 0
    }
    // 更新表单 
    componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (this.props.visible && !prevProps.visible) {
            if (this.props.selectedRowKeys[0]) {
                this.getAdminInfo(this.props.selectedRowKeys[0])
            }
        }
    }

    cancel = () => {
        this.props.callback();
    }


    // 获取头像地址
    getAvatarPath = (path: string) => {
        this.setState({
            avatarPath: path
        })
    }

    // 点击修改获取管理员信息
    getAdminInfo = async (id: Key) => {
        try {
            const response = await getAdminInfo(id)
            // console.log(response);
            this.formRef.current?.setFieldsValue(response.data.data[0]);
            this.getAvatarPath(response.data.data[0].avatar)
        } catch (error) {
            // console.log(error);
            message.error("出错啦")
        }
    }

    // 提交表单
    onFinish = async (values: IAdmin) => {
        const { avatarPath } = this.state;
        values.update_time = new Date();
        values.avatar = avatarPath;
        values.dept_id = this.state.value;
        console.log('表单values ', values);
        try {
            const result = await updateAdminInfo(values);
            const { code, msg } = result.data
            if (code === 1000) {
                message.success(msg)
            } else {
                message.error(msg)
            }
            this.formRef.current?.resetFields();
            this.cancel()
        } catch (error) {
            message.error("出错啦")
        }
    };

    formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 18 },
            sm: { span: 16 },
        },
    };
    render() {
        const { deptList } = this.props;
        return (
            <>
                <Modal
                    title="修改信息"
                    visible={this.props.visible}
                    onCancel={this.cancel}
                    footer={null}
                    closable={true}
                >

                    <Form
                        ref={this.formRef}
                        {...this.formItemLayout}
                        name="edit"
                        onFinish={this.onFinish}
                        scrollToFirstError
                    >

                        <Form.Item
                            label="头像"
                            name="avatar"
                        >
                            <UploadAvatar
                                callback={this.getAvatarPath}
                                imagePath={this.state.avatarPath}
                            />
                        </Form.Item>
                        <Form.Item
                            name="user_id"
                            label="ID"
                            tooltip="ID无法修改"
                        >
                            <Input disabled
                            />
                        </Form.Item>
                        <Form.Item
                            name="user_name"
                            label="用户名"
                            tooltip="用户名无法修改"
                        >
                            <Input disabled
                            />
                        </Form.Item>
                        <Form.Item
                            name="nick_name"
                            label="用户昵称"
                            tooltip="输入一个的好听的昵称吧!"
                            rules={[{ required: true, message: '请输入一个的好听的昵称吧!', whitespace: true }]}
                        >
                            <Input maxLength={12} />
                        </Form.Item>
                        <Form.Item
                            name="sex"
                            label="性别"
                            getValueProps={((value: any) => {
                                return { value }
                            })}
                        >
                            <Radio.Group
                            >
                                <Radio.Button value="0">男</Radio.Button>
                                <Radio.Button value='1'>女</Radio.Button>
                                <Radio.Button value='2'>保密</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="phonenumber"
                            label="手机号码"
                            rules={[
                                { required: true, message: '请输入您的手机号码!' },
                                { pattern: /^1[3-9][0-9]{9}$/, message: "请输入合法的手机号码!" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: '请输入合法的电子邮箱格式!',
                                },
                                {
                                    required: true,
                                    message: '请输入您的电子邮箱!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="dept_id"
                            label="归属岗位"
                        >
                            <TreeSelect
                                style={{ width: '100%' }}
                                // value={this.state.value}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={deptList}
                                placeholder="请选择归属岗位"
                                treeDefaultExpandAll
                            />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="状态"
                            key="switch"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 18 }}>

                            <Button type="primary" htmlType="submit">
                                修改
                            </Button>
                            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button htmlType="button" onClick={this.cancel}>
                                返回
                            </Button>
                        </Form.Item>
                    </Form>

                </Modal >
            </>
        )
    }
}
