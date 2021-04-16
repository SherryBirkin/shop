<template>
    <div class="orderDetail">
        <nav-bar>
            <template v-slot:default>订单详情</template>
        </nav-bar>
        <div class="commonContent orderDetailContent">
            <div class="orderStatusContent orderDetailItem">
                <div class="orderStatusList">
                    <div class="orderStatusPanel">
                        <div class="orderStatusTitle">订单状态:</div>
                        <div class="orderStatusValue">{{orderStatusText}}</div>
                    </div>
                    <div class="orderStatusPanel">
                        <div class="orderStatusTitle">订单编号:</div>
                        <div class="orderStatusValue">{{totalDetail.order_no}}</div>
                    </div>
                    <div class="orderStatusPanel">
                        <div class="orderStatusTitle">下单时间:</div>
                        <div class="orderStatusValue">{{totalDetail.created_at}}</div>
                    </div>
                </div>
                <div class="orderStatusBtnGroup">
                    <van-button 
                        v-if="totalDetail.status===1"
                        class="orderStatusBtn"
                        color="rgb(151 147 150)"
                        :block="true"
                        @click="()=>showPay=true"
                    >去支付</van-button>
                    <van-button 
                        v-if="totalDetail.status===2"
                        class="orderStatusBtn"
                        type="default"
                        :block="true"
                        @click="confirmOrder"
                    >确认收货</van-button>
                </div>
            </div>
            <div class="orderConciseContent orderDetailItem">
                <div class="orderStatusList">
                    <div class="orderStatusPanel">
                        <div class="orderStatusTitle">商品金额:</div>
                        <div class="orderStatusValue">
                            <span class="orderStatusPriceSym">￥</span>{{totalDetail.amount}}
                        </div>
                    </div>
                    <div class="orderStatusPanel">
                        <div class="orderStatusTitle">配送方式:</div>
                        <div class="orderStatusValue">普通快递</div>
                    </div>
                </div>
            </div>
            <div class="orderGoodsContent">
                <van-card
                    v-for="item in goodsList"
                    :key="item.id"
                    :num="item.num"
                    :price="item.price"
                    :desc="item.goods.description"
                    :title="item.goods.title"
                    :thumb="item.goods.cover_url"
                />
            </div>
            <pay-popup 
                :showPayPopup="showPay" 
                :orderID="orderID" 
                @closePayPopupHandle="closePayPopupHandle"
                @paySuccessHandle="paySuccessHandle"
            />
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {getOrderDetail,confirmOrder,} from "@/network/order";
import {Toast} from "vant";
import {onMounted,toRefs,reactive,computed} from "vue";
import {useRouter,useRoute} from "vue-router";
import PayPopup from "./PayPopup";

export default {
    name:"OrderDetail",
    components:{NavBar,PayPopup},
    setup(){
        const data=reactive({
            totalDetail:{},
            goodsList:[],
            showPay:false,
        });
        const router=useRouter();
        const route=useRoute();
        const orderID=Number(route?.query?.orderid)||0;
        const orderStatusText=computed(()=>{
            const statusTextArr=["","已下单","已支付","等待发货","确认收货","已过期"];
            return statusTextArr[data.totalDetail?.status];
        });
        // const totalPrice=computed(()=>{
        //     data.goodsList.reduce((sum,orderGoodsItem)=>{
        //         return sum+orderGoodsItem.num*orderGoodsItem.price;
        //     },0);
        // });

        //关闭支付弹出框的回调
        const closePayPopupHandle=()=>{
            data.showPay=false;
        };
        //支付成功的回调
        const paySuccessHandle=()=>{
            router.reload();
        };
        //点击确认收货
        const confirmOrder=()=>{
            Dialog.confirm({
                title:"系统提示",
                message:"是否确认订单？"
            }).then(async ()=>{
                try {
                    const {status_code}=await confirmOrder(orderID);
                    if(status_code===204){
                        Toast("确认收货成功！");
                    }
                } catch (error) {
                    
                }
            }).catch();
        };
        const init=async ()=>{
            try {
                const orderDetailData=await getOrderDetail(orderID);    
                console.log(orderDetailData);
                data.totalDetail=orderDetailData;
                data.goodsList=orderDetailData.orderDetails.data;
            } catch (error) {
                
            }
        };
        onMounted(async () => {
            Toast.loading({message:"加载中",forbidClick:true});
            init();
            Toast.clear();
        })
        
        return {
            ...toRefs(data),
            orderID,
            orderStatusText,
            // totalPrice,
            closePayPopupHandle,
            paySuccessHandle,
            confirmOrder,
        };
    }
}
</script>
<style lang="scss" scope>
.orderDetail{
    .orderDetailContent{
        background-color:#fafafa;

        .orderDetailItem{
            background-color:#fff;
            padding:10px 20px;
            &+.orderDetailItem{
                margin-top:20px;
            }

            .orderStatusList{
                .orderStatusPanel{
                    display:flex;
                    align-items:center;
                    margin:10px 0;

                    .orderStatusTitle{
                        margin-right:8px;
                        color:$textHighColor;
                    }
                    .orderStatusPriceSym{
                        font-size:12px;
                    }
                }
            }
            .orderStatusBtnGroup{
                .orderStatusBtn{
                    margin:10px 0;
                }
            }
        }
        .orderGoodsContent{
            margin-top:20px;

            .van-card{
                background-color:#fff;

                .van-card__title{
                    font-size:14px;
                    margin-bottom:4px;
                }
            }
        }
    }
}
</style>