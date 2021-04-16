<template>
    <div class="backTop" @click="clickHandle">
        <i class="shopiconfont icon_fanhuidingbu"></i>
    </div>
</template>

<script>
export default {
    name:"BackTop",
    
    setup(props,ctx){
        const clickHandle=()=>{
            ctx.emit("bTopHandle");
        }
        
        return {
            clickHandle
        };
    }
}
</script>
<style lang="scss" scope>
.backTop{
    position:fixed;
    right:10px;
    bottom:100px;
    z-index:10;
    background-color:rgba(66,185,131,0.6);
    color:#fff;
    width: 46px;
    height: 46px;
    line-height: 50px;
    text-align: center;

    .shopiconfont{
        font-size:36px;
    }
}
</style>