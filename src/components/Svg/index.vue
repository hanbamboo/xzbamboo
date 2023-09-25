<template>
	<span>
		 <svg :class="`svg-icon ${selected ? 'select' : ''}`"
			  :style="{ width: size+`em`, height: size+`em`,fill:color }">
     		 <use :xlink:href="'#icon-' + iconClass"></use>
			 <title v-if="!!title">{{title}}</title>
   		 </svg>
		<a v-if="showTitle>0">{{showTitle}}</a>
	</span>

</template>


<script >
    export default {
        name: 'SvgIcon',
        props: {
            selected: {
                type: Boolean,
                default: false
            },
            color: {
                type: String,
                default: "#cccccc"
            },
            size: {
                type: [String, Number],
                default: 1.0
            },
            iconClass: {
                type: String,
                required: true
            },
            className: {
                type: String
            },
            title: {
                type: String,
                default: ''
            },
            showTitle: {
                type: [Number, String],
                default: 0
            },
        },
    }
</script>

<style scoped>
	span {
		margin: 0;
		padding: 0;
		display: inline-flex;
	}

	span a {
		font-size: 14px;
		transition: 0.5s;
		cursor: pointer;
	}

	.svg-icon {
		cursor: pointer;
		margin-left: 0.35em;
		margin-right: 0.35em;
		vertical-align: -0.15em;
		overflow: hidden;
		transition: 0.3s;
	}

	.select {
		fill: var(--primary-main) !important;
	}



	.svg-icon:hover + a,
	.svg-icon:hover {
		fill: var(--primary-main) !important;
		color: #FF6464;
	}

</style>
