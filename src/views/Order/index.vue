<template>
    <div class="order">
        <nav-bar>
            <template v-slot:default>订单管理</template>
        </nav-bar>
        <div class="commonContent orderContent">
            <van-tabs v-model:active="tabActiveName" @change="changeTabHandle">
                <van-tab title="全部" name="0"></van-tab>
                <van-tab title="已下单" name="1"></van-tab>
                <van-tab title="已支付" name="2"></van-tab>
                <van-tab title="已发货" name="3"></van-tab>
                <van-tab title="交易完成" name="4"></van-tab>
                <van-tab title="已过期" name="5"></van-tab>
            </van-tabs>
            <div class="tabContent">
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                    >
                        <div 
                            class="orderBox" 
                            v-for="item in list" 
                            :key="item.id"
                            @click="()=>$router.push({
                                path:'orderdetail',
                                query:{orderid:item.id}
                            })"
                        >
                            <div class="orderBoxHead">
                                <div class="orderNoContent orderBoxHeadItem">
                                    订单号：{{item.order_no}}
                                </div>
                                <div class="orderCreateTimeCotent orderBoxHeadItem">
                                    创建时间：{{item.created_at}}
                                </div>
                            </div>
                            <div class="orderBoxContent">
                                <van-card
                                    v-for="detailItem in item.orderDetails.data"
                                    :key="detailItem.id"
                                    :num="detailItem.num"
                                    :price="detailItem.price"
                                    :desc="detailItem.goods.description"
                                    :title="detailItem.goods.title"
                                    :thumb="detailItem.goods.cover_url"
                                />
                            </div>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {getOrderList,} from "@/network/order";
import {Toast} from "vant";
import {onMounted,toRefs,reactive} from "vue";
import {useRouter} from "vue-router";

export default {
    name:"Order",
    components:{NavBar},
    setup(){
        const data=reactive({
            page:1,                 //当前页
            tabActiveName:"0",      //当前tab的name
            list:[],              //列表数据
            loading:false,        //下拉刷新是否正在刷新
            finished:false,       //列表是否已全部获取完成
            refreshing:false,    //列表是否处于加载状态，加载过程汇总不触发load事件
        });
        const router=useRouter();
        
        const loadData=async ()=>{
            try {
                const orderListData=await getOrderList({
                    page:data.page,
                    status:Number(data.tabActiveName),
                    include:"orderDetails.goods"
                });
                const {data:orderList,meta}=orderListData;
                const {pagination:pageInfo}=meta;
                //如果当前页等于总页数，就说明数据全部请求完毕了
                if(pageInfo.total_pages===pageInfo.current_page){
                    data.finished=true;
                }
                data.page+=1;           //下次请求页数加一
                data.loading = false;   //请求已完成，设置状态为非加载中
                if(data.refreshing){//如果下拉刷新了，正在刷新中，则抛弃原有数组
                    data.list=orderList;
                    data.refreshing=false;
                }else{//如果不是刷新，则在原有数组中拼接新请求的数据数组
                    data.list=data.list.concat(orderList);
                }
            } catch (error) {
                
            }
        };
        const onLoad=()=>{
            if(!data.loading){  //只有不是正在请求加载中，才执行请求
                data.loading = true;//开始请求了，设置状态为正在请求加载中
                loadData();
            }
        };
        //刷新回调
        const onRefresh=()=>{
            data.page=1;
            //表示正在刷新
            data.refreshing=true;
            // 列表是否全部展示回归为否
            data.finished = false;

            // 重新加载数据
            // // 将 loading 设置为 true，表示处于加载状态
            // data.loading = true;
            onLoad();
        };
        //切换订单tab
        const changeTabHandle=(curTabName)=>{
            onRefresh();//切换tab后相当于刷新，重新获取列表数据
        };

        onMounted(() => {
            onRefresh();
        })
        
        return {
            ...toRefs(data),
            onLoad,
            changeTabHandle,
            onRefresh,
        };
    }
}
</script>
<style lang="scss" scope>
.order{
    .orderContent{
        background-color:#fafafa;

        // .van-tabs__content{
        //     padding:0 10px 10px;
        // }
        .tabContent{
            height:calc(100% - 54px);
        }
        .orderBox{
            background-color:#fff;
            border-radius:5px;
            padding:5px 0;
            margin:10px 0;

            .orderBoxHead{
                padding:0 20px;

                .orderBoxHeadItem{
                    margin:8px 0;
                }
            }
            .orderBoxContent{
                .van-card{
                    background-color:#fff;

                    .van-card__title{
                        font-size:14px;
                    }
                }
            }
        }
    }
}
</style>