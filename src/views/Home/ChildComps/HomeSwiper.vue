<template>
    <van-swipe 
        v-if="banners.length>0" 
        class="mySwiper"
        :autoplay="3000"
    >
        <van-swipe-item 
            v-for="(item,ind) in banners"
            :key="ind"
        >
            <img v-lazy="item.img_url" alt="" class="homeSwiperPic"/>
        </van-swipe-item>
    </van-swipe>
</template>

<script>
export default {
    name:"HomeSwiper",
    props:{
        "banners":{
            type:Array,
            default:()=>[]
        }
    },
    setup(){
        
        
        return {
            
        };
    }
}
</script>
<style lang="scss" scope>
.homeSwiperPic{
    width:100%;
    height:auto !important;
}
</style>