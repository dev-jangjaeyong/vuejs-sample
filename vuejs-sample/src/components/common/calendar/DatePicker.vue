<!--
  ex:
         <DatePicker
           dateType="range"
           dateformat="YYYY-MM-dd"
           startDate="2020-07-13"
           endDate="today"
           minShowDate="2020-07-28"
           maxShowDate="today"
          :disabledDate=[1, 7]
          ></DatePicker>

  옵션설명
  type : 상위 conponent 에서 props로 내려줌.
  type.dateType :default: 'range', 'date' : 단일날짜선택, 'range': 범위선택
  ******format type 대소문자 꼭 맞춰줘야함
  startDate : YYYY-MM-DD 또는 yy-MM-dd 또는 MM-dd 만 허용
    ㄴ시작날짜 : today, date, now :현재
       * "2016-02-17".date();
       * "16/02/17".date("yy/MM/dd");
       * "2016.02.17 14:00:00".date("yyyy.MM.dd hh:mm:ss");
       * "4/5".date("MM/dd");
       ==>형태는 yy/MM/dd 또는  yy-MM-dd 식으로 하이픈 넣어도 replaceAll하니 편한걸로 써도 상관없음.
  endDate : startDate와 동일
  minShowDate: 선택할수있는 날짜 시작일 형식은 startDate, endDate 와 동일
  disabledDate : array 1: 일요일 ex:주말제외 = [1, 7]
  Is
  -->
<template>
	<div
		class="col-md mb-2 form-row"
		v-if="this.searchParameters.dateType === 'date'"
	>
		<div class="col-2">
			<v-date-picker
				mode="date"
				:min-date="searchParameters.mindate"
				:max-date="searchParameters.maxdate"
				:disabled-dates="{weekdays: searchParameters.datedisabled}"
				v-model="searchParameters.dates"
				:input-props="{
					class:
						'w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 hover:border-blue-5',
					placeholder: '날짜를 선택해 주세요.',
					readonly: false,
				}"
			/>
		</div>
	</div>
	<div
		class="col-md mb-2 form-row"
		v-else-if="this.searchParameters.dateType === 'range'"
	>
		<div class="col-2">
			<v-date-picker
				mode="range"
				v-model="searchParameters.dates"
				:min-date="searchParameters.mindate"
				:max-date="searchParameters.maxdate"
				:disabled-dates="{weekdays: searchParameters.datedisabled}"
				:input-props="{
					class:
						'w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 hover:border-blue-5',
					placeholder: '날짜를 선택해 주세요.',
					readonly: false,
				}"
			/>
		</div>
	</div>
</template>

<script>
// import VCalendarR from '@/mixins/VcalendarR'

export default {
	date: {},
	props: [
		'dateType',
		'dateFormat',
		'startDate',
		'endDate',
		'minShowDate',
		'maxShowDate',
		'disabledDate',
	],
	created() {
		this.SetTypeCalendar();
	},
	computed: {
		searchParameters() {
			return this.$commSearch.getters.fetchSearchParameters;
		},
	},
	methods: {
		SetTypeCalendar() {
			// this.searchParameters.dates.start = new Date(2020, 6, 15);
			// // this.searchParameters.dates.end = new Date(2020, 6, 20);
			// this.searchParameters.dates.span = 5;

			// 데이트 타입  세팅 시작 ===>
			// 데이트 타입 :
			if (this.dateType) this.searchParameters.dateType = this.dateType;
			else this.searchParameters.dateType = 'range';
			    //start date
			    if (this.startDate) {
			    this.SetDate('start', this.dateFormat, this.startDate);
			} else {
			    this.searchParameters.dates.start = null;
			}
			//end date
			if (this.endDate) {
			    this.SetDate('end', this.dateFormat, this.endDate);
			} else {
			    this.searchParameters.dates.start = null;
			}
			//minShowDate
			if(this.minShowDate){
			    this.SetDate('min', this.dateFormat, this.minShowDate);
			}else{
			    this.searchParameters.mindate = null;
			}
			//maxShowDate
			if(this.maxShowDate){
			    this.SetDate('max', this.dateFormat, this.maxShowDate);
			}else{
			    this.searchParameters.maxdate = null;
			}
			//disable

			if(this.disabledDate.length > 0){
			    this.searchParameters.datedisabled = this.disabledDate;
			}
		},
		SetDate(type, dateFormat, date) {
			try {
				let dateValue = '';
				let dt = new Date();
				if (
					date === 'today' ||
					date === 'date' ||
					date === 'now' ||
					date === 'nowdate'
				) {
					dateValue = new Date();
				} else {
					// 100아래 숫자인지 판별
					if (Number(date) < 100) {
						dt.setDate(dt.getDate() + Number(date));
						dateValue = dt;
					} else {
						if (dateFormat === 'YYYY-MM-DD') {
							dateValue = date.date();
						} else {
              console.log("--------------------------------------", date);
							dateValue = date.date(
                dateFormat.replaceAll('-', '/')
							);
                console.log(dateValue);
						}
					}
				}
				switch (type) {
					case 'start':
						this.searchParameters.dates.start = dateValue;
						break;
					case 'end':
						this.searchParameters.dates.end = dateValue;
						break;
					case 'min':
						this.searchParameters.mindate = dateValue;
						break;
					case 'max':
						this.searchParameters.maxdate = dateValue;
						break;
					default:
						break;
				}
			} catch (e) {
			    console.log(e);
				alert('날짜 옵션을 다시 한번 확인해 주십시오.');
			}
		},
	},
};
</script>
