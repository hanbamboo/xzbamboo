<template>
	<div class="calendar">
		<div class="calendar-info">
			<svg-icon icon-class="today" title="回到今天" size="2.0" @click="setToday"/>
			<!-- {{monthString}} -->
			<div class="month">
				<div class="month-inner" :style="{'top':-(this.month*52)+'px'}">
					<span v-for="m in months">{{m}}</span>
				</div>
			</div>
			<div class="calendar-tools">
				<svg-icon icon-class="pageup" title="上一个月" @click="prev"/>
				<svg-icon icon-class="pagedown" title="下一个月" @click="next"/>
			</div>
			<div class="yearname">
				<el-dropdown trigger="click">
					<div class="year" title="选择年份">{{year}}</div>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item v-for="item in ourYear" :key="item" :disabled="item==year"
											  @click="changeYear(item)">{{item}}
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>

			</div>
		</div>

		<table cellpadding="5">
			<tbody>
			<tr v-for="(day,k1) in days" style="display: flex">
				<td v-for="(child,k2) in day" :class="{'selected':child.selected,'disabled':child.disabled}"
					@click="selectChoose(k1,k2,$event)">
					<!--					<span v-if="k1==0&&k2==0">←</span>-->
					<!--					<span v-else-if="k1==5&&k2==6">→</span>-->

					<!--					<span >{{child.day}} 🤍</span>-->
					<!--					<span >{{child.day}} 🧡</span>-->
					<span>{{child.day}} {{child.type===1?'🤍':child.type===2?'🧡':'-'}} </span>

					<!--					<span :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}">{{child.day}}</span>-->
				</td>
			</tr>
			</tbody>
		</table>

		<div class="calendar-years" :class="{'show':yearsShow}">
			<span v-for="y in years" @click.stop="selectYear(y)" :class="{'active':y==year}">{{y}}</span>
		</div>

	</div>
</template>

<script>
    import calendar from '../../api/utils/calendar.js'
    import SvgIcon from "../Svg/index.vue";

    export default {
        name: "calendar",
        components: {SvgIcon},
        props: {
            // 默认日期
            value: {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 屏蔽的日期
            disabled: {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 是否显示农历
            lunar: {
                type: Boolean,
                default: false
            },
            // 自定义月份
            months: {
                type: Array,
                default: function () {
                    return window.navigator.language.toLowerCase() == "zh-cn" ? ['一　月', '二　月', '三　月', '四　月', '五　月', '六　月', '七　月', '八　月', '九　月', '十　月', '十一月', '十二月'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                }
            },
            // 自定义事件
            events: {
                type: Object,
                default: function () {
                    return {}
                }
            },
        },
        data() {
            return {
                years: [],
                yearsShow: false,
                year: 0,
                month: 0,
                day: 0,
                days: [],
                multiDays: [],
                today: [],
                ourYear: [],
                festival: {
                    lunar: {
                        "1-1": "春节",
                        "1-15": "元宵节",
                        "2-2": "龙头节",
                        "5-5": "端午节",
                        "7-7": "七夕节",
                        "7-15": "中元节",
                        "8-15": "中秋节",
                        "9-9": "重阳节",
                        "10-1": "寒衣节",
                        "10-15": "下元节",
                        "12-8": "腊八节",
                        "12-23": "祭灶节",
                    },
                    gregorian: {
                        "1-1": "元旦",
                        "2-14": "情人节",
                        "3-8": "妇女节",
                        "3-12": "植树节",
                        "4-5": "清明节",
                        "5-1": "劳动节",
                        "5-4": "青年节",
                        "6-1": "儿童节",
                        "7-1": "建党节",
                        "8-1": "建军节",
                        "9-10": "教师节",
                        "10-1": "国庆节",
                        "12-24": "平安夜",
                        "12-25": "圣诞节",
                    },
                },
                rangeBegin: [],
                rangeEnd: [],
                dailyType: [[0, 0, 0, 0, 1, 0, 0], [1, 2, 0, 1, 2, 0, 0], [0, 1, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 1, 0, 0, 0], [0, 1, 0, 0, 2, 0, 0]]
            }
        },
        watch: {
            events() {
                this.render(this.year, this.month)
            },
            value() {
                this.init();
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                let now = new Date();
                this.year = now.getFullYear();
                this.month = now.getMonth();
                this.day = now.getDate();
                this.ourYear = [];
                for (let i = 2019; i <= this.year; i++) {
                    this.ourYear.push(i)
                }
                if (this.value.length > 0) {

                    [this.year, this.month, this.day] = this.value.map(Number);
                    this.month -= 1;

                }
                this.render(this.year, this.month);
                this.updateDailyType()
            },
            // 渲染日期
            render(y, m) {
                let firstDayOfMonth = new Date(y, m, 1).getDay()         //当月第一天
                let lastDateOfMonth = new Date(y, m + 1, 0).getDate()    //当月最后一天
                let lastDayOfLastMonth = new Date(y, m, 0).getDate()     //最后一月的最后一天
                this.year = y
                let seletSplit = this.value
                let i, line = 0, temp = [], nextMonthPushDays = 1
                for (i = 1; i <= lastDateOfMonth; i++) {
                    let day = new Date(y, m, i).getDay() //返回星期几（0～6）
                    let k
                    // 第一行
                    if (day == 0) {
                        temp[line] = []
                    } else if (i == 1) {
                        temp[line] = []
                        k = lastDayOfLastMonth - firstDayOfMonth + 1
                        for (let j = 0; j < firstDayOfMonth; j++) {
                            // console.log("第一行",lunarYear,lunarMonth,lunarValue,lunarInfo)
                            temp[line].push(Object.assign(
                                {day: k, disabled: true, type: 0},
                                this.getLunarInfo(this.computedPrevYear(), this.computedPrevMonth(true), k),
                                this.getEvents(this.computedPrevYear(), this.computedPrevMonth(true), k),
                            ))
                            k++;
                        }
                    }
                    // console.log(this.lunar(this.year,this.month,i));

                    let chk = new Date()
                    let chkY = chk.getFullYear()
                    let chkM = chk.getMonth()
                    // 匹配上次选中的日期
                    if (parseInt(seletSplit[0]) == this.year && parseInt(seletSplit[1]) - 1 == this.month && parseInt(seletSplit[2]) == i) {
                        // console.log("匹配上次选中的日期",lunarYear,lunarMonth,lunarValue,lunarInfo)
                        temp[line].push(Object.assign(
                            {day: i, selected: true, type: 0},
                            this.getLunarInfo(this.year, this.month + 1, i),
                            this.getEvents(this.year, this.month + 1, i),
                        ))
                        this.today = [line, temp[line].length - 1]
                    }
                    // 没有默认值的时候显示选中今天日期
                    else if (chkY == this.year && chkM == this.month && i == this.day && this.value == "") {

                        // console.log("今天",lunarYear,lunarMonth,lunarValue,lunarInfo)
                        temp[line].push(Object.assign(
                            {day: i, selected: true, type: 0},
                            this.getLunarInfo(this.year, this.month + 1, i),
                            this.getEvents(this.year, this.month + 1, i),
                        ))
                        this.today = [line, temp[line].length - 1]
                    } else {
                        // 普通日期
                        // console.log("设置可选范围",i,lunarYear,lunarMonth,lunarValue,lunarInfo)
                        let options = Object.assign(
                            {day: i, selected: false, type: 0},
                            this.getLunarInfo(this.year, this.month + 1, i),
                            this.getEvents(this.year, this.month + 1, i),
                        )

                        if (this.disabled.length > 0) {
                            if (this.disabled.filter(v => {
                                return this.year === v[0] && this.month === v[1] - 1 && i === v[2]
                            }).length > 0) {
                                options.disabled = true
                            }
                        }
                        temp[line].push(options)
                    }

                    // 到周六换行
                    if (day == 6 && i < lastDateOfMonth) {
                        line++
                    } else if (i == lastDateOfMonth) {
                        // line++
                        let k = 1
                        for (let d = day; d < 6; d++) {
                            // console.log(this.computedNextYear()+"-"+this.computedNextMonth(true)+"-"+k)
                            temp[line].push(Object.assign(
                                {day: k, disabled: true, type: 0},
                                this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), k),
                                this.getEvents(this.computedNextYear(), this.computedNextMonth(true), k),
                            ))
                            k++
                        }
                        // 下个月除了补充的前几天开始的日期
                        nextMonthPushDays = k
                    }
                } //end for

                // console.log(this.year+"/"+this.month+"/"+this.day+":"+line)
                // 补充第六行让视觉稳定
                if (line <= 5 && nextMonthPushDays > 0) {
                    // console.log({nextMonthPushDays:nextMonthPushDays,line:line})
                    for (let i = line + 1; i <= 5; i++) {
                        temp[i] = []
                        let start = nextMonthPushDays + (i - line - 1) * 7
                        for (let d = start; d <= start + 6; d++) {
                            temp[i].push(Object.assign(
                                {day: d, disabled: true, type: 0},
                                this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), d),
                                this.getEvents(this.computedNextYear(), this.computedNextMonth(true), d),
                            ))
                        }
                    }
                }
                // temp[0][0].disabled = false;
                // temp[temp.length - 1][6].disabled = false;
                this.days = temp
                // console.log(this.days)
            },
            computedPrevYear() {
                let value = this.year
                if (this.month - 1 < 0) {
                    value--
                }
                return value
            },
            computedPrevMonth(isString) {
                let value = this.month
                if (this.month - 1 < 0) {
                    value = 11
                } else {
                    value--
                }
                // 用于显示目的（一般月份是从0开始的）
                if (isString) {
                    return value + 1
                }
                return value
            },
            computedNextYear() {
                let value = this.year
                if (this.month + 1 > 11) {
                    value++
                }
                return value
            },
            computedNextMonth(isString) {
                let value = this.month
                if (this.month + 1 > 11) {
                    value = 0
                } else {
                    value++
                }
                // 用于显示目的（一般月份是从0开始的）
                if (isString) {
                    return value + 1
                }
                return value
            },
            // 获取农历信息
            getLunarInfo(y, m, d) {
                let lunarInfo = calendar.solar2lunar(y, m, d)
                let lunarValue = lunarInfo.IDayCn
                // console.log(lunarInfo)
                let isLunarFestival = false
                let isGregorianFestival = false
                if (this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay] != undefined) {
                    lunarValue = this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay]
                    isLunarFestival = true
                } else if (this.festival.gregorian[m + "-" + d] != undefined) {
                    lunarValue = this.festival.gregorian[m + "-" + d]
                    isGregorianFestival = true
                }
                return {
                    lunar: lunarValue,
                    isLunarFestival: isLunarFestival,
                    isGregorianFestival: isGregorianFestival,
                }
            },
            // 获取自定义事件
            getEvents(y, m, d) {
                if (Object.keys(this.events).length == 0) return false;
                let eventName = this.events[y + "-" + m + "-" + d]
                let data = {}
                if (eventName != undefined) {
                    data.eventName = eventName
                }
                return data
            },
            // 上月
            prev(e) {
                // e.stopPropagation()
                if (this.month == 0) {
                    this.month = 11
                    this.year = parseInt(this.year) - 1
                } else {
                    this.month = parseInt(this.month) - 1
                }
                this.render(this.year, this.month)
                this.$emit('selectMonth', this.month + 1, this.year)
                this.$emit('prev', this.month + 1, this.year)
                this.updateDailyType()
            },
            //  下月
            next(e) {
                // e.stopPropagation()
                if (this.month == 11) {
                    this.month = 0
                    this.year = parseInt(this.year) + 1
                } else {
                    this.month = parseInt(this.month) + 1
                }
                this.render(this.year, this.month)
                this.$emit('selectMonth', this.month + 1, this.year)
                this.$emit('next', this.month + 1, this.year)
                this.updateDailyType()
            },
            updateDailyType() {
                this.days.forEach((week, i) => {
                    week.forEach((day, j) => {
                        day.type = this.dailyType[i][j];
                    });
                });
            },
            // 选中日期
            select(k1, k2, e) {
                if (e != undefined) e.stopPropagation()

                // 取消上次选中
                if (this.today.length > 0) {
                    this.days.forEach(v => {
                        v.forEach(vv => {
                            vv.selected = false
                        })
                    })
                }
                // 设置当前选中天
                this.days[k1][k2].selected = true
                this.day = this.days[k1][k2].day
                this.today = [k1, k2]
                this.$emit('select', [this.year, this.zero ? this.zeroPad(this.month + 1) : this.month + 1, this.zero ? this.zeroPad(this.days[k1][k2].day) : this.days[k1][k2].day])


            },
            selectChoose(k1, k2, e) {
                // if (k1 == 0 && k2 == 0) {
                //     this.prev()
                // } else if (k1 == 5 && k2 == 6) {
                //     this.next()
                // } else {
                this.select(k1, k2, e)
                // }
            },
            changeYear(year) {
                this.render(year, this.month)

                this.updateDailyType()
                // if (this.yearsShow) {
                //     this.yearsShow = false
                //     return false
                // }
                // this.yearsShow = true
                // this.years = [];
                // for (let i = ~~this.year - 10; i < ~~this.year + 10; i++) {
                //     this.years.push(i)
                // }
            },
            selectYear(value) {
                this.yearsShow = false
                this.year = value
                this.render(this.year, this.month)
                this.$emit('selectYear', value)
            },
            // 返回今天
            setToday() {
                let now = new Date();
                this.year = now.getFullYear()
                this.month = now.getMonth()
                this.day = now.getDate()
                this.render(this.year, this.month)

                // 遍历当前日找到选中
                this.days.forEach(v => {
                    v.forEach(vv => {
                        vv.selected = false
                    })
                    let day = v.find(vv => {
                        return vv.day == this.day && !vv.disabled
                    })
                    if (day != undefined) {
                        day.selected = true
                    }

                })
                this.updateDailyType()
                this.$forceUpdate()
            },
            // 日期补零
            zeroPad(n) {
                return String(n < 10 ? '0' + n : n)
            },
        }
    }

</script>

<style scoped>
	.calendar {
		margin: auto;
		width: 100%;
		height: 400px;
		min-width: 300px;
		background: #fff;
		font-family: "PingFang SC", "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
		user-select: none;
	}

	.calendar-tools {
		/*display: flex;*/
		/*flex-direction: column;*/
		/*align-items: center;*/
		align-self: center;
		color: #5e7a88;
	}

	.calendar-info {
		display: flex;
		padding-top: 3px;
		font-size: 26px;
		line-height: 1.3;
		align-items: center;
		/*padding-left: 20px;*/
		/*text-align: center;*/
	}

	.calendar-info > div.month {
		margin: 5px 0 10px 10px;
		height: 50px;
		/*width: 85%;*/
		width: 40% !important;
		/*text-align: center;*/
		color: var(--primary-black);
		overflow: hidden;
		position: relative;
	}

	.calendar-info > div.month .month-inner {
		position: absolute;
		left: 0;
		top: 0;
		/*height: 240px;*/
		width: 240px;
		transition: top .5s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.calendar-info > div.month .month-inner > span {
		display: block;
		font-size: 40px;
		font-weight: bold;
		/*width:100%;*/
		overflow: hidden;
		/*text-align: center;*/
	}

	.calendar-info div.year {
		font-size: 32px;
		font-weight: bolder;
		color: var(--primary-black);
		line-height: 1;
		float: right;
	}

	.calendar-info div.yearname {
		position: relative;
		/*width: 50%;*/
	}

	.calendar table {
		clear: both;
		width: 100%;
		margin-bottom: 10px;
		border-collapse: collapse;
		color: var(--primary-black);
	}

	.calendar td {
		margin: 2px !important;
		padding: 0 0;
		width: 14.28571429%;
		height: 50px;
		text-align: center;
		vertical-align: middle;
		font-size: 14px;
		line-height: 125%;
		cursor: pointer;
		position: relative;
	}

	.calendar td.week {
		font-size: 10px;
		pointer-events: none !important;
		cursor: default !important;
	}

	.calendar td.disabled {
		color: var(--second-black) !important;
		pointer-events: none !important;
		cursor: default !important;
	}

	.calendar td.disabled div {
		color: var(--second-black) !important;
	}

	.calendar td span {
		display: flex;
		height: 100%;
		font-size: 16px;
		/*color: #6a6a6a;*/
		font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		font-weight: 700;
		line-height: 26px;
		margin: 0 auto;
		border-radius: 8px;
		width: 100%;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		transition: all 0.3s ease;

	}

	.calendar td:not(.selected) span:not(.red):hover {
		background: var(--second-main);
		color: var(--primary-black);
	}

	.calendar td:not(.selected) span.red:hover {
		background: #f9efef;
	}

	.calendar td:not(.disabled) span.red {
		color: var(--primary-main);
	}

	.calendar td.selected span {
		background-color: var(--second-main);
		color: var(--white);
	}

	td {

		flex-wrap: wrap;
		width: 30%;
		display: flex;
		border-radius: 8px;
		align-content: center;
	}

	.calendar td .text {
		position: absolute;
		top: 28px;
		left: 0;
		right: 0;
		text-align: center;

		padding: 2px;
		font-size: 8px;
		line-height: 1.2;
		color: var(--primary-black);
	}

	.calendar td .isGregorianFestival,
	.calendar td .isLunarFestival {
		color: var(--primary-main);
	}

	.calendar td.selected span.red {
		background-color: var(--primary-main);
		color: var(--white);
	}

	.calendar td.selected span.red:hover {
		background-color: var(--primary-main);
		color: var(--white);
	}

	.calendar thead td {
		text-transform: uppercase;
		height: 30px;
		vertical-align: middle;
	}

	.calendar-button {
		text-align: center;
	}

	.calendar-button span {
		cursor: pointer;
		display: inline-block;
		min-height: 1em;
		min-width: 5em;
		vertical-align: baseline;
		background: var(--primary-black);
		color: var(--white);
		margin: 0 .25em 0 0;
		padding: .6em 2em;
		font-size: 1em;
		line-height: 1em;
		text-align: center;
		border-radius: .3em;
	}

	.calendar-button span.cancel {
		background: var(--primary-black);
		color: var(--primary-black);
	}

	.calendar-years {
		position: absolute;
		left: 0px;
		top: 60px;
		right: 0px;
		bottom: 0px;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		overflow: auto;
		transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
		opacity: 0;
		pointer-events: none;
		transform: translateY(-10px);
	}

	.calendar-years.show {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0px);
	}

	.calendar-years > span {
		margin: 1px 5px;
		display: inline-block;
		width: 60px;
		line-height: 30px;
		border-radius: 20px;
		text-align: center;
		border: 1px solid var(--white);
		color: var(--second-black)
	}

	.calendar-years > span.active {
		border: 1px solid var(--primary-black);
		background-color: var(--primary-black);
		color: var(--white);
	}

	.transform-group {
		transform-origin: right;
		transform: rotate(-90deg);
	}

	:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
		background-color: var(--clear-main) !important;
	}
	:deep(.el-dropdown-menu__item){
		transition: 0.3s;
	}

</style>
