// hello.js
import React, {Component} from 'react'; // 这两个模块必须引入

import Loadable from 'react-loadable';

// const Win = Loadable({
//     loader: () => import('./../components/win.jsx'),
//     loading: <div/>,
// });

import Win from  './../components/win.jsx'

let name = 'All';

export default class Hello extends Component{
    render() {
        return (
            <div>
            {name}
            <Win/>
            </div>
    );
    }
}
