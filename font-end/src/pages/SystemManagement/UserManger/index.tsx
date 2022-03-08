import { message, Table, Switch, Space, Button, Row, Col, Tree, } from 'antd'
import React, { Component, Key } from 'react'
import {
    KeyOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
    DownOutlined
} from '@ant-design/icons';
import { getAdminList, beachDeleteAdmin, getDeptList } from '../../../api/index'
import DeleteAdmin from '../DeleteAdmin';
import AddAdmin from '../AddAdmin'
import EditAdmin from '../EditAdmin'
import moment from 'moment';



export interface IAdmin {
    user_id: number,
    dept_id: number,
    dept_name: string,
    user_name: string,
    nick_name: string,
    department: string,
    status?: number,
    phonenumber: string,
    create_time?: Date,
    avatar?: string,
    update_time?: Date,
}

export interface IDept {
    key: number,
    title: string,
    children: IDept[];
    value: number,
    dept_id: number;
    parent_id: number;
    ancestors?: string;
    dept_name: string;
}

interface IState {
    adminList: IAdmin[];
    current: number,
    pageSize: number,
    total: number,
    loading: boolean
    showAddAdminModel: boolean,
    showEditAdminModel: boolean,
    selectedRowKeys: Key[],
    deptList: IDept[] | undefined,
}

export default class UserManager extends Component<any, IState>{
    state = {
        adminList: [],
        current: 1,
        pageSize: 5,
        total: 0,
        loading: true,
        showAddAdminModel: false, //是否展开添加model
        showEditAdminModel: false, //是否展开修改model
        selectedRowKeys: [], // 选择的key
        deptList: undefined
    }
    componentDidMount() {
        this.getAdminList();
        this.getDeptList();
    }
    // 获取岗位相关
    getDeptList = async (page = 1) => {
        try {
            const response = await getDeptList(page)
            const deptList = this.travelDeptList(response.data.data);
            this.setState({
                deptList
            })
        } catch (error) {
            console.log(error);

            message.error("出错啦")
        }
    }
    // 递归获取岗位的子节点
    travelDeptList = (deptList: IDept[], parent_id: number = 0) => {
        let plist: IDept[] = [];
        deptList.forEach((dept: IDept) => {
            if (dept.parent_id == parent_id) {
                dept.key = dept.dept_id;
                dept.value = dept.dept_id;
                dept.title = dept.dept_name;
                dept.children = this.travelDeptList(deptList, dept.dept_id)

                plist.push(dept);
            }
        })
        return plist
    }

    // 封装的ajxa请求数据
    getAdminList = async (page = 1) => {
        try {
            const response = await getAdminList(page)
            this.setState({
                adminList: response.data.data,
                loading: false,
                total: response.data.length
            })
        } catch (error) {
            message.error("出错啦")
        }
    }

    // 通过子组件调用该函数来删除当前页面状态里面的，使其不刷新页面也能在页面删除该管理员
    deleteAdmin = (id: number) => {
        // console.log(id);
        this.setState((state) => ({
            adminList: state.adminList.filter(admin => admin.user_id !== id)
        }))
    }
    // 批量删除
    onbeachDelete = () => {
        const { selectedRowKeys } = this.state
        // console.log(selectedRowKeys);
        beachDeleteAdmin(selectedRowKeys)
        selectedRowKeys.map((rowKey) => {
            this.setState((state) => ({
                adminList: state.adminList.filter(admin => admin.user_id !== rowKey)
            }))
        })
    }

    // 显示添加/修改等多个方框组件
    showModel = (action: any) => {
        return (
            (() => {
                this.setState(action)
            })
        )
    }

    // 隐藏添加/修改方框组件
    hideModel = (action: any, refresh?: boolean) => {
        return (
            (() => {
                if (refresh) {
                    this.getAdminList()
                }
                this.setState(action)
            })
        )
    }

    onChange = (page: number) => {
        this.setState({
            current: page
        })
    }
    // 选择框
    onSelectChange = (selectedRowKeys: Key[]) => {
        this.setState({ selectedRowKeys });
    };

    // 添加修改按钮回调
    onEdit = () => {
        const { selectedRowKeys } = this.state
        if (selectedRowKeys.length > 0) {
            this.showModel({ showEditAdminModel: true })()
        } else {
            message.info("至少选择一个")
        }
    }

    // 新增数据后更新当前状态
    updateInfo = (valuse: IAdmin) => {
        this.setState((state) => ({
            adminList: [...this.state.adminList, valuse]
        }))
    }

    // 树组件选择
    onSelect = (selectedKeys: Key[]) => {
        console.log('selected', selectedKeys);
    };


    render() {
        const { loading, adminList, total, pageSize, current, selectedRowKeys, deptList } = this.state
        return (
            <>
                <Row justify="space-between">
                    <Col span={5} >
                        <Tree
                            // autoExpandParent={true}
                            showLine
                            // defaultExpandAll={true}
                            // blockNode={true}
                            // defaultExpandParent={true}
                            switcherIcon={<DownOutlined />}
                            onSelect={this.onSelect}
                            treeData={deptList}
                            height={400}
                            defaultExpandedKeys={[100]}
                        />

                    </Col>
                    <Col span={18}>
                        <Row>
                            <Button icon={<PlusOutlined />} type='primary' style={{ margin: '0 10px 0 0' }} onClick={this.showModel({ showAddAdminModel: true })}>新增</Button>
                            <Button icon={<EditOutlined />} type='primary' style={{ margin: '0 10px 0 0' }} onClick={this.onEdit}>修改</Button>
                            <Button icon={<DeleteOutlined />} type='primary' style={{ margin: '0 10px 0 0' }} danger onClick={this.onbeachDelete}>删除</Button>
                            <Button icon={<VerticalAlignBottomOutlined />} type='primary' style={{ margin: '0 10px 0 0' }} onClick={() => message.info("开发中")}>导出</Button>
                            <Button icon={<VerticalAlignTopOutlined />} type='primary' style={{ margin: '0 10px 0 0' }} onClick={() => message.info("开发中")}>导入</Button>
                        </Row>
                        <AddAdmin
                            visible={this.state.showAddAdminModel}
                            callback={this.hideModel({ showAddAdminModel: false })}
                            updateInfo={this.updateInfo}
                            deptList={deptList}
                        />
                        <EditAdmin
                            visible={this.state.showEditAdminModel}
                            callback={this.hideModel({ showEditAdminModel: false })}
                            selectedRowKeys={this.state.selectedRowKeys}
                            deptList={deptList}
                        />

                        <Table
                            loading={loading}
                            dataSource={adminList}
                            rowSelection={{
                                selectedRowKeys,
                                onChange: this.onSelectChange,
                            }}
                            pagination={{
                                position: ["bottomCenter"],
                                pageSizeOptions: [5, 10, 15, 20],
                                total,
                                pageSize,
                                current,
                                onChange: this.onChange,
                            }}
                            rowKey={(record: IAdmin) => (record.user_id)}
                        >
                            <Table.Column
                                title={"用户编号"}
                                dataIndex={"user_id"}
                                key="user_id"
                            />
                            <Table.Column
                                title={"用户名称"}
                                dataIndex={"user_name"}
                                key="user_name"
                            />
                            <Table.Column
                                title={"用户昵称"}
                                dataIndex={"nick_name"}
                                key="nick_name"
                            />
                            <Table.Column
                                title={"状态"}
                                dataIndex={'status'}
                                key="switch"
                                render={(text: string, record: IAdmin) => {
                                    const { status } = record
                                    return <Switch disabled defaultChecked={status == 0 ? true : false} />
                                }}
                            />
                            <Table.Column
                                title={"部门"}
                                dataIndex={"sys_dept.dept_name"}
                                key="department"

                            />
                            <Table.Column
                                title={"手机号码"}
                                dataIndex={"phonenumber"}
                                key="phonenumber"
                            />
                            <Table.Column
                                title={"创建时间"}
                                dataIndex={"create_time"}
                                key="create_time"
                                render={(text: string) => {
                                    const formatTime = moment(new Date(text)).format('YYYY-MM-DD hh:mm:ss');
                                    return <>{formatTime}</>
                                }}
                            />
                            <Table.Column
                                title={"操作"}
                                key="action"
                                render={(text: string, record: IAdmin) => (
                                    <Space size="middle">
                                        <a onClick={
                                            () => {
                                                this.setState((state) => ({
                                                    selectedRowKeys: [record.user_id, ...state.selectedRowKeys]
                                                }))
                                                return this.showModel({
                                                    showEditAdminModel: true,
                                                })()
                                            }
                                        }> <EditOutlined />修改</a>
                                        {record.user_id === 1 ? <></> : <DeleteAdmin id={record.user_id} deleteAdmin={this.deleteAdmin} />}
                                        <a onClick={
                                            () => {
                                                message.info("开发中")
                                            }
                                        }> <KeyOutlined />重置</a>
                                    </Space>
                                )}
                            />
                        </Table>
                    </Col>
                </Row>
            </>
        )
    }
}
