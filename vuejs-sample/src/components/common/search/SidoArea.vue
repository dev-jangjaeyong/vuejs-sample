<!--
시도타입
A : 시도 지역 조합 단지 상사 select box 구성
B : 시도 지역 단지 상사 select box 구성
C :

-->

<template>
	<div
		class="col-md mb-2 form-row"
		v-if="this.searchParameters.sidoType === 'A'"
	>
		<div class="col-2">
			<b-form-group label="시도">
				<b-form-select
					v-on:change="changeSido"
					v-model="$commSearch.state.sidoValue"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="sido in sidos" :value="sido.VALUE">
							{{ sido.TEXT }}
						</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
		<div class="col-2">
			<b-form-group label="지역">
				<b-form-select
					id="citySelect"
					:value="null"
					v-model="$commSearch.state.cityValue"
					v-on:change="changeCity"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="city in citys" :value="city.VALUE">{{
							city.TEXT
						}}</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
		<div class="col-2">
			<b-form-group label="조합">
				<b-form-select
					:value="null"
					v-model="$commSearch.state.johapValue"
					v-on:change="changeJohap"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="johap in johaps" :value="johap.VALUE">{{
							johap.TEXT
						}}</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
		<div class="col-2">
			<b-form-group label="단지">
				<b-form-select
					:value="null"
					v-model="$commSearch.state.danjiValue"
					v-on:change="changeDanji"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="danji in danjis" :value="danji.VALUE">{{
							danji.TEXT
						}}</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
		<div class="col-2">
			<b-form-group label="상사">
				<b-form-select
					:value="null"
					v-model="$commSearch.state.shopValue"
					v-on:change="changeShop"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="shop in shops" :value="shop.VALUE">{{
							shop.TEXT
						}}</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
	</div>
	<!-- sidoType: B-->
	<div
		class="col-md mb-2 form-row"
		v-else-if="this.searchParameters.sidoType === 'B'"
	>
		<div class="col-2">
			<b-form-group label="시도">
				<b-form-select
					v-on:change="changeSido"
					v-model="$commSearch.state.sidoValue"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="sido in sidos" :value="sido.VALUE">
							{{ sido.TEXT }}
						</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
		<div class="col-2">
			<b-form-group label="지역">
				<b-form-select
					id="citySelect"
					:value="null"
					v-model="$commSearch.state.cityValue"
					v-on:change="changeCity"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="city in citys" :value="city.VALUE">{{
							city.TEXT
						}}</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
		<div class="col-2">
			<b-form-group label="단지">
				<b-form-select
					:value="null"
					v-model="$commSearch.state.danjiValue"
					v-on:change="changeDanji"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="danji in danjis" :value="danji.VALUE">{{
							danji.TEXT
						}}</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
		<div class="col-2">
			<b-form-group label="상사">
				<b-form-select
					:value="null"
					v-model="$commSearch.state.shopValue"
					v-on:change="changeShop"
				>
					<template slot="first">
						<option value="">전체</option>
						<option v-for="shop in shops" :value="shop.VALUE">{{
							shop.TEXT
						}}</option>
					</template>
				</b-form-select>
			</b-form-group>
		</div>
	</div>
</template>

<script>

export default {
	name: 'SidoArea',
	created() {
		// app.code = {};
		// //프론트 js 호출
		// let sidocitydanjiScript = document.createElement('script');
		// sidocitydanjiScript.setAttribute('src', 'https://pcd.carmanager.co.kr/resources/js/code/common-sidocitydanji.js');
		// document.head.appendChild(sidocitydanjiScript);
		// //검색js
		// let searchScript = document.createElement('script');
		// searchScript.setAttribute('src', 'https://pcd.carmanager.co.kr/resources/js/util/app_carBaseJsonInfo.js');
		// document.head.appendChild(searchScript);

		// this.loadSidoCode();
		this.GetSidoSetting();
	},
	computed: {
		sidos() {
			return this.$commSearch.getters.fetchedSido;
		},
		citys() {
			return this.$commSearch.getters.fetchedCity;
		},
		johaps() {
			return this.$commSearch.getters.fetchedJohap;
		},
		danjis() {
			return this.$commSearch.getters.fetchedDanji;
		},
		shops() {
			return this.$commSearch.getters.fetchedShop;
		},
		searchParameters() {
			return this.$commSearch.getters.fetchSearchParameters;
		},
	},
	methods: {
		GetSidoSetting() {
			this.$commSearch.state.sidoValue = '';
			this.$commSearch.state.cityValue = '';
			this.$commSearch.state.johapValue = '';
			this.$commSearch.state.danjiValue = '';
			this.$commSearch.state.shopValue = '';
			this.$commSearch.dispatch('FETCH_SIDO_SETTING');
		},
		changeSido(e) {
			this.searchParameters.sidoCode = e;
			this.searchParameters.cityCode = '';
			this.searchParameters.johapCode = '';
			this.searchParameters.danjiCode = '';
			this.searchParameters.shopCode = '';
			this.searchParameters.currentPage = 1;
			this.$commSearch.state.citys = [];
			this.$commSearch.state.johaps = [];
			this.$commSearch.state.danjis = [];
			this.$commSearch.state.shops = [];
			this.$commSearch.state.cityValue = '';
			this.$commSearch.state.johapValue = '';
			this.$commSearch.state.danjiValue = '';
			this.$commSearch.state.shopValue = '';
			this.$commSearch.dispatch('FETCH_CHANGE_SIDO', e);
		},
		changeCity(e) {
			this.searchParameters.cityCode = e;
			this.searchParameters.danjiCode = '';
			this.searchParameters.shopCode = '';
			this.searchParameters.currentPage = 1;
			this.$commSearch.state.danjis = [];
			this.$commSearch.state.shops = [];
			this.$commSearch.state.danjiValue = '';
			this.$commSearch.state.shopValue = '';
			this.$commSearch.dispatch('FETCH_CHANGE_CITY', e);
		},
		changeDanji(e) {
			this.searchParameters.danjiCode = e;
			this.searchParameters.shopCode = '';
			this.$commSearch.state.shopValue = '';
			this.searchParameters.currentPage = 1;
			this.$commSearch.dispatch('FETCH_CHANGE_DANJI', e);
		},
		changeJohap(e) {
			this.searchParameters.johapCode = e;
			this.searchParameters.currentPage = 1;
			this.$commSearch.dispatch('FETCH_CHANGE_JOHAP', e);
		},
		changeShop(e) {
			this.searchParameters.shopCode = e;
			this.searchParameters.currentPage = 1;
			this.$commSearch.dispatch('FETCH_CHANGE_SHOP', e);
		},
	},
};
</script>

<style scoped></style>
