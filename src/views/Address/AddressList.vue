<template>
    <div class="addressList">
        <van-address-list
            v-model="chosenAddrID"
            :list="addrList"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            @select="onSelect"
        />
    </div>
</template>

<script>
import {getAddressList,setDefAddress,} from "@/network/address";
import {AddressList,Toast} from "vant";
import {onMounted,toRefs,reactive} from "vue";
import {useRouter} from "vue-router";

export default {
    name:"AddressList",
    props:{
        addrDataList:{
            type:Array,
            default:()=>[]
        },
        chosenAddrDataID:{
            type:Number,
            default:0
        }
    },
    setup(props,context){
        const data=reactive({
            addrList:[],
            chosenAddrID:0,
        });
        const router=useRouter();

        const onAdd=()=>{
            router.push({
                path:"/addressedit",
                query:{type:'add'}
            });
        };
        const onEdit=(item)=>{
            router.push({
                path:"/addressedit",
                query:{type:'edit',addressID:item.id}
            });
        };
        //选择回调。如果选择了，就是设置为默认地址，并执行父组件传过来的选择回调
        const onSelect=async (item)=>{
            try {
                const setDefAddrData=await setDefAddress(item.id);
                Toast("切换默认地址成功！");
                context.emit("selAddrHandle");
            } catch (error) {
                
            }
        };
        const init=async ()=>{
            try {
                const {data:addrListData}=await getAddressList();
                data.addrList=addrListData.map(item=>{
                    const {id,name,phone:tel,province,city,county,address,is_default}=item;
                    return {
                        id,
                        name,
                        tel,
                        address:province+" "+city+" "+county+" "+address,
                        isDefault:is_default===1
                    };
                });
                if(addrListData.length>0){
                    const defAddrData=addrListData.filter(item=>(
                        item.is_default===1
                    ))[0];
                    if(defAddrData){
                        data.chosenAddrID=defAddrData.id;
                    }else{
                        data.chosenAddrID=addrListData[0].id;
                    }
                }
            } catch (error) {
                
            }
        };

        onMounted(() => {
            console.log(2)
            //优先从props中获取地址列表
            if(props.addrDataList?.length>0){
                data.addrList=props.addrDataList;
                data.chosenAddrID=props.chosenAddrDataID;
            }else{
                init();
            }
        })
        
        return {
            ...toRefs(data),
            onAdd,
            onEdit,
            onSelect,
        };
    }
}
</script>
<style lang="scss" scope>
.addressList{
    position:fixed;
    top:45px;
    bottom:100px;
    left:0;
    right:0;
    z-index:101;
    background-color:#fff;
    overflow-y:auto;

    .van-address-list__bottom{
        bottom:50px;

        .van-address-list__add{
            background-color:$tintColor;
            border-color:$tintColor;
        }
    }
}
</style>