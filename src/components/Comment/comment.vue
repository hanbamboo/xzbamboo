<template>

	<div class="commentBody">
		<div v-if="comment.length==0">
			<div class="center relative" style="justify-content: center;">
				<img src="@/assets/none_result.png" style="width: 250px; height: 250px" alt="今天暂时没有什么消息哦">
				<span class="tips">今天暂无日记哦</span>
			</div>
		</div>
		<div v-if="comment.length!=0" class="commentBox" ref="commentBox">
			<div class="comment" v-for="(item,indexComment) in comment" v-bind:index="indexComment">
				<div class="flex center">
					<el-avatar :size="30" :src="item.avatar" class="mg-r-10"/>
					<div>
						<p>{{item.responder}}</p>
					</div>
				</div>
				<p v-if="item.vaild" class="comment-content mg-l-40" v-html="item.content"></p>
				<p v-else class="comment-content mg-l-40">{{item.content}}</p>
				<div class="flex relative mg-t-10 mg-r-10">
					<span class="reply-time">{{item.time}}</span>
					<div class="right-box">
						<svg-icon icon-class="support" title="点赞" show-title="666"/>
						<svg-icon icon-class="comment" title="评论" show-title="666"
								  @click="changeCommenter(item,indexComment,-1)"/>
						<svg-icon icon-class="delete" title="删除评论"
								  @click="deleteComment(indexComment,-1)"/>
					</div>

				</div>
				<div class="reply-box"
					 v-if="item.reply.length > 0">
					<div class="reply" v-for="(reply,indexReply) in item.reply">
						<p style="margin-top: 0 !important;margin-bottom: 0 !important;">
							<span v-if="!reply.isReview" class="reply-user"
								  style="max-width: 200px;display: inline-block!important;margin-right: 10px">{{reply.responder}} :</span>
							<span class="mg-r-10 " style="display: inline!important;" v-else>
									<span class="reply-user " style="max-width: 200px;">{{reply.responder}}</span>
								&nbsp;
								<span class="reply-tip "
									  style="width: 45px!important;/*text-align: -webkit-center;*/">回复</span>
								&nbsp;
								<span class="reply-user " style="max-width: 200px;">{{reply.reviewers}} :</span>
							</span>
							<span v-if="reply.vaild" class="comment-content inline" v-html="reply.content"></span>
							<span v-else class="comment-content inline">{{reply.content}}</span>

							<span class="reply-content mg-l-10"
								  @click="changeCommenter(reply,indexComment,indexReply)">[回复]</span>
							<span class="reply-content mg-l-10"
								  @click="deleteComment(indexComment,indexReply)">[删除]</span>
						</p>
					</div>
					<span v-if="item.reply.length>maxCommentLength" class="reply-more mg-l-10"
						  @click="">查看更多 >></span>
				</div>

			</div>
			<div v-if="comment.length>maxCommentLength" class="reply-more text-algin-center mg-t-20 mg-b-20">查看全部评论 >>
			</div>

		</div>
		<div v-if="comment.length!=0" class="flex pd-t-10">
			<el-avatar :size="30" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
					   class="mg-r-5"/>
			<div class="el-textarea">
				<div class="flex" v-if="replyBox.review">
					<div class="reply-send pd-l-5 " style="color: var(--primary-black)">回复给：{{replyBox.responder}}</div>
					<svg-icon icon-class="close" title="取消评论" size="1.6"
							  @click="()=>{replyBox.review=false;this.maxCommentLine=3;this.updateMaxInputLine()}"/>
				</div>

				<el-input
						id="replyInput"
						v-model="replyBox.context"
						:rows="maxCommentLine"
						:autosize="{ minRows: maxCommentLine, maxRows: maxCommentLine }"
						type="textarea"
						placeholder="来说几句吧"
						@input="updateInput"
				/>
			</div>
			<div>
				<div class="flex" style="margin: 0px 0 5px 15px;">
					<emoji @emojiClick="emojiClick" size="1"></emoji>
					<image-upload></image-upload>
				</div>
				<span class="center send-button" @click="sendComment()">发送</span>
			</div>
		</div>

	</div>
</template>

<script>
    import SvgIcon from "../Svg/index.vue";
    import Emoji from "../Emoji/emoji.vue";
    import ImageUpload from "../ImageUpload/imageUpload.vue";


    export default {
        name: "comment",
        components: {ImageUpload, Emoji, SvgIcon},
        data() {
            return {
                emojiChoose: false,
                replyBox: {
                    indexComment: -1,
                    indexReply: -1,
                    review: false,
                    responder: '',
                    context: '',
                    vaild: true
                },
                maxCommentLength: 5,
                maxCommentLine: 3,
                comment: [
                    {
                        id: 1,
                        responder: "有毒的黄同学",
                        time: "2016-08-17 13:14:52",
                        content: "好,讲得非常好，good",
                        avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                        reply: [
                            {
                                id: 2,
                                responder: "有毒的额特未通过黄同学",
                                reviewers: "傲娇的奥利给过过过24353听歌是个啥",
                                isReview: false,
                                time: "2016-09-05 13:14:52",
                                avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                                content: "你说得对"
                            }, {
                                id: 3,
                                responder: "有毒的额特未通过黄同学",
                                reviewers: "傲娇的奥利给过过过24353听歌是个啥",
                                isReview: false,
                                time: "2016-09-05 13:14:52",
                                avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                                content: "你说得对"
                            }, {
                                id: 4,
                                responder: "有毒的额特未通过黄同学",
                                reviewers: "傲娇的奥利给过过过24353听歌是个啥",
                                isReview: false,
                                time: "2016-09-05 13:14:52",
                                avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                                content: "你说得对"
                            }, {
                                id: 5,
                                responder: "有毒的额特未通过黄同学",
                                reviewers: "傲娇的奥利给过过过24353听歌是个啥",
                                isReview: true,
                                time: "2016-09-05 13:14:52",
                                avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                                content: "你说得对"
                            }, {
                                id: 6,
                                responder: "有毒的额特未通过黄同学",
                                reviewers: "傲娇的奥利给过过过24353听歌是个啥",
                                isReview: true,
                                time: "2016-09-05 13:14:52",
                                avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                                content: "你说得对"
                            }
                        ]
                    },
                    {
                        id: 7,
                        responder: "有毒的绿同学",
                        time: "2016-08-17 13:14:52",
                        content: "饿啊改色怀疑人生",
                        avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                        reply: []
                    }
                ]
            }
        },
        methods: {
            changeCommenter(item, indexComment, indexReply) {
                this.maxCommentLine = 2;
                let temp = this.replyBox.context
                this.replyBox.context = " "
                this.$nextTick(() => {
                    this.replyBox = {
                        indexComment: indexComment,
                        indexReply: indexReply,
                        review: true,
                        responder: item.responder,
                        context: temp
                    };
                })
                // this.$emit("change", name, index);
            },
            updateInput() {
                this.$forceUpdate()
            },
            updateMaxInputLine() {
                let temp = this.replyBox.context
                this.replyBox.context = " "
                this.$nextTick(() => {
                    this.replyBox.context = temp
                })
            },
            sendComment() {
                if (this.replyBox.context.trim() == '') {
                    this.$msgInfo("评论内容不能为空")
                    return
                }
                if (/[^<>]*<[^>]+>[^<>]*/g.test(this.replyBox.context)) {
                    this.replyBox.vaild = false;
                }

                if (!this.replyBox.review) {
                    this.comment.push({
                        responder: 'me',
                        avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                        time: "2016-08-17 13:14:33",
                        content: this.replyBox.context,
                        reply: []
                    });
                    this.$nextTick(() => {
                        this.$refs.commentBox.scrollTop = this.$refs.commentBox.scrollHeight;
                    })
                } else {
                    let isReview = this.replyBox.indexReply !== -1
                    this.comment[this.replyBox.indexComment].reply.push({
                        isReview: isReview,
                        avatar: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
                        responder: 'me',
                        reviewers: this.replyBox.responder,
                        time: "2016-08-17 13:14:33",
                        content: this.replyBox.context
                    });
                }
                this.clearReplyBox()

            },
            deleteComment(indexComment, indexReply) {
                if (indexReply === -1) {
                    this.comment.splice(indexComment, 1)
                } else {
                    this.comment[indexComment].reply.splice(indexReply, 1)
                }
                this.clearReplyBox()
            },
            clearReplyBox() {
                this.maxCommentLine = 3;
                this.replyBox = {
                    indexComment: -1,
                    indexReply: -1,
                    review: false,
                    responder: '',
                    context: ''
                }
            },
            emojiClick(value) {
                this.replyBox.context = this.replyBox.context + value;
            }
        }

    }
</script>

<style scoped>

	.comment {
		margin-bottom: 15px;
		/*max-height: 260px;*/
		/*overflow-y: auto;*/
		/*overflow-x: hidden;*/
	}

	.commentBox {
		max-height: calc(80vh - 505px);
		min-height: calc(80vh - 505px);
		overflow-y: auto;
		overflow-x: hidden;
		transition: scroll-position 0.3s ease-in-out;
	}

	/*.comment>div{*/
	/*	background: var(--clear-main);*/
	/*	border-radius: 10px;*/
	/*	padding: 5px;*/
	/*}*/

	/*.comment + .comment, .reply + .reply {*/
	/*	border-top: 1px solid var(--second-black);*/
	/*}*/

	/*.comment div + p,*/
	/*.comment div:last-child p {*/
	/*	color: var(--primary-black);*/
	/*	font-weight: 500;*/
	/*	margin-top: 0;*/
	/*}*/

	.send-button {
		justify-content: center;
		width: 70px;
		height: calc(1vh + 40px);
		display: flex;
		font-size: 14px;
		cursor: pointer;
		border-radius: 10px;
		background: var(--primary-main);
		color: var(--el-color-white);
		margin-left: 5px;
	}


	.comment-content {
		color: var(--primary-black);
		font-weight: 500;
		margin-top: 0;
	}

	.comment div:first-child div p {
		color: var(--primary-black);
		font-weight: bold;
		font-size: 18px;
		display: block;
		margin: 0 0;
	}

	.comment div div p + p {
		color: var(--second-black);
		font-size: 14px;
		display: block;
	}

	.reply {
		margin: 5px 0 5px 10px;
	}

	.tips {
		font-weight: bold;
		color: var(--primary-main);
		font-size: 32px;
	}

	.reply-tip {
		font-weight: bold;
		color: var(--primary-main);
		font-size: 16px;
	}

	.reply-send {
		padding-bottom: 5px;
		border-radius: 30px;
		display: flex;
		align-items: center;
	}

	.reply-user {
		font-weight: bold;
		color: var(--primary-black);
		font-size: 16px;
		margin: 0 0 0 0;
		/*text-decoration: underline;*/
		cursor: pointer;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		transition: 0.3s;
		vertical-align: text-bottom;
	}

	.reply-user:hover {
		text-decoration: underline;
	}


	.reply-box {
		background: var(--clear-main);
		border-radius: 10px;
		margin-left: 40px;
		padding-top: 5px;
		padding-bottom: 10px;
		padding-right: 5px;
		margin-right: 5px;
	}

	.reply-time {
		margin: 0 0 5px 40px;
		color: var(--second-black);
		font-size: 14px;
	}

	.reply-time ~ div > span {
		align-items: center;
		color: var(--second-black);
		margin: 0;
		padding: 0;
	}

	.reply-content {
		font-size: 10px;
		color: var(--primary-blue);
		cursor: pointer;
		transition: 0.3s;
	}

	.reply-more {
		font-weight: bold;
		color: var(--primary-blue);
		cursor: pointer;
	}

	.reply-more:hover,
	.reply-content:hover {
		text-decoration: underline;
		text-decoration-color: var(--primary-blue);
	}

	:deep(.el-textarea) {
		position: relative;
		display: inline-block;
		width: calc(100% - 120px);
		vertical-align: bottom;
		font-size: var(--el-font-size-base);
		margin-left: 5px;
	}

	:deep(.el-textarea__inner) {
		position: relative;
		display: block;
		padding: 5px 11px;
		line-height: 1.5;
		box-sizing: border-box;
		border-radius: 10px;
		width: calc(100% + 107px) !important;
		font-size: inherit;
		font-family: inherit;
		color: var(--primary-black);
		background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
		background-image: none;
		-webkit-appearance: none;
		box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
		transition: var(--el-transition-box-shadow);
		border: none;
		resize: none;

	}

	:deep(.el-textarea__inner:hover) {
		box-shadow: 0 0 0 1px var(--second-main) inset;
	}

</style>