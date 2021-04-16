<template>
    <div class="profile">
        <nav-bar>
            <template v-slot:default>个人中心</template>
        </nav-bar>
        <div class="commonContent profileContent">
            <div class="userContent">
                <div class="userPortait"
                    :style='[`backgroundImage:url(${user.avatar?user.avatar:user.avatar_url})`]'
                ></div>
                <div class="userDetailContent">
                    <div class="userDetailPanel">
                        昵称：{{user.name}}
                    </div>
                    <div class="userDetailPanel">
                        登录名：{{user.email}}
                    </div>
                    <div class="userDetailPanel">
                        账号状态：{{user.is_locked===0?"正常":"冻结"}}
                    </div>
                </div>
            </div>
            <div class="profileItemContent">
                <div class="profileItemPanel" @click="goTo('/collect')">
                    <span>我的收藏</span>
                    <i class="shopiconfont icon_youjiantou profileItemIcon"></i>
                </div>
                <div class="profileItemPanel" @click="goTo('/order')">
                    <span>我的订单</span>
                    <i class="shopiconfont icon_youjiantou profileItemIcon"></i>
                </div>
                <div class="profileItemPanel" @click="goTo('/setting')">
                    <span>账号管理</span>
                    <i class="shopiconfont icon_youjiantou profileItemIcon"></i>
                </div>
                <div class="profileItemPanel" @click="goTo('/address')">
                    <span>地址管理</span>
                    <i class="shopiconfont icon_youjiantou profileItemIcon"></i>
                </div>
                <div class="profileItemPanel" @click="goTo('/about')">
                    <span>关于我们</span>
                    <i class="shopiconfont icon_youjiantou profileItemIcon"></i>
                </div>
            </div>
            <div class="logoutBtnPanel">
                <van-button round block 
                    type="primary" 
                    color="#44b883"
                    @click="logoutHandle"
                >
                    退出登录
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {logout,getUser} from "@/network/user";
import {Toast} from "vant";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {onMounted,toRefs,reactive} from "vue";

export default {
    name:"Profile",
    components:{NavBar},
    setup(){
        const router=useRouter();
        const store=useStore();
        const data=reactive({
            user:{}
        });

        const logoutHandle=async ()=>{
            try {
                const logoutData=await logout();
                if(logoutData?.status===204){
                    Toast.success("退出成功！");
                    window.localStorage.removeItem("token");
                    store.commit("setIsLogin",false);
                    setTimeout(() => {
                        router.push("/login");
                    }, 500);
                }
            } catch (error) {
                
            }
        };
        //公共跳转方法
        const goTo=(path,query)=>{
            router.push({path,query:query||{}});
        };

        onMounted(async () => {
            const userData=await getUser();
            data.user=userData;
        })
        
        return {
            logoutHandle,
            goTo,
            ...toRefs(data)
        };
    }
}
</script>
<style lang="scss" scope>
.profile{
    .profileContent{
        padding:5px 10px;

        .logoutBtnPanel{
            padding:10px 10%;
            text-align:center;
        }
        .userContent{
            padding:20px;
            background-color:#b3adb3;
            color:#fff;
            display:flex;
            align-items:center;
            border-radius:5px;

            .userPortait{
                height:50px;
                width:50px;
                margin-right:20px;
                @include bgContain;
                // background-image:url(~_imgPath/book3.jpg);
            }
            .userDetailContent{
                .userDetailPanel{
                    overflow:hidden;
                    text-overflow:ellipsis;
                    word-break:keep-all;
                    white-space:nowrap;
                    margin:4px 0;
                }
            }
        }
        .profileItemContent{
            margin:20px 0;

            .profileItemPanel{
                height:61px;
                line-height:60px;
                padding-left:10px;
                position:relative;
                border-bottom:1px solid #efefef;

                .profileItemIcon{
                    position:absolute;
                    right:0;
                    top:0;
                    height:60px;
                    line-height:60px;
                }
            }
        }
    }
}
</style>