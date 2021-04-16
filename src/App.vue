<template>
	<div id="nav">
		<router-link to="/" class="tabBarItem">
            <div class="iconPanel">
                <i class="shopiconfont icon_zhuye"></i>
            </div>
            <div class="iconText">首页</div>
        </router-link>
		<router-link to="/category" class="tabBarItem">
            <div class="iconPanel">
                <i class="shopiconfont icon_fenlei"></i>
            </div>
            <div class="iconText">分类</div>
        </router-link>
        <router-link to="/cart" class="tabBarItem">
            <div class="iconPanel">
                <van-badge :content="$store.state.cartCount" max="9" :offset="[2,3]">
                    <i class="shopiconfont icon_gouwuche"></i>
                </van-badge>
            </div>
            <div class="iconText">购物车</div>
        </router-link>
        <router-link to="/profile" class="tabBarItem">
            <div class="iconPanel">
                <i class="shopiconfont icon_geren"></i>
            </div>
            <div class="iconText">我的</div>
        </router-link>
	</div>
	<!-- <router-view class="bodyContent"/> -->
    <router-view class="bodyContent" v-slot="{Component}">
        <transition>
            <keep-alive 
                :exclude="[
                    'Detail',
                    'Cart',
                    'Address',
                    'AddressEdit',
                    'Order',
                    'CreateOrder',
                    'OrderDetail'
                ]"
            >
                <component :is="Component" />
            </keep-alive>
        </transition>
    </router-view>
</template>

<script>
import {useStore} from "vuex";
import {onMounted} from "vue";

export default {
    name:"App",
    setup(){
        const store=useStore();

        onMounted(()=>{
            /**
             * 页面挂载后就判断是否有登录，如果登录了，
             * 就获取更新购物车的商品数量到全局状态。
             * 如此，页面刷新也不会丢失购物车商品数量状态
             */
            if(store.state.user.isLogin){
                store.dispatch("updateCartCountAction");
            }
        })
    }
}
</script>
<style lang="scss">
@import "_cssPath/global";

#nav{
    background-color:#f6f6f6;
    display:flex;
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    z-index:1;

    a{
        color:$textColor;
        &.router-link-exact-active{
            color:$textHighColor;
        }
    }

    .tabBarItem{
        flex:1;
        text-align:center;
        height:50px;
        font-size:$fontSize;

        .iconPanel{
            width:24px;
            height:24px;
            margin-top:8px;
            vertical-align:middle;
            display:inline-block;       
        }
        .iconText{
            font-size:12px;
            padding-bottom:2px;
        }
    }
}

.bodyContent{
    height:calc(100vh - 50px);
}

.shopiconfont{
    font-size:21px;
}
</style>
