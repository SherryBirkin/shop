import { createStore } from 'vuex'
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export default createStore({
    state: {
        user:{
            //从localStorage中获取。
            //如此，已登录后，即便刷新页面也不会丢失已登录状态
            isLogin:localStorage.getItem("token")?true:false
        },
        cartCount:0
    },
    mutations,
    actions,
    getters
})
