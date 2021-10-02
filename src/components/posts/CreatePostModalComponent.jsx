import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Form, Input, Modal, Row, Select, Upload } from 'antd';
import React, { useState } from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory } from "react-router-dom";
import storage from "../../services/ImageFirebase";
import './styles.less';

function CreatePostModalComponent() {
    const { Option } = Select;
    const history = useHistory();
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [imageURL, setImageURL] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    function handleBack() {
        history.goBack();
    }
    //Form
    const [form] = Form.useForm()
    const onFinish = (values) => {
        console.log(values)
        console.log(data.getData())
    };
    const handleCancel = () => setVisible(false);
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setVisible(true)
        setPreviewImage(file.url || file.preview)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };
    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    //end Featured Image
    //Editor
    // const [editorState, setEditorState] = useState(EditorState.createEmpty());
    // const onEditorStateChange = editorState => {
    //     setEditorState(editorState);
    // }
    // const uploadImageCallBack = (file) => {
    //     return new Promise(
    //         (resolve, reject) => {
    //             console.log('Uploading image...');
    //             firebaseUpload(file)
    //                 .then(link => {
    //                     resolve({ data: { link } });
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 })
    //         }
    //     );
    // }
    // const firebaseUpload = (file) => {
    //     return new Promise(
    //         (resolve, reject) => {
    //             const uploadTask = storage.ref(`images/${file.name}`).put(file)
    //             uploadTask.on('state_changed',
    //                 (snapshot) => {
    //                     console.log(snapshot)
    //                 },
    //                 (error) => {
    //                     console.log(error)
    //                 }, (complete) => {
    //                     //Gets link back
    //                     storage.ref('images').child(file.name).getDownloadURL()
    //                         .then(url => resolve(url))
    //                 })
    //         }
    //     );
    // }
    const normFile = () => {
        return data.getData();
    };
    const fearturedImage = () => {
        return imageURL;
    }
    const customRequest = ({ file, onSuccess, onError }) => {
        const storageRef = storage.ref(`/images/${file.name}`)
        const task = storageRef.put(file);
        task.on("state_changed",
            function (snapshot) {
            },
            function (error) {
                onError(error)
            },
            () => {
                storageRef
                    .getDownloadURL()
                    .then(function (downloadURL) {
                        console.log("File available at", downloadURL);
                        onSuccess(setImageURL(downloadURL))
                    });
            }
        )
    }
    //end Editor
    const [data, setData] = useState('');
    class MyUploadAdapter {
        constructor(loader) {
            this.loader = loader;
        }
        // Starts the upload process.
        upload() {
            return this.loader.file.then(
                file =>
                    new Promise((resolve, reject) => {
                        const storageRef = storage.ref(`/images/${file.name}`)
                        const uploadTask = storageRef.put(file);
                        uploadTask.on(
                            "state_changed", // or 'state_changed'
                            function (snapshot) {
                            },
                            function (error) {
                                switch (error.code) {
                                    case "storageRef/unauthorized":
                                        reject(" User doesn't have permission to access the object");
                                        break;

                                    case "storageRef/canceled":
                                        reject("User canceled the upload");
                                        break;

                                    case "storageRef/unknown":
                                        reject(
                                            "Unknown error occurred, inspect error.serverResponse"
                                        );
                                        break;
                                    default:
                                }
                            },
                            function () {
                                // Upload completed successfully, now we can get the download URL
                                uploadTask.snapshot.ref
                                    .getDownloadURL()
                                    .then(function (downloadURL) {
                                        // console.log("File available at", downloadURL);
                                        resolve({
                                            default: downloadURL
                                        });
                                    });
                            }
                        );
                    })
            );
        }
    }
    function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader);
        };
    }
    DecoupledEditor
        .create(document.querySelector('.document-editor__editable'), {
            extraPlugins: [MyCustomUploadAdapterPlugin],

        })
        .then(editor => {
            const toolbarContainer = document.querySelector('.document-editor__toolbar');

            toolbarContainer.appendChild(editor.ui.view.toolbar.element);

            window.editor = editor;

            setData(editor)
        })
        .catch(err => {
            console.error(err);
        });
    return (
        <>
            <div className="body123">
                <div><Button className="buttonBack" onClick={handleBack}><ArrowLeftOutlined /> Back</Button></div>
                <div className="title">Tạo bài đăng</div>
                {/* Others */}
                <Modal
                    animation={false}
                    visible={visible}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                {/* End Others */}
                <div>
                    <Form
                        layout="vertical"
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{ margin: '0px 50px ' }}
                    >
                        <Form.Item
                            label={<div style={{ letterSpacing: '1px' }}>Ảnh đại diện</div>}
                            name="featuredImage"
                            getValueFromEvent={fearturedImage}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                customRequest={customRequest}
                                //accept="image/png, image/jpeg"
                                // multiple="true"
                                // beforeUpload={() => false}
                                accept=".png,.jpeg,.jpg"
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label={<div style={{ letterSpacing: '1px' }}>Chuyên mục</div>}
                            name="category"
                        >
                            <Select
                                labelInValue
                                style={{ width: 160 }}
                                placeholder="Chọn chuyên mục"
                            >
                                <Option value="1">Xe</Option>
                                <Option value="2">Phụ Kiện</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="title"
                            label={<div style={{ letterSpacing: '1px' }}>Tiêu đề</div>}
                        >
                            <Input.TextArea
                                size="large"
                                maxLength={200} showCount
                                autoSize={{ minRows: 1, maxRows: 10 }}
                                placeholder="Nhập tiêu đề"
                            />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={<div style={{ letterSpacing: '1px' }}>Mô tả</div>}
                            rules={[
                                {
                                    // required: true,
                                },
                            ]}
                        >
                            <Input.TextArea
                                size="large"
                                showCount maxLength={1000}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                placeholder="Nhập Mô tả"
                            />
                        </Form.Item>
                        <Form.Item
                            label={<div style={{ letterSpacing: '1px' }}>Nội dung</div>}
                            name="contents"
                            getValueFromEvent={normFile}
                        >
                            <CKEditor
                                editor={DecoupledEditor}
                                onReady={editor => {
                                    editor.ui.getEditableElement().parentElement.insertBefore(
                                        editor.ui.view.toolbar.element,
                                        editor.ui.getEditableElement()
                                    );
                                    editor.plugins.get("FileRepository").createUploadAdapter = loader => {
                                        return new MyUploadAdapter(loader);
                                    };
                                    setData(editor);
                                    editor.editing.view.change((writer) => {
                                        writer.setStyle(
                                            "min-height",
                                            "300px",
                                            editor.editing.view.document.getRoot()
                                        );
                                    });
                                }}
                            />
                        </Form.Item>
                        {/* <Form.Item
                            name={['publish', 'name']}
                            label="Publish"
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                            />
                        </Form.Item> */}
                        <Form.Item>
                            <Row style={{ float: 'right' }}>
                                <Button style={{ marginBottom: 30 }} onClick={handleBack} >Hủy</Button>
                                <Button style={{ marginBottom: 30, marginLeft: 10 }} type="primary" htmlType="submit">Hoàn tất</Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default CreatePostModalComponent;
