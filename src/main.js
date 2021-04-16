import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {Swipe,SwipeItem,Lazyload,Badge,
    Sidebar,SidebarItem,Collapse,CollapseItem,
    Tab,Tabs,Card,Image as VanImage,Tag,Button,
    Form,Field,Checkbox,CheckboxGroup,SwipeCell,
    Stepper,SubmitBar,AddressEdit,AddressList,
    Popup,Dialog,List,PullRefresh,} from "vant";

createApp(App)
    .use(Swipe).use(SwipeItem).use(Lazyload,{
        loading:require("_imgPath/defimg.jpg"),
    }).use(Badge).use(Sidebar).use(SidebarItem)
    .use(Collapse).use(CollapseItem).use(Tab)
    .use(Tabs).use(Card).use(VanImage).use(Tag)
    .use(Button).use(Form).use(Field).use(Checkbox)
    .use(CheckboxGroup).use(SwipeCell).use(Stepper)
    .use(SubmitBar).use(AddressEdit).use(AddressList)
    .use(Popup).use(Dialog).use(List).use(PullRefresh)
    .use(store).use(router).mount('#app');
