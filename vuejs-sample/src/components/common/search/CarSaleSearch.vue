<template>
	<div>
		<div class="col-md mb-2 form-row">
			<div class="col-2">
				<b-form-group label="판매구분">
					<b-form-select v-model="searchParameters.carSaleState">
						<template slot="first">
							<option value="3">광고중</option>
							<option value="5">계약중</option>
							<option value="9">판매완료</option>
						</template>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col-1">
				<b-form-group label="사진유무">
					<b-form-select v-model="searchParameters.imageYn">
						<template slot="first">
							<option value="">전체</option>
							<option value="Y">있음</option>
							<option value="N">없음</option>
						</template>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col-1">
				<b-form-group label="가격유무">
					<b-form-select v-model="searchParameters.saleAmtYn">
						<template slot="first">
							<option value="">전체</option>
							<option value="Y">있음</option>
							<option value="N">없음</option>
						</template>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col-1">
				<b-form-group label="성능유무">
					<b-form-select v-model="searchParameters.carCheckYn">
						<template slot="first">
							<option value="">전체</option>
							<option value="Y">있음</option>
							<option value="N">없음</option>
						</template>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col-2">
				<b-form-group label="수기입력">
					<b-form-select v-model="searchParameters.carcheckoutWhoYN">
						<template slot="first">
							<option value="">전체</option>
							<option value="1">수기입력</option>
							<option value="2">수기입력아님</option>
						</template>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col-1">
				<b-form-group label="딜러성함">
					<b-input
						type="text"
						placeholder="성함입력"
						v-model="searchParameters.dealerName"
					></b-input>
				</b-form-group>
			</div>
			<div class="col-2">
				<b-form-group label="검색조건">
					<b-form-select v-model="searchParameters.srType">
						<template slot="first">
							<option value="2">차량번호</option>
							<option value="1">제시번호</option>
							<option value="4">성능번호</option>
						</template>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col-2">
				<b-form-group label="검색문구">
					<b-input
						type="text"
						placeholder="검색조건선택후 적어주세요"
						v-model="searchParameters.srTypeText"
					></b-input>
				</b-form-group>
			</div>
			<div class="col-2">
				<label class="form-label d-none d-md-block">&nbsp;</label>
				<b-btn variant="info" :block="true" @click="filterSearch"
					>선택차량광고</b-btn
				>
			</div>
			<div class="col-2">
				<label class="form-label d-none d-md-block">&nbsp;</label>
				<b-btn variant="danger" :block="true" @click="selectAllDelete"
					>선택차량삭제</b-btn
				>
			</div>
			<div class="col-2">
				<label class="form-label d-none d-md-block">&nbsp;</label>
				<b-btn variant="primary" :block="true" @click="filterSearch"
					>선택차량 담당자 변경</b-btn
				>
			</div>
			<!--      <div class="col-2">-->
			<!--        <label class="form-label d-none d-md-block">&nbsp;</label>-->
			<!--        <b-btn variant="warning" :block="true" @click="filterSearch">엑셀다운로드</b-btn>-->
			<!--      </div>-->
			<div class="col-5"></div>
			<div class="col-1">
				<div class="float-right">
					<label class="form-label d-none d-md-block">&nbsp;</label>
					<b-btn
						variant="secondary"
						:block="true"
						@click="filterSearch"
						>검색</b-btn
					>
				</div>
			</div>
		</div>
		<!--    <div class="col-md mb-2 form-row">-->

		<!--    </div>-->
	</div>
</template>

<script>
export default {
	name: 'CarSaleSearch',
	created() {
		this.ResetData();
	},
	computed: {
		searchParameters() {
			return this.$commSearch.getters.fetchSearchParameters;
		},
	},
	methods: {
		ResetData() {
			this.searchParameters.carSaleState = '3';
			this.searchParameters.imageYn = '';
			this.searchParameters.priceYN = '';
			this.searchParameters.saleAmtYn = '';
			this.searchParameters.carCheckYn = '';
			this.searchParameters.carcheckoutWhoYN = '';
			this.searchParameters.dealerName = '';
			this.searchParameters.srType = '2';
			this.searchParameters.srTypeText = '';
		},
		filterSearch(ctx) {
			this.$emit('filterSearch');
		},
		selectAllDelete(ctx) {
			this.$parent.$emit('selectAllDelete');
		},
	},
};
</script>

<style scoped></style>
