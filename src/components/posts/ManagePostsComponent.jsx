import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import './stylePost.less';
import { Tabs } from 'antd';
import { Table, Input, Button, Space, Row, Col, Avatar, Modal, message, Tag, Spin, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import PostService from '../../services/PostService'
import removeVietnamese from '../../utils/removeVietnamese'
import BrandService from '../../services/BrandService';
function ManagePostsComponent() {
    const { TabPane } = Tabs;
    const history = useHistory();
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(5)
    const [data, setData] = useState({ all: null, car: null, accessory: null, event: null, contest: null })
    const [key, setKey] = useState(0);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [post, setPost] = useState("");
    const { Option } = Select;
    const [brands, setBrands] = useState([]);
    const [brandSelected, setBrandSelected] = useState(null)
    const [brandSelectValue, setBrandValue] = useState(null)
    const [filteredTable, setFilteredTable] = useState(null)
    const [dt, setDt] = useState([])
    useEffect(() => {
        let all = []
        let car = []
        let accessory = []
        let event = []
        let contest = []
        const fetchData = async () => {
            const allEvent = await PostService.getPosts();
            const cars = await PostService.getPostByType(1);
            const accessories = await PostService.getPostByType(2);
            const events = await PostService.getPostByType(3);
            const contests = await PostService.getPostByType(4);
            allEvent.data.forEach((data) => {
                if (data.Status === 1) {
                    all.push(data);
                }
            })
            cars.data.forEach((data) => {
                if (data.Status === 1) {
                    car.push(data);
                }
            })
            accessories.data.forEach((data) => {
                if (data.Status === 1) {
                    accessory.push(data);
                }
            })
            events.data.forEach((data) => {
                if (data.Status === 1) {
                    event.push(data);
                }
            })
            contests.data.forEach((data) => {
                if (data.Status === 1) {
                    contest.push(data);
                }
            })
            setData({ all: all, car: car, accessory: accessory, event: event, contest: contest })
        }
        fetchData()
    }, [])
    useEffect(() => {
        BrandService.getAllBrand()
            .then(car => {
                BrandService.getAllAccessoriesBrand()
                    .then(acc => {
                        setBrands([...car.data, ...acc.data])
                    }).catch(err => console.log(err))
            }).catch(err => console.log(err))
    }, [])
    const createModal = () => {
        history.push("/tao-bai-dang");
    }
    function callback(keyValue) {
        setBrandValue(null)
        setFilteredTable(null)
        setKey(keyValue)
    }
    useEffect(() => {
        if (key === 0) {
            setDt(data.all)
            setBrandSelected(data.all)
        } else if (key === '1') {
            setDt(data.all)
            setBrandSelected(data.all)
        } else if (key === '2') {
            setDt(data.car)
            setBrandSelected(data.car)
        } else if (key === '3') {
            setDt(data.accessory)
            setBrandSelected(data.accessory)
        } else if (key === '4') {
            setDt(data.event)
            setBrandSelected(data.event)
        } else if (key === '5') {
            setDt(data.contest)
            setBrandSelected(data.contest)
        }
    }, [data, key])
    const viewPost = (record) => {
        PostService.getPostById(record.Id).then((res) => {
            console.log(res.data)
            let repo = removeVietnamese.removeVietnameseTones(record.Title)
            history.push(`/${repo.replace(/\s+/g, '-').toLowerCase()}`, { record: res.data });
        }).catch((error) => {
            console.error(error)
        })
    }
    const editPost = (record) => {
        PostService.getPostById(record.Id).then((res) => {
            history.push('/sua-bai-dang', { record: res.data });
            console.log(res.data)
        }).catch((error) => {
            console.error(error)
        })
    }
    const handleCancel = () => {
        console.log('Clicked cancel button');
        history.push('/bai-dang')
        setVisible(false);
    };
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false)
            setConfirmLoading(false)
        }, 1500)
        PostService.changePostStatus(post.Id, 2)
            .then(() => {
                setTimeout(() => { message.success("Xóa bài đăng thành công") }, 500)
                setTimeout(() => { window.location.href = "/bai-dang" }, 1500)
            })
            .catch((error) => {
                setTimeout(() => { message.error("Xóa bài đăng không thành công") }, 500)
                console.log(error)
            })
    };
    class All extends React.Component {
        state = {
            searchText: '',
            searchedColumn: '',
        };
        getColumnSearchProps = dataIndex => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Đặt lại
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                    : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.select(), 100);
                }
            },
            render: text =>
                this.state.searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[this.state.searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        });
        handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
            });
        };
        handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
        };
        render() {
            const columns = [
                {
                    title: 'Tiêu đề',
                    key: 'titleAllCar',
                    width: '35%',
                    ...this.getColumnSearchProps('Title'),
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={3} style={{ height: 50, textAlign: 'center', display: 'flex', alignItems: 'center' }}> <img alt="" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: "60px" }} src={data.FeaturedImage} /></Col>
                                <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }} className="textOverflow">{data.Title}</div></Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Mô tả',
                    dataIndex: 'Overview',
                    key: 'AllOverview',
                    width: '20%',
                    render: (data) => {
                        return <div className="textOverflow" >{data}</div>
                    }
                },
                {
                    title: 'Chuyên mục',
                    dataIndex: 'Type',
                    key: 'allType1',
                    sorter: (a, b) => a.Type - b.Type,
                    sortDirections: ['descend', 'ascend'],
                    render: (data) => {
                        let color = null
                        let text = null
                        if (data === 1) {
                            color = '#F1CA89'
                            text = 'Xe'
                        }
                        if (data === 2) {
                            color = '#CE97B0'
                            text = 'Phụ kiện'
                        }
                        if (data === 3) {
                            color = 'green'
                            text = 'Sự kiện'
                        }
                        if (data === 4) {
                            color = 'geekblue'
                            text = 'Cuộc thi'
                        }
                        return (
                            <Tag color={color} key={data}>
                                {text.toUpperCase()}
                            </Tag>
                        )
                    }
                },
                {
                    title: 'Người tạo',
                    key: 'created',
                    //sorter: (a, b) => a.CreatedDate - b.CreatedDate,
                    sortDirections: ['descend', 'ascend'],
                    render: (data) => {
                        return (
                            <Row>
                                <Avatar alt="" src={data.CreatorImage}></Avatar>
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{data.CreatorName}</div>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Các tác vụ',
                    key: 'action',
                    render: (text, record) => (
                        <Space size="middle">
                            <div className="eventDetailBtn" style={{ color: '#CCCC1B' }}
                                onClick={() => {
                                    viewPost(record)
                                }}
                            >
                                <i className="fas fa-info"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Chi tiết</span>
                            </div>
                            <div className="approveEventBtn" style={{ color: '#3ECA90' }}
                                onClick={() => {
                                    editPost(record)
                                }}
                            >
                                <i className="far fa-edit"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Sửa</span>
                            </div>
                            <div className="disapprovedEventBtn" style={{ color: '#FD7E89' }}
                                onClick={() => {
                                    setVisible(true);
                                    setPost(record)
                                }}
                            >
                                <i className="far fa-trash-alt"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Xóa</span>
                            </div>
                        </Space >
                    ),
                },
            ];

            return <Table
                rowKey="keyall"
                columns={columns}
                dataSource={filteredTable === null ? dt : filteredTable}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setPage(page)
                        setPageSize(pageSize)
                    },
                    pageSizeOptions: ['5', '10', '15', '20'],
                    showSizeChanger: true,
                    locale: { items_per_page: "/ trang" },
                }}
            />;
        }
    }
    class GetAll extends React.Component {
        state = {
            searchText: '',
            searchedColumn: '',
        };
        getColumnSearchProps = dataIndex => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Đặt lại
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                    : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.select(), 100);
                }
            },
            render: text =>
                this.state.searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[this.state.searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        });
        handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
            });
        };
        handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
        };
        render() {
            const columns = [
                {
                    title: 'Tiêu đề',
                    key: 'titleCar',
                    width: '40%',
                    ...this.getColumnSearchProps('Title'),
                    render: (data) => {
                        return (
                            <Row>
                                <Col span={3} style={{ height: 50, textAlign: 'center', display: 'flex', alignItems: 'center' }}> <img alt="" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: "60px" }} src={data.FeaturedImage} /></Col>
                                <Col span={21} style={{ display: 'flex', alignItems: 'center' }}><div style={{ paddingLeft: 10, color: '#035B81', fontWeight: '450', fontSize: 15, width: '100%' }} className="textOverflow">{data.Title}</div></Col>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Mô tả',
                    key: 'age',
                    width: '20%',
                    render: (data) => {
                        return (
                            <div className="textOverflow">{data.Overview}</div>
                        )
                    }
                },
                {
                    title: 'Người tạo',
                    key: 'address',
                    //sorter: (a, b) => a.CreatedDate - b.CreatedDate,
                    sortDirections: ['descend', 'ascend'],
                    render: (data) => {
                        return (
                            <Row>
                                <Avatar alt="" src={data.CreatorImage}></Avatar>
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>{data.CreatorName}</div>
                            </Row>
                        )
                    }
                },
                {
                    title: 'Các tác vụ',
                    key: 'action',
                    render: (text, record) => (
                        <Space size="middle">
                            <div className="eventDetailBtn" style={{ color: '#CCCC1B' }}
                                onClick={() => {
                                    viewPost(record)
                                }}
                            >
                                <i className="fas fa-info"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Chi tiết</span>
                            </div>
                            <div className="approveEventBtn" style={{ color: '#3ECA90' }}
                                onClick={() => {
                                    editPost(record)
                                }}
                            >
                                <i className="far fa-edit"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Sửa</span>
                            </div>
                            <div className="disapprovedEventBtn" style={{ color: '#FD7E89' }}
                                onClick={() => {
                                    setVisible(true);
                                    setPost(record)
                                }}
                            >
                                <i className="far fa-trash-alt"></i>&nbsp;<span style={{ textDecoration: 'underline' }}>Xóa</span>
                            </div>
                        </Space >
                    ),
                },
            ];
            return <Table
                rowKey="keyCar"
                columns={columns}
                dataSource={filteredTable === null ? dt : filteredTable}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setPage(page)
                        setPageSize(pageSize)
                    },
                    pageSizeOptions: ['5', '10', '15', '20'],
                    showSizeChanger: true,
                    locale: { items_per_page: "/ trang" },
                }}
            />;
        }
    }
    const handleSelectedBrand = (value) => {
        setBrandValue(value)
        const filterTable = dt.filter(o => Object.keys(o).some(k =>
            String(o[k])
                .includes(value)
        ))
        value !== undefined && setFilteredTable(filterTable)
    }
    const handleBrandClear = () => {
        setFilteredTable(null)
    }
    return (
        <div>
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title="Xác nhận"
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            Không
                        </Button>
                        <Button type="primary" loading={confirmLoading} onClick={handleOk}>
                            Có
                        </Button>
                    </Row>
                ]}
            >
                <div style={{ fontSize: 16 }}> Bạn có muốn xóa bài này không?</div>
            </Modal>
            <Row gutter={15}>
                <Col span={18}>
                    <Button type="primary" shape="round" onClick={createModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2 }}>Tạo bài đăng</span></Button>
                </Col>
                <Col span={6}>
                    <div style={{ float: 'right' }}>
                        <Select
                            style={{ width: '180px', marginBottom: 5, marginRight: 8 }}
                            showSearch
                            placeholder="Sắp xếp theo hãng"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleSelectedBrand}
                            onClear={handleBrandClear}
                            value={brandSelectValue}
                            allowClear
                        >
                            {brandSelected !== null && Array.from(new Set(brandSelected.map(obj => obj.BrandId))).map((brand) => (
                                brands.map((brands) => (
                                    brand === brands.Id && <Option key={brands.Id} value={brands.Id}>{brands.Name}</Option>
                                ))
                            ))}
                        </Select>
                    </div>
                </Col>
            </Row>
            <Tabs type="card" onChange={callback}>
                <TabPane tab="Tất cả" key="1">
                    <Spin size="large" spinning={dt === null ? true : false}>
                        <All />
                    </Spin>
                </TabPane>
                <TabPane tab="Xe" key="2">
                    <Spin size="large" spinning={data === null ? true : false}>
                        <GetAll />
                    </Spin>
                </TabPane>
                <TabPane tab="Phụ kiện" key="3">
                    <Spin size="large" spinning={dt === null ? true : false}>
                        <GetAll />
                    </Spin>
                </TabPane>
                <TabPane tab="Sự kiện" key="4">
                    <Spin size="large" spinning={dt === null ? true : false}>
                        <GetAll />
                    </Spin>
                </TabPane>
                <TabPane tab="Cuộc thi" key="5">
                    <Spin size="large" spinning={dt === null ? true : false}>
                        <GetAll />
                    </Spin>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default ManagePostsComponent;