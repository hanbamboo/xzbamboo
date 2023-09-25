<template>
	<div class="center-box border-box radius-30">
		<div class="left  border-box mg-20" style="position: relative;">
			<UserToolBar></UserToolBar>
			<div class="tall-box-boxed">
				<div class="mg-20">
					<span class="mg-b-20 title">A</span>
					<div class="condition">
						<div class="tall-box "></div>
						<div class="tall-box mg-lr-20"></div>
						<div class="tall-box"></div>
					</div>
				</div>
				<div class="mg-r-20 mg-t-20 mg-b-20 mg-r-40">
					<span class="mg-b-20 title">B</span>
					<div class="condition">
						<div class="tall-box "></div>
						<div class="tall-box mg-lr-20"></div>
						<div class="tall-box"></div>
					</div>
				</div>
			</div>
			<div>
				sagasg
			</div>


		</div>
		<div class="right border-box mg-20 pd-20 relative">
			<Calendar :zero="calendar.zero"  :value="calendar.value"
					  @select="calendar.select"></Calendar>
			<Memory>

			</Memory>
		</div>
	</div>
</template>

<script>
    import Calendar from "@/components/Calendar/calendar.vue";
    import UserToolBar from "@/components/User/ToolBar/toolbar.vue";
    import Memory from "@/components/Memory/memory.vue"

    export default {
        name: "index",
        components: {UserToolBar, Calendar,Memory},
        data() {
            return {
                calendar: {
                    display: "2019/10/14",
                    show: true,
                    zero: true,
                    value: [2019, 10, 14], //默认日期，相识的日子
                    lunar: false, //显示农历
                    select: (value) => {
                        this.calendar.show = false;
                        this.calendar.value = value;
                        this.calendar.display = value.join("/");
                    }
                },
            }
        },
        created() {
            this.displayAndSetCalendarValue();
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
            displayAndSetCalendarValue() {
                const {year, month, day} = this.getDateInfo();
                this.calendar.display = `${year}/${month}/${day}`;
                this.calendar.value = [year, month, day];
            }


        }
    }
</script>

<style scoped>
	.tall-box-boxed {
		height: calc(30%);
		width: 100%;
		display: flex;
		justify-content: space-between;

	}

	.center-box {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 85%;
		height: 85%;
		box-shadow: var(--shadow) 10px 10px 30px;
	}

	.left {
		float: left;
		width: 70%;
		height: calc(100% - 50px);
		box-shadow: 30px 0 50px -50px var(--second-black)
	}


	.right {
		min-width: 320px;
		width: 30%;
		height: calc(100% - 50px) !important;
		float: right;

	}

	.tall-box {
		width: 130px;
		height: 100%;
		border-radius: 30px;
		transition: 0.3s;
		border: var(--primary-main) 3px dashed;
	}

	.tall-box:hover {
		background: var(--primary-main);
		box-shadow: var(--second-black) 0 0 30px -10px;
	}

	.condition {
		height: calc(100%);
		width: 100%;
		display: flex;
		min-height: 190px;
	}

	.title {
		display: block;
		font-size: 26px;
		font-weight: bold;
		color: var(--primary-black)
	}
</style>