import { Breadcrumb } from 'antd'
import { nanoid } from 'nanoid'
import { Fragment, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import router, { IRouter } from '../../router'

export default function BreadcrumbText() {
    const nodeLocation = useLocation()
    const generateRoute = (routerList: IRouter[], index: number): ReactNode => {
        let path = nodeLocation.pathname.split("/");
        // console.log(path);
        return (
            <>
                {
                    routerList.map((r) => {
                        let nodePath = r.path.split('/');
                        if (path[index] === nodePath[index]) {
                            return (
                                <Fragment key={nanoid()}>
                                    <Breadcrumb.Item key={r.key}>{r.title}</Breadcrumb.Item>
                                    {r.children ? generateRoute(r.children, index + 1) : null}
                                </Fragment>
                            )
                        }
                    })
                }
            </>
        )
    }
    return (
        <Breadcrumb key={nanoid()}
            style={{
                margin: '0px 20px 0',
                lineHeight: "64px",
                height: "64px",
            }}>
            {
                generateRoute(router, 1)
            }
        </Breadcrumb >
    )
}


