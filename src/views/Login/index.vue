<template>
    <div class="login">
        <nav-bar>
            <template v-slot:default>用户登录</template>
        </nav-bar>
        <div class="commonContent">
            <div class="logo"></div>
            <van-form @submit="onSubmit">
                <van-field
                    v-model="email"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
                <div style="margin: 16px;">
                    <van-button round block 
                        type="primary" 
                        native-type="submit"
                        color="#44b883"
                    >
                    提交
                    </van-button>
                </div>
            </van-form>
            <div class="linkRegister" @click="()=>$router.push('/register')">
                没有账号？立即注册
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {reactive,toRefs} from "vue";
import {login} from "@/network/user";
import {useRouter} from "vue-router";
import {Toast} from "vant";
import {useStore} from "vuex";

export default {
    name:"Login",
    components:{NavBar},
    setup(){
        const userInfo=reactive({
            email:"",
            password:""
        });
        const router=useRouter();
        const store=useStore();

        const onSubmit=async ()=>{
            try {
                const loginData=await login(userInfo);
                // if(loginData?.status===201){
                    //将token保存到本地localStorage
                    window.localStorage.setItem("token",loginData.access_token);
                    //在vuex中设置全局状态
                    store.commit("setIsLogin",true);
                    
                    Toast.success("登录成功！");
                    userInfo.email="";
                    userInfo.password="";
                    setTimeout(()=>{
                        router.go(-1);
                    },500);
                // }
            } catch (error) {
                
            }
        };
        
        return {
            ...toRefs(userInfo),
            onSubmit
        };
    }
}
</script>
<style lang="scss" scope>
.login{
    .logo{
        margin:20px 0;
        height:60px;
        @include bgContain;
        background-image:url(~_imgPath/logo.jpg);
    }
    .linkRegister{
        text-align:center;
        font-size:14px;
        margin:20px 0;
    }
}
</style>