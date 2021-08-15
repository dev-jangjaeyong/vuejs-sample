<template>
	<dashboard1-chart1 :height="250" />
</template>

<script>
import Vue from 'vue';
import VueChartJs from 'vue-chartjs';

Vue.component('dashboard1-chart1', {
	extends: VueChartJs.Line,
	data: () => ({
		label: [],
	}),
	created() {
		this.$EventBus.$on('label-set', (label, data) => {
			this.label = label;
			this.renderChart(
				{
					labels: this.label,
					datasets: data,
				},
				{
					scales: {
						xAxes: [
							{
								gridLines: {
									display: false,
								},
								ticks: {
									fontColor: '#aaa',
								},
							},
						],
						yAxes: [
							{
								gridLines: {
									display: false,
								},
								ticks: {
									fontColor: '#aaa',
								},
							},
						],
					},

					responsive: true,
					maintainAspectRatio: false,
				},
			);
		});
	},
});
</script>

<style scoped></style>
