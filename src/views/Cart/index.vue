<template>
    <div class="cart">
        <nav-bar>
            <template v-slot:default>
                购物车(<span>{{$store.state.cartCount}}</span>)
            </template>
        </nav-bar>
        <div class="commonContent cartContent">
            <div class="cartBox">
                <div class="cartBody">
                    <van-checkbox-group 
                        ref="checkboxGroup" 
                        v-model="checkedIDList"
                        @change="checkGroupChangeHandle"
                    >
                        <van-swipe-cell 
                            v-for="(item,ind) in list"
                            :key="item"
                        >
                            <div class="cartGoodsItem">
                                <van-checkbox class="goodsCheckbox" :name="item.id"/>
                                <div 
                                    class="goodsPic" 
                                    :style="['backgroundImage:url('+item.goods.cover_url+')']"
                                ></div>
                                <div class="goodsDesc">
                                    <div class="goodsTitle">
                                        <span>{{item.goods.title}}</span>
                                        <span>x{{item.goods.stock}}</span>
                                    </div>
                                    <div class="goodsBtn">
                                        <div class="price">
                                            <span class="priceSym">￥</span>{{item.goods.price}}
                                        </div>
                                        <van-stepper 
                                            integer 
                                            :min="1" 
                                            :max="item.goods.stock" 
                                            :model-value="item.num"
                                            :name="item.id"
                                            @change="cartStepperChangeHandle"
                                        />
                                    </div>
                                </div>
                            </div>
                            <template #right>
                                <van-button square text="删除" type="danger" class="deleteBtn" 
                                    @click="delGoodsInCart(item.id)" />
                            </template>
                        </van-swipe-cell>
                    </van-checkbox-group>
                </div>
                <van-submit-bar 
                    class="submitAll" 
                    :price="total*100"
                    button-text="结算" 
                    @submit="cartSubmitHandle"   
                >
                    <van-checkbox 
                        v-model:checked="isAllChecked"
                        @click="allCheckedClickHandle"    
                    >全选</van-checkbox>
                </van-submit-bar>
            </div>
            <div class="cartEmpty" v-if="list.length===0">
                <i class="shopiconfont icon_gouwuche1 cartEmptyIcon"></i>
                <div class="cartEmptyText">购物车空空如也</div>
                <van-button 
                    type="success" 
                    round  
                    class="cartEmptyBtn"
                    size="small"
                    @click="goToShop"
                >前往选购</van-button>
            </div>
        </div>
        
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {reactive,toRefs,onMounted,computed} from "vue";
import {useRouter,afterEach} from "vue-router";
import {Toast,Notify} from 'vant';
import {getCart,modifyCart,checkedCart,deleteCartItem} from "@/network/cart";
import {useStore} from "vuex";

export default {
    name:"Cart",
    components:{NavBar},
    setup(){
        const data=reactive({
            list:[],            //购物车数据列表
            checkedIDList:[],   //选中的商品购物车id列表
            isAllChecked:false  //是否全选
        });
        const router=useRouter();
        const store=useStore();

        //初始化购物车数据
        const init=async ()=>{
            Toast.loading({message:"加载中……",forbidClick:true});
            try {
                //带上 include=goods，返回的购物车数据包括当前商品数据
                const getCartData=await getCart("include=goods");
                data.list=getCartData.data;
                data.checkedIDList=getCartData.data.filter(item=>item.is_checked===1).map(item=>item.id);
                Toast.clear();
            } catch (error) {
                
            }
        };
        /**
         * 某步进器发生改变后，即购物车中某商品的数量发生改变后，
         * 须请求改变服务器上的数据。
         * @param {Number} val 改变后的数值
         * @param {Object} detail 当前步进器对象
         */
        const cartStepperChangeHandle=async (val,detail)=>{
            try {
                Toast.loading({message:"修改中……",forbidClick:true});
                const modifyCartData=await modifyCart(detail.name,{num:val});
                //由于list是用来显示的数据，它还没更新，故也要更新list
                for(let i of data.list){
                    const curListData=data.list[i];
                    if(curListData.id===detail.name){
                        data.list[i].num=val;
                        break;
                    }
                }
                Toast.clear();
            } catch (error) {
                
            }
        };
        const goToShop=()=>{
            router.push("/");
        };
        //复选框组改变处理
        const checkGroupChangeHandle=(newCheckedIDList)=>{
            console.log(newCheckedIDList);
            //改变全选状态
            data.isAllChecked=newCheckedIDList.length===data.list.length;
            //改变服务器上购物车选中状态
            checkedCart({cart_ids:newCheckedIDList});
        };
        //全选点击处理
        const allCheckedClickHandle=(e)=>{
            if(data.isAllChecked){  //原本是全选，点击后要改成全不选，清空全部选中
                data.checkedIDList=[];
            }else{
                data.checkedIDList=data.list.map(item=>item.id);
            }
        };
        //删除商品
        const delGoodsInCart=(id)=>{
            deleteCartItem(id).then(res=>{
                init();
                store.dispatch("updateCartCountAction");
            });
        };
        //点击结算，创建订单
        const cartSubmitHandle=()=>{
            if(data.checkedIDList.length===0){
                Notify({type:"warning",message:"还没选择商品！"});
                return false;
            }else{
                setTimeout(() => {
                    router.push("/createorder");
                }, 1000);
            }
        };
        //通过计算属性计算总价
        const total=computed(()=>{
            if(data.checkedIDList.length!==0){
                return data.checkedIDList.reduce((sum,curID)=>{
                    const curCartData=data.list.filter(item=>item.id===curID)[0];
                    const curGoodsData=curCartData.goods;
                    return sum+curCartData.num*curGoodsData.price;
                },0);
            }else{
                return 0;
            }
        });

        onMounted(()=>{
            init();
        });
        
        return {
            ...toRefs(data),
            cartStepperChangeHandle,
            goToShop,
            checkGroupChangeHandle,
            allCheckedClickHandle,
            delGoodsInCart,
            total,
            cartSubmitHandle,
        };
    }
}
</script>
<style lang="scss" scope>
.cart{
    .cartContent{
        height: calc(100vh - 145px);
        
        .cartBox{
            position:relative;

            .cartGoodsItem{
                display:flex;
                margin-top:10px;
                
                .goodsCheckbox{
                    margin-left:10px;
                }
                .goodsPic{
                    margin:0 10px;
                    width:100px;
                    height:100px;
                    @include bgContain;
                    background-image:url(~_imgPath/book1.jpg);
                }
                .goodsDesc{
                    flex:1;
                    margin:0 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    .goodsTitle,.goodsBtn{
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin:5px 0;
                    }
                    .priceSym{
                        font-size:12px;
                    }
                }
            }
            // .van-swipe-cell__right{
            //     display: flex;
            //     align-items: center;
            // }
            .deleteBtn{
                height:100%;
            }
            .van-submit-bar{
                bottom:50px;
            }
        }
        .cartEmpty{
            text-align:center;
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            width:100%;

            .cartEmptyIcon{
                font-size:80px;
                color:#aaa;
            }
            .cartEmptyBtn{
                width:40%;
                margin:20px 0;
            }
        }
    }
}
</style>