<template>
    <div>
        <div class="pane-content">
            <div class="content-chart">dddd</div>
            <div class="content-params">eeee</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
            
        };
    },
    mounted() {
    },

    methods: {
    },
};
</script>

<style lang='less' scoped>
    .pane-content{
            display: flex;
            .content-chart{
                width:calc(100% - 300px);
                height:600px;
            }
        .content-params{
            width:300px;
            height:600px;
        }
    }
</style>
