import { createRouter, createWebHistory } from 'vue-router'
import store from "../store";
import {Notify} from "vant";

const Cart = () => import("../views/Cart");
const Category = () => import("../views/Category");
const Detail = () => import("../views/Detail");
const Home = () => import("../views/Home");
const Profile = () => import("../views/Profile");
const Register = () => import("../views/Register");
const Login = () => import("../views/Login");
const Address = () => import("../views/Address");
const AddressEdit = () => import("../views/Address/AddressEdit");
const CreateOrder = () => import("../views/Order/CreateOrder");
const Order = () => import("../views/Order");
const OrderDetail = () => import("../views/Order/OrderDetail");

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta:{
            title:"图书-首页"
        }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
        meta:{
            title:"图书-购物车",
            isAuthRequired:true
        }
    },
    {
        path: '/category',
        name: 'Category',
        component: Category,
        meta:{
            title:"图书-商品分类"
        }
    },
    {
        path: '/detail',
        name: 'Detail',
        component: Detail,
        meta:{
            title:"图书-商品详情"
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta:{
            title:"图书-个人中心",
            isAuthRequired:true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta:{
            title:"图书-用户注册"
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta:{
            title:"图书-用户登录"
        }
    },
    {
        path: '/address',
        name: 'Address',
        component: Address,
        meta:{
            title:"图书-地址管理",
            isAuthRequired:true
        }
    },
    {
        path: '/addressedit',
        name: 'AddressEdit',
        component: AddressEdit,
        meta:{
            title:"图书-地址编辑",
            isAuthRequired:true
        }
    },
    {
        path: '/order',
        name: 'Order',
        component: Order,
        meta:{
            title:"图书-订单管理",
            isAuthRequired:true
        }
    },
    {
        path: '/createorder',
        name: 'CreateOrder',
        component: CreateOrder,
        meta:{
            title:"图书-订单预览",
            isAuthRequired:true
        }
    },
    {
        path: '/orderdetail',
        name: 'OrderDetail',
        component: OrderDetail,
        meta:{
            title:"图书-订单详情",
            isAuthRequired:true
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to,from,next)=>{
    //如果没登录，在这里到login
    if(to.meta.isAuthRequired && !store.state.user.isLogin){
        Notify("您还没登录，请先登录！");
        return next("/login");
    }else{
        next();
    }

    document.title=to.meta.title;
});

export default router
