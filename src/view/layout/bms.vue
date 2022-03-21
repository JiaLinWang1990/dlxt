<template>
    <div class="z-body">
        <div class="z-aside">
            <layout-aside @skip="skip"></layout-aside>
        </div>
        <div class="z-main">
            <div class="z-header">
                <layout-header></layout-header>
            </div>
            <div style="padding:20px;height: calc(100% - 70px);">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    components:{
            LayoutHeader:resolve => {require(['./header.vue'], resolve)},
            LayoutAside:resolve => {require(['./aside.vue'], resolve)},
            LayoutMain:resolve => {require(['./main.vue'], resolve)},
        },
    data() {
        return {};
    },
    mounted() {},

    methods: {
         skip(path){
                // this.currentView = path;
                this.$router.push(path)
            }
    },
};
</script>

<style lang='less' scoped>
</style>
