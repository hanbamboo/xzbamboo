<script setup>

</script>

<template>
	<router-view class="full-screen"/>
</template>

<style>
	#app, html, body {
		box-sizing: border-box;
		display: flex;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
		justify-content: center !important;
		align-items: center !important;
	}

	.full-screen {
		background: var(--white);
	}

	::selection {
		background-color: var(--primary-main);
		color: var(--white);
	}

</style>
