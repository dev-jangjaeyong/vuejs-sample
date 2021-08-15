<template>
	<div>
		<b-form>
			<b-form-group label="식별번호" horizontal :label-cols="2">
				<b-input
					type="text"
					placeholder="식별번호"
					v-model="modelInfo.carNo"
					readonly
				></b-input>
			</b-form-group>
			<b-form-group label="차량번호" horizontal :label-cols="2">
				<b-input
					type="text"
					placeholder="차량번호"
					v-model="modelInfo.carPlateNumber"
				></b-input>
			</b-form-group>
			<b-form-group label="주행거리" horizontal :label-cols="2">
				<b-input
					type="number"
					placeholder="주행거리"
					v-model="modelInfo.carUseKm"
				></b-input>
			</b-form-group>
		</b-form>
	</div>
</template>

<script>
export default {
	name: 'CardataModel',
	props: ['modelInfo'],
};
</script>

<style scoped></style>
