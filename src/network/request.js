import axios from "axios";
import {Notify,Toast} from "vant";
import router from "../router";

export function request(config){
    const axiosIns=axios.create({
        baseURL:"https://api.shop.eduwork.cn",
        timeout:20000
    });
    
    //请求拦截
    axiosIns.interceptors.request.use(config=>{
        //如果有接口需要认证才能访问，就在此统一设置
        const token=window.localStorage.getItem("token");
        if(token){
            config.headers.Authorization=`Bearer${token}`;
        }
        //直接放行
        return config;
    },err=>{
    
    });
    
    //响应拦截
    axiosIns.interceptors.response.use(res=>{
        console.log(res);
        return res.data?res.data:res;
    },err=>{
        //如果有需要授权才能访问的接口，则跳转到login
        if(err.response.status===401){
            Toast.fail("请先登录！");
            setTimeout(()=>{
                router.push("/login");
            },500);
        }

        //如果有错误，此处处理，显示错误信息
        let errData=err.response.data;
        const {errors,message}=errData;
        if(errors){
            Notify( Object.values(errors)[0][0] );
        }else{
            Notify( message );
        }
    });

    return axiosIns(config);
}

