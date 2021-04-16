<template>
    <div class="navBar">
        <div class="left" @click="returnHandle">
            <slot name="left">
                <i class="shopiconfont icon_zuojiantou returnIcon"></i>
            </slot> 
        </div>
        <div class="center">
            <slot>shop</slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
import {useRouter} from "vue-router";
export default {
    name:"NavBar",
    
    setup(){
        const router=useRouter();
        const returnHandle=()=>{
            router.go(-1);
        }
        
        return {
            returnHandle
        };
    }
}
</script>
<style lang="scss" scope>
.navBar{
    display:flex;
    background-color:$tintColor;
    color:#fff;
    position:fixed;
    left:0;
    right:0;
    top:0;
    z-index:9;
    height:45px;
    line-height:45px;
    text-align:center;
    box-shadow:0 2px 0px rgba(100,100,100,0.1);

    .left,.right{
        width:60px;
    }
    .center{
        flex:1;
    }

    .returnIcon{

    }
}
</style>