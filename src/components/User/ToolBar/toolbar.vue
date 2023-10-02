<template>
	<div>
		<div class="flex center mg-20">
			<div class="flex center">
				<div class="center" style="justify-content: center">
					<el-avatar :size="40" :src="userData.avatar" class="avatar"/>
					<div class="userAvatar-circle"></div>
				</div>

				<div class="pd-l-10">
					<span class="block font-bold pd-b-5 ">奥利给给个</span>
					<span class="block font-clear">奥利给gawfa粉色广东省二十个</span>
				</div>
			</div>
			<!--			<label-date-picker-->

			<!--				><svg-icon icon-class="calendar" title="回到某天"  size="3" ></svg-icon>-->
			<!--			</label-date-picker>-->


			<div class="flex center" style="width:70% ;justify-content: right;">
				<svg-icon icon-class="home" title="主页面" size="3" selected></svg-icon>
				<LabelDatePicker :time="time">
					<svg-icon icon-class="calendar" title="回到某天" size="3" ></svg-icon>
				</LabelDatePicker>
				<svg-icon icon-class="setting" title="我的设置" size="3"></svg-icon>
				<svg-icon icon-class="more" title="更多应用，即将推出" size="3"></svg-icon>
			</div>

		</div>

	</div>
</template>

<script>
    import SvgIcon from "../../Svg/index.vue";
    import LabelDatePicker from "../../LabelDatePicker/labelDatePicker.vue";

    export default {
        name: "userToolBar",
        components: {LabelDatePicker, SvgIcon},
        data() {
            return {
                time: new Date(),
                userData: {
                    avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                },
            }
        },
        methods: {
            errorHandler() {
                return true
            },

        }
    }
</script>

<style scoped>

	.userAvatar-circle {
		/*box-shadow:var(--shadow) 0 0 10px;*/
		border: 2px solid var(--primary-main);
		width: 50px;
		height: 50px;
		border-radius: 60px;
	}

	.avatar {
		position: absolute;
		flex-wrap: wrap;
		align-self: center;
	}

	.date-style {
		margin-left: -100px;
		width: 100px;
		z-index: -1;
	}
	:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
		right: -30px;
		width: 0;
		z-index: -99;
		height: 0;
		position: relative;
	}


</style>