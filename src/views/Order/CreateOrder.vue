<template>
    <div class="createOrder">
        <nav-bar>
            <template v-slot:default>订单预览</template>
        </nav-bar>
        <div class="commonContent createOrderContent">
            <div class="addressBox">
                <div class="addressContent">
                    <div class="addressPanel">
                        <span>{{address.name}}</span>
                        <span>{{address.phone}}</span>
                    </div>
                    <div class="addressPanel">
                        {{address.province}}
                        {{address.city}}
                        {{address.county}}
                        {{address.address}}
                    </div>
                </div>
                <div class="addressBoxIconHolder" @click="()=>showAddressList=true">
                    <i class="shopiconfont icon_youjiantou addressBoxIcon" />
                </div>
            </div>
            <div class="orderGoodsListContent">
                <div class="orderGoodsPanel" v-for="item in carts" :key="item.id">
                    <div 
                        class="oderGoodsPic" 
                        :style='["backgroundImage:url("+item.goods.cover_url+")"]'
                    ></div>
                    <div class="orderGoodsDetail">
                        <div class="orderGoodsName">{{item.goods.title}}</div>
                        <div class="orderGoodsPrice">
                            <span class="orderGoodsPriceSym">￥</span>{{item.goods.price}}
                        </div>
                    </div>
                    <div class="orderGoodsNum">
                        x {{item.num}}
                    </div>
                </div>
            </div>
            <div class="createOrderPanel">
                <van-submit-bar 
                    :price="totalPrice*100" 
                    button-text="生成订单" 
                    @submit="onSubmit" 
                />
            </div>

            <pay-popup 
                :showPayPopup="showPay" 
                :orderID="orderID" 
                @closePayPopupHandle="closePayPopup"
                @paySuccessHandle="paySuccessHandle"
            />
            <!-- <van-popup 
                v-model:show="showPay" 
                closeable
                position="bottom"
                :style="{height:'40%'}"
                @close="closePayPopup"
            >
                <div class="payPopupContent">
                    <div class="payNotice">请使用支付宝扫一扫支付</div>
                    <div class="payQrCodeContent">
                        <img 
                            :src="aliPayQrCodeUrl" 
                            alt="支付宝付款二维码"
                            width="200"
                            height="200"    
                        />
                    </div>
                </div>
            </van-popup> -->
            <div class="addressListContainer" v-show="showAddressList">
                <address-list @selAddrHandle="selAddrHandle"/>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {createOrder,getOrderPreview,payOrder,payOrderStatus,} 
    from "@/network/order";
import {Toast} from "vant";
import {onMounted,toRefs,reactive,computed,onUnmounted} from "vue";
import {useRouter,onBeforeRouteLeave} from "vue-router";
import {useStore} from "vuex";
import PayPopup from "./PayPopup";
import AddressList from "@/views/Address/AddressList";

export default {
    name:"Order",
    components:{NavBar,PayPopup,AddressList},
    setup(){
        const data=reactive({
            address:{},         //收货地址信息
            carts:[],           //该订单中的商品列表
            showPay:false,      //是否显示付款二维码弹出层
            aliPayQrCodeUrl:"", //支付宝付款二维码图片地址
            orderID:0,          //当前创建的订单的id
            timer:null,         //轮询订单状态的定时器
            showAddressList:false,   //是否显示地址列表组件
        });
        const totalPrice=computed(()=>{
            return data.carts.reduce((sum,cart)=>(
                sum+cart.goods.price*cart.num
            ),0);
        });
        const router=useRouter();
        const store=useStore();
        
        // const jumpAddr=()=>{
        //     router.push("/address");
        // };
        // const circleCheckPayStatus=(orderID)=>{
        //     data.timer=setInterval(async () => {
        //         try {
        //             const statusData=await payOrderStatus(orderID);
        //             console.log(statusData);
        //             if(statusData===2){
        //                 clearInterval(data.timer);
        //                 router.push({path:"/order",query:{orderid:orderID}});
        //             }
        //         } catch (error) {
                    
        //         }
        //     }, 2000);
        // };
        const onSubmit=async ()=>{
            const addrID=data.address.id;
            if(addrID || typeof addrID==="number"){
                try {
                    const createOrderData=await createOrder({
                        address_id:addrID
                    });
                    // if(createOrderData?.status===200){
                    const orderID=createOrderData.id;
                    data.orderID=orderID;
                    Toast.loading({
                        message:"订单创建成功！正在生成付款二维码",
                        forbidClick:true
                    });
                    store.dispatch("updateCartCountAction");
                    // const {code,qr_code_url}=await payOrder(orderID,{type:"aliyun"});
                    // if(code==="10000"){
                    //     data.aliPayQrCodeUrl=qr_code_url;
                    //     data.showPay=true;
                    //     circleCheckPayStatus(orderID);
                    // }
                    // Toast.clear();
                    // }
                } catch (error) {
                    
                }
            }else{
                return false;
            }
        };
        //关闭二维码弹出层
        const closePayPopup=()=>{
            router.push({path:"orderdetail",query:{orderid:data.orderID}});
        };
        //支付成功的回调
        const paySuccessHandle=()=>{
            router.push("/order");
        };
        //初始化
        const init=async ()=>{
            Toast.loading({message:"加载中",forbidClick:true});
            try {
                const {address:addressList,carts}=await getOrderPreview();
                data.carts=carts;
                if(addressList.length>0){
                    const defAddress=addressList.filter(item=>item.is_default===1)[0];
                    if(defAddress){
                        data.address=defAddress;
                    }else{
                        data.address=addressList[0];
                    }
                }else{
                    data.address={
                        address:"还没设置收货地址，请先添加收货地址"
                    };
                }
            } catch (error) {
                
            }
            Toast.clear();
        };
        //选择地址回调。选择完地址后，重新初始化数据，获得新地址
        const selAddrHandle=()=>{
            data.showAddressList=false;
            init();
        };
        onMounted(() => {
            init();
        });
        onBeforeRouteLeave((to,from)=>{
            if(data.timer){
                clearInterval(data.timer);
            }
        });
        // onUnmounted(()=>{
        //     console.log(data.timer);
        //     if(data.timer){
        //         clearInterval(data.timer);
        //     }
        // });
        
        return {
            ...toRefs(data),
            totalPrice,
            // jumpAddr,
            onSubmit,
            closePayPopup,
            paySuccessHandle,
            selAddrHandle,
        };
    }
}
</script>
<style lang="scss" scope>
.createOrder{
    .createOrderContent{
        height: calc(100vh - 145px);

        .addressBox{
            display:flex;
            align-items:center;
            border-bottom:2px dashed #eee;

            .addressContent{
                padding:20px 0 20px 20px;
                width:calc(100% - 40px);

                .addressPanel{
                    line-height:24px;
                }
                // .addressPanel+.addressPanel{
                //     margin-top:10px;
                // }
            }
            .addressBoxIconHolder{
                width:40px;
                height:60px;
                line-height:60px;
                text-align:center;
            }
        }
        .orderGoodsListContent{
            .orderGoodsPanel{
                display:flex;
                align-items:flex-start;
                margin:24px 0;

                .oderGoodsPic{
                    width:80px;
                    height:80px;
                    @include bgContain;
                    background-image:url(~_imgPath/book3.jpg);
                    margin:0 20px;
                }
                .orderGoodsDetail{
                    width:calc(100% - 200px);

                    .orderGoodsName{
                        padding:15px 0;
                    }
                    .orderGoodsPrice{
                        padding:4px 0;
                        color:#ee0a24;

                        .orderGoodsPriceSym{
                            font-size:12px;
                        }
                    }
                }
                .orderGoodsNum{
                    width:40px;
                    margin:0 20px;
                    padding:15px 0;
                    text-align:right;
                }
            }
        }
        .van-submit-bar{
            bottom:50px;
        }
        .payPopupContent{
            text-align:center;
            padding:20px 40px;

            .payNotice{
                margin-bottom:20px;
            }
        }
    }
}
</style>