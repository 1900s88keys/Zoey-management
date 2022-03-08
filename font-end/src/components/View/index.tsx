import React, { Component, ReactNode, Suspense } from 'react';
import router, { IRouter, unAuthRouter } from '../../router';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Spin } from 'antd';
import AppLayout from '../AppLayout'
import setAuthorizationToken from '../../utils/setAuthorizationToken';

// 根据router动态添加路由
export default class View extends Component {
    generateRoute = (routerList?: IRouter[]): ReactNode => {
        return (
            <>
                {
                    routerList?.map((reactNode) => {
                        if (reactNode.children) {
                            return (
                                <Route key={reactNode.key} path={reactNode.path} >
                                    {
                                        this.generateRoute(reactNode.children)
                                    }
                                </Route>
                            )
                        }
                        return (

                            <Route key={reactNode.key} path={reactNode.path} element={reactNode.component} />
                        )
                    })
                }
            </>
        )
    }
    render() {
        const taken = sessionStorage.getItem('LOGINTAKEN')
        if(taken) {
            setAuthorizationToken(taken);
        }else{
            return (<>
                <Navigate to="/login" />
            </>)
        }
        return (
            <>
                <Suspense fallback={<><Spin tip="Loading..."></Spin></>}>
                    <BrowserRouter>
                        <AppLayout>
                            <Suspense fallback={<><Spin tip="Loading..."></Spin></>}>
                                <Routes>
                                    <Route path={'/'} element={<Navigate to={'/dashboard'} replace />} />
                                    {
                                        this.generateRoute(router)
                                    }
                                    {
                                        unAuthRouter.map(reactNode => (
                                            <Route key={reactNode.key} path={reactNode.path} element={reactNode.component} />
                                        ))
                                    }
                                </Routes>
                            </Suspense>
                        </AppLayout>
                    </BrowserRouter>
                </Suspense>
            </>
        )
    }
}
