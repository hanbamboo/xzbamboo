<template>
  <span>
    <el-date-picker ref="labelDatePicker" v-model="internalTime" :default-value="time"/>
    <span class="el-input__inner" @click.prevent="clickLabel">
      <slot/>
    </span>
  </span>
</template>

<script>
    export default {
        name: "labelDatePicker",
        props: {
            time: {
                type: Date,
                default: () => new Date()
            }
        },
        data() {
            return {
                internalTime: this.time
            };
        },
        watch: {
            time(newValue) {
                this.internalTime = newValue;
            },
            internalTime(newValue) {
                this.$emit('input', newValue);
            }
        },
        methods: {
            clickLabel() {
                this.$refs.labelDatePicker.focus();
            }
        }
    };
</script>