<template>
    <div class="addressEdit">
        <nav-bar>
            <template v-slot:default>{{title}}</template>
        </nav-bar>
        <div class="commonContent addressEditContent">
            <van-address-edit
                :area-list="areaList"
                :show-postal="false"
                show-delete
                show-set-default
                show-search-result
                :search-result="searchResult"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                @delete="onDelete"
                :address-info="addrInfo"
            />
        </div>
    </div>
</template>

<script>
import NavBar from "_comps/common/NavBar";
import {editAddress,addAddress,delAddress,getAddressDetail} from "@/network/address";
import {AddressEdit,Toast} from "vant";
import {onMounted,toRefs,reactive} from "vue";
import {useRouter,useRoute} from "vue-router";
import {areaList} from "@/assets/js/area";

export default {
    name:"Address",
    components:{NavBar},
    setup(){
        const data=reactive({
            areaList:[],
            searchResult:"",
            addrInfo:{},
            title:""
        });
        const router=useRouter();
        const route=useRoute();
        const {type,addressID}=route.query;

        //保存地址
        const onSave=async (content)=>{
            const {name,tel:phone,province,city,county,addressDetail:address,isDefault}=content;
            const reqData={name,phone,province,city,county,address,is_default:isDefault?1:0};
            // const diffPartObj={
            //         phone:content.tel,
            //         address:content.addressDetail,
            //         is_default:content.isDefault?1:0
            //     },
            //     reqData={...content,...diffPartObj};

            try {
                if(type==="add"){
                    const addAddressData=await addAddress(reqData);
                    if(addAddressData.status===201){
                        Toast(`添加成功！`);
                        setTimeout(()=>{router.back()},1500);
                    }
                }else if(type==="edit"){
                    const editAddressData=await editAddress(addressID,reqData);
                    if(editAddressData.status===204){
                        Toast(`修改成功！`);
                        setTimeout(()=>{router.back()},1500);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        };
        //删除地址
        const onDelete=async ()=>{
            try {
                const delAddressData=await delAddress(addressID);
                if(delAddressData.status===204){
                    Toast(`删除成功！`);
                    setTimeout(()=>{router.back()},1500);
                }
            } catch (error) {
                
            }
        };
        //根据省市区获取区代码
        const getAreaCode=({province,city,county})=>{
            const {province_list,city_list,county_list}=areaList;
            const areaListEntries=Object.entries(county_list);
            let code=0;
            for(let [curCountyCode,curCountyName] of areaListEntries){
                if(curCountyName===county){
                    const curProvinceCode=String(curCountyCode).substring(0,2)+"0000";
                    const curCityCode=String(curCountyCode).substring(0,4)+"00";
                    if(province_list[curProvinceCode]===province && city_list[curCityCode]===city){
                        code=curCountyCode;
                        break;
                    }
                }
            }
            return code;
        };

        onMounted(async () => {
            data.areaList=areaList;
            if(type==="edit"){  //如果是编辑地址，则要初始化原有数据
                data.title="编辑地址";
                try {
                    const {id,name,phone:tel,province,city,county,address:addressDetail,is_default}=await getAddressDetail(addressID);
                    const areaCode=getAreaCode({province,city,county});
                    data.addrInfo={id,name,tel,province,city,county,addressDetail,isDefault:is_default===1,areaCode};
                } catch (error) {
                    
                }
            }else if(type==="add"){
                data.title="新增地址";
            }
        })
        
        return {
            ...toRefs(data),
            onSave,
            onDelete,
        };
    }
}
</script>
<style lang="scss" scope>

</style>