<template>
    <div class="address">
        <nav-bar>
            <template v-slot:default>地址管理</template>
        </nav-bar>
        <div class="commonContent addressContent">
            <div class="addressNone" v-if="addrList.length===0">
                还没有地址信息，去添加吧！
            </div>
            <address-list 
                :addrDataList="addrList"
                :chosenAddrDataID="chosenAddrID"
            />
            <!-- <div class="addressListContent">
                <van-address-list
                    v-model="chosenAddrID"
                    :list="addrList"
                    default-tag-text="默认"
                    @add="onAdd"
                    @edit="onEdit"
                    @select="onSelect"
                />
            </div> -->
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
// import {getAddressList,setDefAddress,} from "@/network/address";
import {Toast} from "vant";
import {onMounted,toRefs,reactive} from "vue";
// import {useRouter} from "vue-router";
import AddressList from "./AddressList";

export default {
    name:"Address",
    components:{NavBar,AddressList},
    setup(){
        const data=reactive({
            addrList:[],
            chosenAddrID:0,
        });
        // const router=useRouter();

        // const onAdd=()=>{
        //     router.push({
        //         path:"/addressedit",
        //         query:{type:'add'}
        //     });
        // };
        // const onEdit=(item)=>{
        //     router.push({
        //         path:"/addressedit",
        //         query:{type:'edit',addressID:item.id}
        //     });
        // };
        // const onSelect=async (item)=>{
        //     try {
        //         const setDefAddrData=await setDefAddress(item.id);
        //         Toast("切换默认地址成功！");
        //     } catch (error) {
                
        //     }
        // };

        onMounted(async () => {
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
        })
        
        return {
            ...toRefs(data),
            // onAdd,
            // onEdit,
            // onSelect,
        };
    }
}
</script>
<style lang="scss" scope>
.address{
    .addressContent{
        .addressNone{
            position:absolute;
            top:50%;
            width:100%;
            text-align:center;
            transform:translateY(-50%);
        }
    }
}
</style>