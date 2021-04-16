<template>
    <div class="recommend">
        <div class="recommendItem" 
            v-for="recItem in rec.slice(0,4)"
            :key="recItem.id">
            <a href="" @click.prevent="jumpDetail(recItem.id)">
                <img v-lazy="recItem.cover_url" alt=""/>
                <div>{{recItem.title}}</div>
            </a>
        </div>
    </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
    name:"RecommendView",
    props:{
        rec:{
            type:Array,
            default:()=>[]
        }
    },
    setup(){
        const router=useRouter();
        const jumpDetail=(id)=>{
            router.push({
                path:"/detail",
                query:{id}
            });
        }
        
        return {
            jumpDetail
        };
    }
}
</script>
<style lang="scss" scope>
.recommend{
    display:flex;
    width:100%;
    text-align:center;
    padding:15px 0 30px;
    border-bottom:8px solid #eee;
    font-size:12px;

    .recommendItem{
        flex:1;
        
        img{
            width:70px;
            height:70px;
            margin-bottom:10px;
        }
    }
}
</style>