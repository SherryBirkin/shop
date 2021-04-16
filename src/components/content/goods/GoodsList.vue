<template>
    <div class="goodsList">
        <goods-list-item 
            v-for="item in displayGoods"
            :key="item"
            :product="item"
        ></goods-list-item>
    </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";

export default {
    name:"GoodsList",
    props:{
        "displayGoods":{
            type:Array,
            default:()=>[]
        }
    },
    components:{GoodsListItem},
    setup(){
        
        
        return {
            
        };
    }
}
</script>
<style lang="scss" scope>
.goodsList{
    display:flex;
    flex-wrap:wrap;
    justify-content:space-around;
    padding:5px;
}
</style>