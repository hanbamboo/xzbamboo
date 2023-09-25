<template>
	<div class="select-none">
		<el-popover :width="300" trigger="click">
			<template #reference>
				<svg-icon icon-class="emoji" title="表情" :size="size"/>
			</template>
			<template #default>
				<div slot="content" class="select-none">
					<el-tabs tab-position="top" @tab-click="tabClick" lazy>
						<!--循环表情包的类型-->
						<el-tab-pane :label="item.name+item.type" v-for="(item,indexType) in faceList" :key="indexType">
							<div class="gird-5">
								<!--循环表情类型的每一个表情包-->
								<div class="flex emoji select-none"
									 v-for="(emoji,indexEmoji) in faceList[tabIndex].iconArr"
									 :key="indexEmoji"
									 @click="clickEmoji(emoji.icon)">
									{{emoji.icon}}
								</div>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</template>
		</el-popover>


	</div>

</template>

<script>
    import {emojis} from './emojis.js'
    import SvgIcon from "../Svg/index.vue";

    export default {
        name: "emoji",
        components: {SvgIcon},
        props: {
            size: {
                type: [String, Number],
                default: 1.0
            }
        },
        data() {
            return {
                faceList: emojis, //引入的表情包数组
                tabIndex: 0,  //表情包的类型索引
            }
        },
        methods: {
            // 点击表情包
            clickEmoji(val) {
                this.$emit("emojiClick", val);
            },
            // 点击标签页
            tabClick(tab) {
                this.tabIndex = tab.index - 0
            }
        }

    }
</script>

<style scoped>
	.gird-5 {
		display: grid;
		grid-template-columns: 50px 50px 50px 50px 50px;
		max-height: 300px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.select-none {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	:deep(.el-tabs__item) {
		color: var(--primary-black);
		transition: 0.3s;
	}

	:deep(.el-tabs__item.is-active) {
		color: var(--primary-main);
	}

	:deep(.el-tabs__item:hover) {
		color: var(--primary-main);
		cursor: pointer;
	}

	:deep(.el-tabs__active-bar) {
		background-color: var(--primary-main);
	}

	.emoji {
		border-radius: 8px;
		font-size: 30px;
		margin: 5px !important;
		transition: 0.3s;
		cursor: pointer;
	}

	.emoji:hover {
		transform: scale(1.2);
		background: var(--shadow);
	}
</style>