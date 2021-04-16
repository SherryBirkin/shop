<template>
    <div class="goodsDetail">
        <nav-bar>
            <template v-slot:default>商品详情:{{goodID}}</template>
        </nav-bar>
        <div class="detailContentMain commonContent">
            <van-image
                width="100%"
                lazy-load
                :src="detail.cover_url"
            />
            <van-card
                :num="detail.stock"
                :price="detail.price"
                :desc="detail.description"
                :title="detail.title"
            >
                <template #tags>
                    <van-tag plain type="danger">标签</van-tag>
                    <van-tag plain type="danger">标签</van-tag>
                </template>
                <template #footer>
                    <van-button 
                        type="warning"
                        @click="addCartHandle"
                    >加入购物车</van-button>
                    <van-button 
                        type="danger"
                        @click="goToCartHandle"
                    >立即购买</van-button>
                </template>
            </van-card>
            <van-tabs v-model="tabActive">
                <van-tab title="概述">
                    <div class="tabContent" v-html="detail.details">
                        
                    </div>
                </van-tab>
                <van-tab title="热评">

                </van-tab>
                <van-tab title="相关图书">
                    <goods-list :displayGoods="like_goods" />
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {useRoute,useRouter} from "vue-router";
import {ref,onMounted,reactive,toRefs} from "vue";
import {getDetail} from "@/network/detail";
import GoodsList from "_comps/content/goods/GoodsList";
import {addCart} from "@/network/cart";
import {Toast} from "vant";
import {useStore} from "vuex";

export default {
    name:"Detail",
    components:{NavBar,GoodsList},
    setup(){
        const route=useRoute();
        const router=useRouter();
        const store=useStore();
        const data=reactive({
            goodID:0,
            tabActive:1
        });
        const book=reactive({
            detail:{},
            like_goods:[]
        });

        //添加至购物车
        const addCartHandle=async ()=>{
            try {
                const addCartData=await addCart({
                        goods_id:book.detail.id,
                        num:1
                    });
                if(addCartData?.status===201 || addCartData?.status===204){
                    Toast.success("添加成功");
                    //更新表示购物车的商品数量的全局状态
                    store.dispatch("updateCartCountAction");
                }
            } catch (error) {
                
            }
        };
        //立即购买，即添加一个当前商品到购物车随即跳转至购物车页面
        const goToCartHandle=async ()=>{
            try {
                const addCartData=await addCart({
                        goods_id:book.detail.id,
                        num:1
                    });
                if(addCartData?.status===201 || addCartData?.status===204){
                    Toast.success("添加成功，显示购物车");
                    store.dispatch("updateCartCountAction");
                    router.push("/cart");
                }
            } catch (error) {
                
            }
        };
        
        onMounted(async ()=>{
            data.goodID=route.query.id;
            try {
                const getDetailData=await getDetail(route.query.id);
                book.detail=getDetailData.goods;
                book.like_goods=getDetailData.like_goods;
            } catch (error) {
                
            }
            
        });

        return {
            ...toRefs(data),
            ...toRefs(book),
            addCartHandle,
            goToCartHandle,
        };
    }
}
</script>
<style lang="scss" scope>
.goodsDetail{
    .detailContentMain{
        overflow-y:auto;

        .tabContent{
            padding:10px;

            img{
                max-width:100%;
                height:auto;
            }
        }
    }
}
</style>