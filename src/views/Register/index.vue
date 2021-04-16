<template>
    <div class="register">
        <nav-bar>
            <template v-slot:default>用户注册</template>
        </nav-bar>
        <div class="commonContent">
            <div class="logo"></div>
            <van-form @submit="onSubmit">
                <van-field
                    v-model="name"
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
                <van-field
                    v-model="password_confirmation"
                    type="password"
                    name="确认密码"
                    label="确认密码"
                    placeholder="确认密码"
                    :rules="[{ required: true, message: '请填写一致密码' }]"
                />
                <van-field
                    v-model="email"
                    name="电子邮箱"
                    label="电子邮箱"
                    placeholder="电子邮箱"
                    :rules="[{ required: true, message: '请填写电子邮箱' }]"
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
            <div class="linkLogin" @click="()=>$router.push('/login')">
                已有账号？立即登录
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {reactive,toRefs} from "vue";
import {register} from "@/network/user";
import {Notify,Toast} from "vant";
import {useRouter} from "vue-router";

export default {
    name:"Register",
    components:{NavBar},
    setup(){
        const userInfo=reactive({
            name:"",
            password:"",
            password_confirmation:"",
            email:""
        });
        const router=useRouter();

        const onSubmit=async ()=>{
            //先验证
            if(userInfo.password!==userInfo.password_confirmation){
                Notify("两次输入的密码不一致！");
            }else{
                //可用帐号：eduwork@lmonkey.com use123
                try {
                    const regiData=await register(userInfo);
                    if(regiData?.status===201){
                        Toast.success("注册成功！");
                        userInfo.password="";
                        userInfo.password_confirmation="";
                        setTimeout(() => {
                            router.push("/login");
                        }, 1000);
                    }
                } catch (error) {
                    
                }
            }
        };
        
        return {
            ...toRefs(userInfo),
            onSubmit,
        };
    }
}
</script>
<style lang="scss" scope>
.register{
    .logo{
        margin:20px 0;
        height:60px;
        @include bgContain;
        background-image:url(~_imgPath/logo.jpg);
    }
    .linkLogin{
        margin:20px;
        text-align:center;
        font-size:14px;
    }
}
</style>