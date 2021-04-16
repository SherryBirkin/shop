<template>
    <van-popup 
        v-model:show="showPay" 
        closeable
        position="bottom"
        :style="{height:'40%'}"
        @open="openHanle"
        @close="closeHandle"
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
    </van-popup>
</template>

<script>
import {reactive,toRefs,computed,onMounted,onUpdated} from "vue";
import {payOrder,payOrderStatus,} from "@/network/order";
import {Toast} from "vant";

export default {
    name:"PayPopup",
    props:{
        showPayPopup:{
            type:Boolean,
            default:false
        },
        orderID:{
            type:Number,
            default:0
        }
    },
    setup(props,context){
        const data=reactive({
            aliPayQrCodeUrl:"",
            timer:null,
        });
        const showPay=computed({
            get(){
                return props.showPayPopup;
            },
            set(val){
                // context.emit("closePayPopup");
                if(!val){
                    context.emit("closePayPopupHandle");
                }
            }
        });

        const closeHandle=()=>{
            if(data.timer){
                clearInterval(data.timer);
            }
            context.emit("closePayPopupHandle");
        };
        const circleCheckPayStatus=(orderID)=>{
            data.timer=setInterval(async () => {
                try {
                    const statusData=await payOrderStatus(orderID);
                    if(statusData===2){
                        clearInterval(data.timer);
                        context.emit("paySuccessHandle");
                    }
                } catch (error) {
                    
                }
            }, 2000);
        };
        const init=async ()=>{
            try {
                const {code,qr_code_url}=await payOrder(props.orderID,{type:"aliyun"});
                if(code==="10000"){
                    data.aliPayQrCodeUrl=qr_code_url;
                    data.showPay=true;
                    circleCheckPayStatus(props.orderID);
                }
                Toast.clear();
            } catch (error) {
                console.log(error)
            }
        };
        const openHanle=()=>{init();};
        // onMounted(()=>{
        //     console.log(222)
        //     init();
        // });
        // onUpdated(()=>{init();});
        
        return {
            ...toRefs(data),
            showPay,
            openHanle,
            closeHandle,
        };
    }
}
</script>
<style lang="scss" scope>
.payPopupContent{
    text-align:center;
    padding:20px 40px;

    .payNotice{
        margin-bottom:20px;
    }
}
</style>