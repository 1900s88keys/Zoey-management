import React, { Component } from 'react'
import { Upload, message, Avatar } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadAvatar } from '../../api';

import "./style.css"

// 将图片上传服务器
function getBase64(img: any, callback: Function) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
// 上传图片格式大小限制
function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('只允许上传jpg/png格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片大小超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

interface IProps {
    callback: Function
    imagePath?: string
}


export default class UploadAvatar extends Component<IProps> {
    state = {
        imageUrl: '',
        loading: false,
    };

    handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            if (info.file.response) {
                const { code, msg, imageUrl } = info.file.response;
                if (code === 1000) {
                    this.props.callback(imageUrl);
                } else {
                    message.info(msg)
                }
            }
            getBase64(info.file.originFileObj, (imageUrl: any) =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    render() {
        const { loading, imageUrl } = this.state;
        let imagePath = imageUrl ? imageUrl : this.props.imagePath
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>上传头像</div>
            </div>
        );

        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={uploadAvatar}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                style={{width: "64px",height: "64px"}}
            >
                {imagePath ?
                    <Avatar
                        shape="square"
                        size={81}
                        src={imagePath}
                        style={{
                            borderRadius: "10px",
                            position: "relative",
                            right: "0px"
                        }}
                    />
                    : uploadButton}
            </Upload>
        );
    }
}
