<template>
	<div class="component-upload-image">
		<el-popover :width="320" trigger="click">
			<template #reference>
				<svg-icon icon-class="image" title="图片" size="1"/>
			</template>
			<template #default>
				<el-upload class="grid-3"
						   action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
						   list-type="picture-card"
						   :on-success="uploadFileSuccess"
						   :before-upload="handleBeforeUpload"
						   :limit="limit"
						   :on-error="handleUploadError"
						   :on-exceed="handleExceed"
						   name="file"
						   :on-remove="handleRemove"
						   :show-file-list="true"
						   :auto-upload="false"
						   :file-list="fileList"
						   :on-preview="handlePictureCardPreview"
						   :class="{hide: this.fileList.length >= this.limit} "
						   :data="propData"
						   multiple
						   ref="upload"
				>
					<i class="el-icon-plus"></i>
				</el-upload>

				<!-- 上传提示 -->
				<div class="el-upload__tip" slot="tip" v-if="showTip">
					请上传
					<template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
					<template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
					的文件
				</div>

				<el-dialog
						:visible.sync="dialogVisible"
						title="预览"
						width="800"
						append-to-body
				>
					<img
							:src="dialogImageUrl"
							style="display: block; max-width: 100%; margin: 0 auto"
					/>
				</el-dialog>
			</template>
		</el-popover>


	</div>
</template>

<script>

    export default {
        props: {
            value: [String, Object, Array],

            propData: {
                type: Object,
                default: () => {
                },
            },

            // 图片数量限制
            limit: {
                type: Number,
                default: 9,
            },
            // 大小限制(MB)
            fileSize: {
                type: Number,
                default: 5,
            },
            // 文件类型, 例如['png', 'jpg', 'jpeg']
            fileType: {
                type: Array,
                default: () => ["png", "jpg", "jpeg"],
            },
            // 是否显示提示
            isShowTip: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                fileNum: '',  // 单词递归上传的文件
                upFileList: '',//需要依次上传的待传列表
                percentTotal: 0,//总上传个数
                percentNow: 0,//当前上传个数
                showDesc: '',//结束文案
                showPercent: false,//显示上传进度条
                time: null,// change事件是否结束 是否可以直接调手动上传事件（目前设置1.5s）
                disabledUpload: false,//正在上传中 禁止再次选择文件上传
                dialogImageUrl: "",
                dialogVisible: false,
                hideUpload: false,
                fileList: [],
                fileLists: []
            };
        },
        watch: {
            value: {
                handler(val) {
                    if (val) {
                        // 首先将值转为数组
                        const list = Array.isArray(val) ? val : this.value.split(',');
                        console.log(this.fileList);
                        // 然后将数组转为对象数组
                        this.fileList = list.map(item => {
                            if (typeof item === "string") {
                                if (item.indexOf(this.baseUrl) === -1) {
                                    item = {name: this.baseUrl + item, url: this.baseUrl + item};
                                } else {
                                    item = {name: item, url: item};
                                }
                            }
                            return item;
                        });
                    } else {
                        this.fileList = [];
                        return [];
                    }
                },
                deep: true,
                immediate: true
            },

        },
        computed: {
            // 是否显示提示
            showTip() {
                return this.isShowTip && (this.fileType || this.fileSize);
            },
        },
        methods: {
            clearFiles() {
                this.fileList = [];
                this.fileLists = [];
            },
            // 删除图片
            handleRemove(file, fileList) {
                const findex = this.fileList.map(f => f.name).indexOf(file.name);
                this.fileList.splice(findex, 1);
                this.$emit("input", this.listToString(this.fileList));
            },
            // // 上传成功回调
            // handleUploadSuccess(response,file,fileList) {debugger
            //   file.response=response.data.data;
            //   this.fileList.push(file);
            //   this.$emit("input", this.listToString(this.fileList));
            //   // this.loading.close();
            //
            // },
            // 上传成功回调
            handleUploadSuccess(response, file, fileList) {
                debugger
                console.log(this.propData)
                for (let i = 0; i < fileList.length; i++) {

                    this.fileList.push({name: fileList[i].response.fileName, url: fileList[i].response.fileName});
                }
                this.$emit("input", this.listToString(this.fileList));
                this.loading.close();
            },

            //上传成功回调2

            uploadFileSuccess(response, file, fileList) {
                if (response.code == 200) {
                    // file.response=;
                    console.log("res", response)
                    this.fileLists.push({name: response.fileName, url: response.fileName});
                    console.log("fileLists", this.fileLists)

                    if (file.name == fileList[fileList.length - 1].name) {

                        this.$emit("input", this.listToString(this.fileLists));
                    }

                    this.loading.close();
                } else {
                    this.$message.error(response.data.message);//文件上传错误提示
                }

                this.loading.close();
            },
            // 上传前loading加载
            handleBeforeUpload(file) {
                let isImg = false;
                if (this.fileType.length) {
                    let fileExtension = "";
                    if (file.name.lastIndexOf(".") > -1) {
                        fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
                    }
                    isImg = this.fileType.some(type => {
                        if (file.type.indexOf(type) > -1) return true;
                        if (fileExtension && fileExtension.indexOf(type) > -1) return true;
                        return false;
                    });
                } else {
                    isImg = file.type.indexOf("image") > -1;
                }

                if (!isImg) {
                    this.$message.error(
                        `文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`
                    );
                    return false;
                }
                if (this.fileSize) {
                    const isLt = file.size / 1024 / 1024 < this.fileSize;
                    if (!isLt) {
                        this.$message.error(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
                        return false;
                    }
                }
                this.loading = this.$loading({
                    lock: true,
                    text: "上传中",
                    background: "rgba(0, 0, 0, 0.7)",
                });
            },
            // 文件个数超出
            handleExceed() {
                this.$msgError(`上传文件数量不能超过 ${this.limit} 个!`)
            },
            // 上传失败
            handleUploadError() {
                this.$msgError("上传失败")
                this.loading.close();
            },
            // 预览
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // 对象转成指定字符串分隔
            listToString(list, separator) {
                let strs = "";
                separator = separator || ",";
                for (let i in list) {
                    strs += list[i].url + separator;
                }
                return strs != '' ? strs.substr(0, strs.length - 1) : '';
            },
        }
    };
</script>

<style scoped lang="scss">
	.gird-3 {
		display: grid;
		grid-template-columns: 50px 50px 50px;

	}

	// .el-upload--picture-card 控制加号部分
	:deep(.hide .el-upload--picture-card) {
		display: none;
	}

	// 去掉动画效果
	:deep( .el-list-enter-active),
	:deep( .el-list-leave-active) {
		transition: all 0s;
	}

	:deep(.el-list-enter, .el-list-leave-active) {
		opacity: 0;
		transform: translateY(0);
	}

	:deep(.el-popper is-light el-popover) {
		min-width: 176px !important;
		max-width: 320px !important;
	}

	:deep(.el-upload-list--picture-card) {
		--el-upload-list-picture-card-size: 90px;
	}

	:deep(.el-upload--picture-card) {
		--el-upload-picture-card-size: 90px;
	}
</style>

