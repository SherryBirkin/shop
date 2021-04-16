import {request} from "./request";

//新增地址
export function addAddress(data){
    return request({
        url:`/api/address`,
        method:"post",
        data
    });
}

//编辑地址
export function editAddress(id,params){
    return request({
        url:`/api/address/${id}`,
        method:"put",
        params
    });
}

//删除地址
export function delAddress(id){
    return request({
        url:`/api/address/${id}`,
        method:"delete"
    });
}

//获取地址列表
export function getAddressList(){
    return request({
        url:`/api/address`
    });
}

//获取某个地址的详情
export function getAddressDetail(id){
    return request({
        url:`/api/address/${id}`
    });
}

//设置某个地址为默认地址
export function setDefAddress(id){
    return request({
        url:`/api/address/${id}/default`,
        method:"patch"
    });
}