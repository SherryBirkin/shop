<template>
    <div class="tabCtrl">
        <div 
            :class='{"tabCtrlItem":true,"active":activeInd===ind}' 
            v-for="(item,ind) in titles"
            :key="ind"
            @click="changeActiveInd(ind)"    
        >
            <span>{{item}}</span>
        </div>
    </div>
</template>

<script>
import {ref} from "vue";

export default {
    name:"TabControl",
    props:{
        titles:{
            type:Array,
            default:()=>[]
        },
        activeInd:{
            type:Number,
            default:0
        }
    },
    setup(props,context){
        // const activeInd=ref(0);
        const changeActiveInd=ind=>{
            // activeInd.value=ind;
            context.emit("tabClickHandle",ind);
        };

        return {
            // activeInd,
            changeActiveInd
        };
    }
}
</script>
<style lang="scss" scope>
.tabCtrl{
    display:flex;
    height:40px;
    line-height:40px;
    text-align:center;
    width:100%;
    background-color:#fff;
    z-index:1;

    position:sticky;
    top:0;

    .tabCtrlItem{
        flex:1;
        
        span{
            padding:6px;
        }
        &.active{
            color:$tintColor;
            
            span{
                border-bottom:3px solid $tintColor;
            }
        }
    }
}
</style>