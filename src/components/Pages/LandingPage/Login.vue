<script>
import LoginPopup from '@/components/Materials/LoginPopup.vue';
export default {
    components:{
        LoginPopup
    },
    data(){
        return {
            showLogin: true,
        }
    },
    methods:{
        async handleLogin({email, password}){
            console.log(email, password);

            await this.$userManager.login(email, password);

            if (this.$userManager.isLoggedIn()) {
                this.showLogin = false;
                this.loading = false;
            }
        },
        async getModels(){
            console.log(await this.$productManager.init());
        }
    }
}
</script>

<template>
    <LoginPopup v-model="showLogin" @login="handleLogin"/>
    <Button @click="getModels">getModels</Button>
</template>