<template>
    <div class="goodsItem" @click="goodsClickHandle">
        <div 
            class="goodsImg" 
            :style="['background-image:url('+product.cover_url+')']"
        ></div>
        <div class="goodsInfo">
            <p>{{product.title}}</p>
            <span class="goodsPrice">
                <span class="goodsPriceSym">￥</span>{{product.price}}
            </span>
            <span class="goodsCollect">
                <i class="shopiconfont icon_shoucang goodsCollectIcon"></i>
                {{product.collects_count}}
            </span>
        </div>
    </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
    name:"GoodsListItem",
    props:{
        "product":{
            type:Object,
            default:()=>({})
        }
    },
    setup(props){
        const router=useRouter();
        const goodsClickHandle=()=>{
            router.push({
                path:"/detail",
                query:{id:props.product.id}
            });
        };

        return {
            goodsClickHandle
        };
    }
}
</script>
<style lang="scss" scope>
.goodsItem{
    width:46%;
    margin-top:20px;
    position:relative;

    .goodsImg{
        height:160px;
        border:1px solid #eee;
        @include bgContain;
        // background-image:url(~_imgPath/book2.jpg);
    }
    img{
        width:100%;
        border-radius:5px;
    }
    .goodsInfo{
        font-size:12px;
        overflow:hidden;
        text-align:center;
        
        p{
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            margin:3px 0;
        }
        .goodsPrice{
            color:#ff0000;
            margin-right:10px;
        }
        .goodsCollect{
            position:relative;

            .goodsCollectIcon{
                
                
            }
        }
    }
}
</style>