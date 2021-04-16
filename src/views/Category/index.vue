<template>
    <div class="category">
        <nav-bar>
            <template v-slot:default>商品分类</template>
        </nav-bar>
        <div class="commonContent categoryContent">
            <div class="orderTab">
                <!--若van-tab有设置name，则v-model绑定的变量对应这些name值，click
                    回调传的参数将会是被点击的name的值，触发点击后改变绑定的变量的值-->
                <van-tabs v-model:active="activeSort" @click="orderTabHandle">
                    <van-tab title="销量排序" name="sales"></van-tab>
                    <van-tab title="价格排序" name="price"></van-tab>
                    <van-tab title="评数排序" name="comments_count"></van-tab>
                </van-tabs>
            </div>
            <van-sidebar class="leftMenu" v-model="sideBarActive">
                <van-collapse v-model="collapseActive" accordion>
                    <van-collapse-item 
                        v-for="item in categories"
                        :key="item.id"  
                        :title="item.name"
                        :name="item.name"
                    >
                        <van-sidebar-item 
                            v-for="subItem in item.children" 
                            :key="subItem.id"
                            :title="subItem.name" 
                            @click="getGoods(subItem.id)"    
                        />
                    </van-collapse-item>
                </van-collapse>
            </van-sidebar>
            <div class="goodsList">
                <div class="goodsListContent">
                    <van-card
                        v-for="item in showGoods"
                        :key="item.id"
                        :num="item.comments_count"
                        :tag="item.comments_count>0?'流行':'标签'"
                        :price="item.price"
                        :desc="item.updated_at"
                        :title="item.title"
                        :thumb="item.cover_url"
                        :lazy-load="true"
                        @click="goodsClickHandle(item.id)"
                    />
                </div>
            </div>
        </div>
        <back-top v-show="showBackTop" @bTopHandle="bTopClickHandle"></back-top>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {reactive,toRefs,onMounted,computed,nextTick,watchEffect} from "vue";
import {getCategory,getCategoryGoods} from "@/network/category";
import BetterScroll from "better-scroll";
import BackTop from "_comps/common/BackTop";
import {useRouter} from "vue-router";

export default {
    name:"Category",
    components:{NavBar,BackTop},
    setup(){
        const data=reactive({
            sideBarActive:0,
            categories:[],
            collapseActive:1,
            activeSort:"sales",
            activeCid:0,
            showBackTop:false,
        });
        //数据模型
        const goods=reactive({
            sales:{page:1,list:[]},
            price:{page:1,list:[]},
            comments_count:{page:1,list:[]},
        });
        let bScroll=reactive({});
        //显示的商品数据
        const showGoods=computed(()=>goods[data.activeSort].list);
        const router=useRouter();

        const bTopClickHandle=()=>{
            bScroll.scrollTo(0,0,500);
        };
        const goodsClickHandle=goodsID=>{
            router.push({
                path:"/detail",
                query:{id:goodsID}
            }); 
        };
        //获取三种排序数据
        const init=async ()=>{
            try {
                const salesSortData=await getCategoryGoods("sales",data.activeCid),
                    priceSortData=await getCategoryGoods("price",data.activeCid),
                    comSortData=await getCategoryGoods("comments_count",data.activeCid);
                goods.sales.list=salesSortData.goods.data;
                goods.price.list=priceSortData.goods.data;
                goods.comments_count.list=comSortData.goods.data;
            } catch (error) {
                
            }
        };
        //点击排序选项卡的回调
        const orderTabHandle=async curSortName=>{
            //点击排序选项卡后，重新获取排序数据
            const sortData=await getCategoryGoods(curSortName,data.activeCid);
            goods[curSortName].list=sortData.goods.data;
        };
        //点击左边菜单类别的回调
        const getGoods=cid=>{
            data.activeCid=cid;
            //点击左边类别后，重新获取数据
            init();
        };
        
        onMounted(async ()=>{
            try {
                const getCatData=await getCategory();
                data.categories=getCatData.categories;
                //挂载时默认按销量排序，不必全部三种排序都获取
                const salesSortData=await getCategoryGoods("sales",data.activeCid);
                goods.sales.list=salesSortData.goods.data;
            } catch (error) {
                
            }
            
            nextTick(()=>{  //这里面都是结合better-scroll插件滚动的使用
                bScroll=new BetterScroll(
                    document.querySelector(".goodsList"),
                    {
                        probeType:3, //3只要在运动时就触发scroll事件
                        click:true, //是否允许点击
                        pullUpLoad:true //是否上拉加载更多，默认false
                    }
                );
                bScroll.on("scroll",pos=>{  //滚动回调
                    data.showBackTop=(-pos.y) > 150;
                });
                bScroll.on("pullingUp",async pos=>{ //上拉回调
                    console.log('上拉加载更多');
                    const curSort=data.activeSort;
                    const queryPage=goods[curSort].page+1;
                    try {
                        const goodsSortData=await getCategoryGoods(queryPage,data.activeCid);
                        goods[curSort].list.push(...goodsSortData.goods.data);
                        goods[curSort].page+=1;
                    } catch (error) {
                        
                    }
                    
                    //完成上拉，等数据请求完成，要把新数据展示出来
                    bScroll.finishPullUp();
                    //重新计算内容高度
                    bScroll.refresh();
                    console.log(`当前页：${queryPage}，当前类型id：${curSort}`);
                });
                //监听 任何一个变量有变化都重新计算高度
                watchEffect(()=>{
                    nextTick(()=>{
                        bScroll&&bScroll.refresh();
                    });
                })
            });
        });

        return {
            ...toRefs(data),
            ...toRefs(goods),
            showGoods,
            orderTabHandle,
            getGoods,
            bTopClickHandle,
            goodsClickHandle
        };
    }
}
</script>
<style lang="scss">
.category{
    .categoryContent{
        overflow:hidden;
        
        .orderTab{
            position:fixed;
            right:0;
            left:130px;
            top:45px;
            height:50px;
            z-index:1;
            // background-color:red;

            .van-tabs--line .van-tabs__wrap{
                height:50px;
            }
        }
        .leftMenu{
            position:fixed;
            left:0;
            top:95px;
            width:130px;
            // height:calc(100% - 145px);
            // background-color:yellow;
        }
        .goodsList{
            position:absolute;
            right:0;
            top:50px;
            width:calc(100% - 130px);
            height:calc(100% - 50px);
            padding:10px;
            text-align:left !important;

            .goodsListContent{
                background-color:#fff;
            }
            .van-card__thumb{
                width:60px;
            }
        }
    }
}
</style>