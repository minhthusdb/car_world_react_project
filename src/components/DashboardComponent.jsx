import { Bar, Column } from '@ant-design/charts';
import { CarOutlined } from '@ant-design/icons';
import { Col, Row, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import car from '../images/car.png';
import number2 from '../images/number2.png';
import number3 from '../images/number3.png';
import number1 from '../images/number_1.png';
import accessory from '../images/wheel.png';
import AccessoryService from '../services/AccessoryService';
import AccountService from '../services/AccountService';
import BrandService from '../services/BrandService';
import CarService from '../services/CarService';
import ContestService from '../services/ContestService';
import EventService from '../services/EventService';
import ExchangeService from '../services/ExchangeService';
import PostService from '../services/PostService';
import ProposalService from '../services/ProposalService';
import './testStyle.less';
function DashboardComponent() {
    const [post, setPost] = useState([])
    const [users, setUsers] = useState({ user: [], admin: [], manager: [] });
    const [brands, setBrands] = useState({ all: [], car: [], accessory: [] });
    const [carAccessory, setCarAccessory] = useState({ car: [], accessory: [] });
    const [data, setData] = useState({ topExchange: [], exchangeCar: '', exchangeAccessory: '', contest: '', event: '', proposal: '' })
    useEffect(() => {
        const fetchData = async () => {
            const proposal = await ProposalService.getProposalByMonth()
            const contest = await EventService.getEventByMonth()
            const event = await ContestService.getContestByMonth()
            const exchangeCar = await ExchangeService.getExchangeCarByMonth()
            const exchangeAccessory = await ExchangeService.getExchangeAccessoryByMonth()
            const topExchange = await ExchangeService.getTopExchangeByMonth()
            setData({ topExchange: topExchange.data, exchangeCar: exchangeCar.data, exchangeAccessory: exchangeAccessory.data, contest: contest.data, event: event.data, proposal: proposal.data })
        }
        fetchData()
    }, [])
    //user
    useEffect(() => {
        const fetchData = async () => {
            let admin = []
            let manager = []
            const user = await AccountService.getAllUser();
            const repo = await AccountService.getAdminAndManger();
            repo.data.forEach((data) => {
                if (data.RoleId === 1) {
                    admin.push(data)
                }
                if (data.RoleId === 2) {
                    manager.push(data)
                }
            })
            setUsers({ user: user.data, admin: admin, manager: manager })
        }
        fetchData()
    }, [])
    //brand
    useEffect(() => {
        const fetchData = async () => {
            const car = await BrandService.getAllBrand()
            const accessory = await BrandService.getAllAccessoriesBrand()
            const all = await BrandService.getAllBrand()
            setBrands({ all: all.data, car: car.data, accessory: accessory.data })
        }
        fetchData()
    }, [])
    //car accessory
    useEffect(() => {
        const fetchData = async () => {
            const car = await CarService.getAllGeneration()
            const accessory = await AccessoryService.getAccessories()
            setCarAccessory({ car: car.data, accessory: accessory.data })
        }
        fetchData()
    }, [])
    useEffect(() => {
        PostService.getPosts().then((result) => { setPost(result.data) })
    }, [])
    const accountData = [
        {
            name: 'Người dùng',
            value: users.user.length,
        },
        {
            name: 'Quản lý',
            value: users.manager.length,
        },
        {
            name: 'Quản trị',
            value: users.admin.length,
        }
    ];
    const brandData = [
        {
            name: 'Hiệu xe',
            value: brands.car.length,
        },
        {
            name: 'Hiệu phụ kiện',
            value: brands.accessory.length,
        }
    ];
    const CEP = [
        {
            type: 'Sự kiện',
            sales: data.event,
        },
        {
            type: 'Cuộc thi',
            sales: data.contest,
        },
        {
            type: 'Đề xuất',
            sales: data.proposal,
        }
    ]
    const configAccount = {
        data: accountData,
        xField: 'value',
        yField: 'name',
        seriesField: 'name',
        legend: { position: 'top-left' },
        label: {
            position: 'right',
            offset: 4,
        },
    }
    const configBrand = {
        data: brandData,
        xField: 'value',
        yField: 'name',
        seriesField: 'name',
        legend: { position: 'top-left' },
        label: {
            position: 'right',
            offset: 4,
        },
    }
    const configCEP = {
        data: CEP,
        xField: 'type',
        yField: 'sales',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            type: {
                alias: '类别',
            },
            sales: {
                alias: 'Tổng',
            },
        },
    };
    return (
        <>
            <Spin size="large" spinning={data.exchangeCar === '' ? true : false}>
                <div className="container mw-100">
                    <Row gutter={15} style={{ marginBottom: 20, borderRadius: 15 }}>
                        <Col style={{ backgroundColor: '#e76f51', borderRadius: 20, padding: 25, width: '32.5%', marginRight: 15 }}>
                            <Row gutter={5}>
                                <Col span={15}>
                                    <div style={{ color: 'white', letterSpacing: 2 }}>
                                        <div style={{ fontSize: '16px' }}>Tổng số<br /> <span style={{ fontWeight: 'bold' }}>XE</span></div>
                                        <div style={{ fontSize: 50 }}>{carAccessory.car.length}</div>
                                    </div>
                                </Col>
                                <Col span={9} style={{ opacity: '0.7', display: 'flex', alignItems: 'center' }}>
                                    {<CarOutlined style={{ fontSize: 78, color: 'white' }} />}
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{ backgroundColor: '#00b4d8', borderRadius: 20, padding: 25, width: '32.5%', marginRight: 15 }}>
                            <Row gutter={5}>
                                <Col span={15}>
                                    <div style={{ color: 'white', letterSpacing: 2 }}>
                                        <div style={{ fontSize: '16px' }}>Tổng số<br /> <span style={{ fontWeight: 'bold' }}>PHỤ KIỆN</span></div>
                                        <div style={{ fontSize: 50 }}>{carAccessory.accessory.length}</div>
                                    </div>
                                </Col>
                                <Col span={9} style={{ opacity: '0.7', display: 'flex', alignItems: 'center' }}>
                                    {<i className="fas fa-peace" style={{ fontSize: 78, color: 'white' }} />}
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{ backgroundColor: '#5e60ce', borderRadius: 20, padding: 25, width: '32.4%' }}>
                            <Row gutter={5}>
                                <Col span={15}>
                                    <div style={{ color: 'white', letterSpacing: 2 }}>
                                        <div style={{ fontSize: '16px' }}>Tổng số<br /> <span style={{ fontWeight: 'bold' }}>BÀI ĐĂNG</span></div>
                                        <div style={{ fontSize: 50 }}>{post.length}</div>
                                    </div>
                                </Col>
                                <Col span={9} style={{ opacity: '0.7', display: 'flex', alignItems: 'center' }}>
                                    <i className="far fa-clone" style={{ fontSize: 78, color: 'white' }} />
                                </Col>
                            </Row>
                        </Col>
                        {/* <Col span={4} style={{ backgroundColor: '#52b69a', borderRadius: 20, padding: 15, marginRight: 15 }}>
                            <Row gutter={5}>
                                <Col span={15}>
                                    <div style={{ color: 'white', letterSpacing: 2 }}>
                                        <div style={{ fontSize: '14px' }}>Tổng số<br /> <span style={{ fontWeight: 'bold' }}>TÀI KHOẢN</span></div>
                                        <div style={{ fontSize: 50 }}>{users.user.length}</div>
                                    </div>
                                </Col>
                                <Col span={9} style={{ opacity: '0.7', display: 'flex', alignItems: 'center' }}>
                                    {<UserSwitchOutlined style={{ fontSize: 68, color: 'white' }} />}
                                </Col>
                            </Row>
                        </Col> */}
                    </Row>
                    <Row gutter={30} style={{ marginLeft: '-8px', marginRight: '-22px' }}>
                        <Col style={{ padding: 10, backgroundColor: "white", borderRadius: 15, height: 250, width: '65.7%' }}>
                            <Row gutter={15}>
                                <Col span={8} style={{ height: 250 }}>
                                    <div className="exchangeC" style={{ backgroundColor: "#e9c46a", borderRadius: 20, padding: 10, height: '92%' }}>
                                        <span style={{ color: 'white', letterSpacing: 1, fontWeight: 500, fontSize: 15 }}>Trao đổi xe THÁNG {moment().format('MM')}</span>
                                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                                            <img alt="" src={car} style={{ height: '131px', width: '100%' }} />
                                            <span style={{ color: 'white', fontWeight: 700, fontSize: '30px' }}>{data.exchangeCar} <span style={{ letterSpacing: 2, fontSize: 18 }}>giao dịch</span></span>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="exchangeE" style={{ backgroundColor: "#e9c46a", borderRadius: 20, padding: 10 }}>
                                        <span style={{ color: 'white', letterSpacing: 1, fontWeight: 500, fontSize: 15 }}>Trao đổi phụ kiện THÁNG {moment().format('MM')}</span>
                                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                                            <img src={accessory} alt="" style={{ maxHeight: '131px', maxWidth: '100%' }} />
                                            <div><span style={{ color: 'white', fontWeight: 700, fontSize: '30px' }}>{data.exchangeAccessory} <span style={{ letterSpacing: 2, fontSize: 18 }}>giao dịch</span></span></div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="exchangeEx" style={{ backgroundColor: "#e9c46a", borderRadius: 20, padding: 10, height: '92%' }}>
                                        <span style={{ color: 'white', letterSpacing: 1, fontWeight: 500, fontSize: 15 }}>Hiệu nổi bật THÁNG {moment().format('MM')}</span>
                                        <div style={{ marginTop: 10, color: 'white', fontSize: 18, letterSpacing: 1 }}>
                                            {data.topExchange.length === 0 && <div>Không có dữ liệu</div>}
                                            <div>{data.topExchange.length !== 0 && (data.topExchange[0] !== undefined && <div><img alt="" src={number1} style={{ height: '28px', marginTop: '-3px' }} />&nbsp;{data.topExchange[0].BrandName}</div>)}</div>
                                            <div>{data.topExchange.length !== 0 && (data.topExchange[1] !== undefined && <div style={{ marginTop: 2 }}><img alt="" src={number2} style={{ height: '28px', marginTop: '-3px' }} />&nbsp;{data.topExchange[1].BrandName}</div>)}</div>
                                            <div>{data.topExchange.length !== 0 && (data.topExchange[2] !== undefined && <div style={{ marginTop: 2 }}><img alt="" src={number3} style={{ height: '28px', marginTop: '-3px' }} />&nbsp;{data.topExchange[2].BrandName}</div>)}</div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div style={{ textAlign: 'center', paddingBottom: 20, marginTop: '-6px', fontWeight: 500, fontSize: 14 }}>Trao đổi <span style={{ color: '#FF7878' }}>THÁNG {moment().format('MM')}</span></div>
                        </Col>
                        <Col style={{ width: '34.3%' }}>
                            <Column {...configCEP} style={{ padding: 20, backgroundColor: "white", borderRadius: 15, height: 250 }} />
                            <div style={{ textAlign: 'center', paddingBottom: 20, paddingTop: 5, fontWeight: 500, fontSize: 14 }}>Sự kiện, cuộc thi, đề xuất <span style={{ color: '#FF7878' }}>THÁNG {moment().format('MM')}</span></div>
                        </Col>
                    </Row>
                    <Row gutter={15} style={{ marginLeft: '-15px', marginRight: '-15px' }}>
                        <Col span={12}>
                            <Bar {...configAccount} style={{ padding: 20, backgroundColor: "white", borderRadius: 15, height: 250 }} />
                            <div style={{ textAlign: 'center', paddingBottom: 30, paddingTop: 5, fontWeight: 500, fontSize: 14 }}>Tổng số tài khoản</div>
                        </Col>
                        {/* <Col span={8}>
                            <Bar {...configCarAccessory} style={{ padding: 20, backgroundColor: "white", borderRadius: 15, height: 250 }} />
                            <div style={{ textAlign: 'center', paddingBottom: 30, paddingTop: 5, fontWeight: 500, fontSize: 14 }}>Tổng số xe và phụ kiện</div>
                        </Col> */}
                        <Col span={12}>
                            <Bar {...configBrand} style={{ padding: 20, backgroundColor: "white", borderRadius: 15, height: 250 }} />
                            <div style={{ textAlign: 'center', paddingBottom: 30, paddingTop: 5, fontWeight: 500, fontSize: 14 }}>Tổng số thương hiệu</div>
                        </Col>
                    </Row>
                </div>
            </Spin>
        </>
    )
}

export default DashboardComponent;