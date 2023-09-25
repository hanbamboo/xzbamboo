<template>
	<div class="memory mg-t-10">
		<div class="center relative" v-if="false">
			<img src="@/assets/none_result.png" style="width: 250px; height: 250px" alt="今天暂时没有什么消息哦">
			<span class="tips">今天暂无日记哦</span>
		</div>

		<div>
			<comment></comment>
		</div>


		<!--		<div class="note-boxed relative" v-if="false">-->
		<!--			<div class="note-box">-->

		<!--			</div>-->
		<!--			<div class="comment-box" v-if="false">-->
		<!--				<div class="comment">-->
		<!--				</div>-->
		<!--				<span class="send">发送</span>-->
		<!--			</div>-->

		<!--		</div>-->
	</div>
</template>

<script >
    import SvgIcon from "../Svg/index.vue";
    import Comment from "../Comment/comment.vue";

    export default {
        name: "index",
        components: {Comment, SvgIcon},
        data() {
            return {}
        },
        methods: {
            getDateInfo() {
                const date = new Date();
                return {
                    year: String(date.getFullYear()),
                    month: String(date.getMonth() + 1).padStart(2, '0'),
                    day: String(date.getDate()).padStart(2, '0'),
                };
            },
        }
    }
</script>

<style scoped>
	.memory {
		position: absolute;
		width: 93%;
		/*border-radius: 30px;*/
		/*height: 45%;*/
		/*background: var(--clear-main);*/
	}

	.comment-box {
		width: 100%;
		height: 15%;
		display: flex;
	}

	.note-box {
		width: 95%;
		height: 75%;
		background: var(--white-milk);
		border-radius: 30px;
		display: grid;
		margin: 10px;

	}

	.note-boxed {
		display: flex;
		height: 100%;
		flex-flow: column;
	}

	.comment {
		width: 70%;
		background: var(--white);
		height: 100%;
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: 10px;
		border-radius: 30px;
	}

	.send {
		width: 22%;
		background: var(--primary-main);
		color: var(--white);
		height: 100%;
		margin-right: 10px;
		border-radius: 30px;
		margin-bottom: 10px;
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.center {
		display: grid;
		align-content: center;
		justify-items: center;

	}

	.tips {
		font-weight: bold;
		color: var(--primary-main);
		font-size: 32px;
	}


</style>