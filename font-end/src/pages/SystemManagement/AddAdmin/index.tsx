import React, { Component, createRef, RefObject, ReactNode, Fragment } from 'react'

import {
    Form,
    Input,
    Select,
    Modal,
    Radio,
    Button,
    FormInstance,
    message,
    TreeSelect,
} from 'antd';
import { IAdmin, IDept } from '../UserManger';
import { reqAddUser } from '../../../api/index'
import { nanoid } from 'nanoid';
import UploadAvatar from '../../../components/UploadAvatar';

const { Option } = Select;
interface IProps {
    visible: boolean
    callback: (refresh?: boolean) => void
    updateInfo: (value: IAdmin) => void,
    deptList: IDept[] | undefined
}

export default class AddAdmin extends Component<IProps> {
    formRef: RefObject<FormInstance>
    constructor(props: IProps) {
        super(props);
        this.formRef = createRef<FormInstance>();
    }

    state = {
        deptList: [],
        avatarPath: '',
        value: undefined
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
    // 提交表单
    onFinish = async (values: IAdmin) => {
        values.create_time = new Date();
        values.avatar = this.state.avatarPath;
        // console.log('表单values ', values);
        try {
            const result = await reqAddUser(values);
            const { code, msg } = result.data
            if (code === 1000) {
                message.success(msg)
                this.props.callback(true);
                this.formRef.current?.resetFields();
            } else {
                message.error(msg)
            }
        } catch (error) {
            message.error("出错啦")
        }
        // 更新父组件状态
        this.props.updateInfo(values)
    };

    normFile = (e: any) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );
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
                    title="增加管理员"
                    visible={this.props.visible}
                    onCancel={this.cancel}
                    footer={null}
                >
                    <Form
                        ref={this.formRef}
                        {...this.formItemLayout}
                        name="register"
                        onFinish={this.onFinish}
                        initialValues={{
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >

                        <Form.Item
                            label="头像"
                            name="avatar"
                        >
                            <UploadAvatar callback={this.getAvatarPath} />
                        </Form.Item>

                        <Form.Item
                            name="user_name"
                            label="用户名"
                            tooltip="用户名必须是英文、数字或下划线组成!"
                            rules={[
                                {
                                    required: true, whitespace: true, message: '用户名不能为空!'
                                },
                                {
                                    min: 4, message: "用户名至少为4位!",
                                },
                                {
                                    max: 12, message: "用户名最多为12位!"
                                },
                                {
                                    pattern: /^[A-z0-9_]+$/, message: "用户名必须是英文、数字或下划线组成!"
                                }
                            ]}
                        >
                            <Input />
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
                            rules={[{ required: true, message: '请输入您的性别!' }]}
                        >
                            <Radio.Group >
                                <Radio.Button value={"male"}>男</Radio.Button>
                                <Radio.Button value="female">女</Radio.Button>
                                <Radio.Button value="secret">保密</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="手机号码"
                            rules={[
                                { required: true, message: '请输入您的手机号码!' },
                                { pattern: /^1[3-9][0-9]{9}$/, message: "请输入合法的手机号码!" }
                            ]}
                        >
                            <Input addonBefore={this.prefixSelector} style={{ width: '100%' }} />
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
                                value={this.state.value}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={deptList}
                                placeholder="请选择归属岗位"
                                treeDefaultExpandAll
                            />
                        </Form.Item>
                        <Form.Item>

                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="密码"
                            tooltip="密码必须是英文、数字或下划线组成!"
                            rules={[
                                {
                                    required: true, whitespace: true, message: '密码不能为空!'
                                },
                                {
                                    min: 6, message: "密码长度不能小于6!",
                                },
                                {
                                    max: 12, message: "密码长度不能大于12!"
                                },
                                {
                                    pattern: /^[A-z0-9_]+$/, message: "密码必须是英文、数字或下划线组成!"
                                }
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="确认密码"
                            dependencies={['password']}
                            tooltip="请重新输入一遍密码!"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: '请确认密码!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                添加
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
