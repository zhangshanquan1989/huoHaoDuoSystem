<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆里程报表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card" v-loading.fullscreen.lock="fullscreenLoading">
			<div>
				<span style="font-size: 18px;color: #303133;">筛选查询</span>
			</div>
			<div style="margin-top: 18px;">
			<el-select v-model="queryInfo.licenseplate" clearable filterable remote placeholder="请输入车牌号" :remote-method="remotePlateNumberMethod" :loading="plateNumberLoading" @change="licenseplateChange" style="width: 293px;">
				<el-option v-for="item in plateNumberOptions" :key="item.index" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<span style="font-size: 20px;color: #303133;margin-left: 20px;">统计时间段</span>
			<el-button type="primary" plain @click="seleceLastWeek" style="margin-left: 20px;">上周</el-button>
			<el-button type="primary" plain @click="seleceNearWeek" style="margin-left: 20px;">近一周</el-button>
			<el-button type="primary" plain @click="seleceLastMonth" style="margin-left: 20px;">上月</el-button>
			<el-button type="primary" plain @click="seleceNearMonth" style="margin-left: 20px;">近一月</el-button>
			</div>
			<div style="margin-top: 20px;">
			<el-date-picker v-model="queryInfo.newStartTime" :picker-options="pickerDisabled" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd " >
			</el-date-picker>
			<span style="margin-left: 10px;">-</span>
			<el-date-picker v-model="queryInfo.newEndTime" :picker-options="pickerDisabled" type="date" value-format="yyyy-MM-dd " placeholder="选择结束日期" style="margin-left: 10px;">
			</el-date-picker>
			<el-button type="primary" icon="el-icon-search" style="margin-left: 20px;" @click="search">搜索</el-button>
			</div>
			<div style="margin-top: 20px;">
				<span style="font-size: 20px;color: #303133;">车辆里程报表</span>
				<el-button type="primary" plain icon="el-icon-download" style="margin-left: 20px;"  @click="allExport">导出全部</el-button>
				<el-button type="primary" plain icon="el-icon-download" style="margin-left: 20px;" @click="singleExport">导出选中</el-button>
				<el-button type="primary" plain style="margin-left: 20px;" @click="clearExport">清除选中</el-button>
			</div>
			<el-table :data="carMileageList" ref="carMileageForm" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @selection-change="youhaoSelectionChange" :row-key="getLicenseplate">
			 <el-table-column type="selection" width="55" :reserve-selection="true">
			 </el-table-column>
				<el-table-column prop="licenseplate" label="车牌" width="250px">
				</el-table-column>
				<el-table-column prop="endMileage" label="总里程(km)" width="300px">
				</el-table-column>
				<el-table-column prop="mileage" label="行驶里程(km)">
				</el-table-column>

			</el-table>
		</el-card>
		<!-- 分页区域 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
		 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total" style="margin-top: 5px;">
		</el-pagination>


	</div>
</template>

<script>
	import moment from "moment";
	export default {
		data() {
			return {
				// 查询参数对象
				queryInfo: {
					licenseplate: '',
					StartTime: '',
					EndTime: '',
					newStartTime: '',
					newEndTime: '',
					pageNo: 1,
					pageSize: 10,
				},
				searchInfo:{
					licenseplate: '',
					StartTime: '',
					EndTime: '',
				},
				// 全部导出参数
				daochuInfo:{
					StartTime: '',
					EndTime: '',
				},
				// 选择导出参数
				daochuSingleInfo: {
					StartTime: '',
					EndTime: '',
					licenseplate: []
				},
				carMileageList: [],
				total: 0,
				// 设置日期选择禁用日期
				pickerDisabled: {
				        disabledDate: (time) => {
				            return time.getTime() < 1625382900365 || time.getTime() > new Date() - 8.64e7;
				          }
				      },
				// 选择车牌数据
				plateNumberLoading: false,
				plateNumberOptions: [],
				plateNumberStates: [],
				plateNumberList: [],
				// 加载查询
				fullscreenLoading: false,

			}
		},
		created() {
			// console.log('现在',Date.now()-950400000)
			this.initTime(); // 初始化时间
			this.getCarMileageList()
			// this.getAllPlateNumberList()
			this.getAllPlateNumberListNew()
		},
		methods: {
			change(e){
				// console.log(e)
			},
			// 获取时间
			// 初始化时间
			initTime() {
				// const EndTime = this.getFormatDate(new Date()).substr(0, 11) + '23:59:59'

				const EndTime = this.getFormatDate(new Date(new Date() - 3600 * 1000 * 24 * 1)).substr(0, 11)

				const StartTime = this.getFormatDate(new Date(new Date() - 3600 * 1000 * 24 * 6)).substr(0, 11)
				this.queryInfo.newStartTime = StartTime
				this.queryInfo.newEndTime = EndTime
			},
			// 获取当前时间
			getFormatDate(date) {
				var month = date.getMonth() + 1
				var strDate = date.getDate()
				if (month >= 1 && month <= 9) {
					month = '0' + month
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = '0' + strDate
				}
				var currentDate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + date.getHours() + ':' + date.getMinutes() +
					':' + date.getSeconds()
				return currentDate
			},

			// 根据分页查询列表
			async getCarMileageList() {
				// console.log(this.queryInfo)
				this.queryInfo.StartTime = this.queryInfo.newStartTime + '23:59:59'
				this.queryInfo.EndTime = this.queryInfo.newEndTime + '23:59:59'
				// console.log(this.queryInfo)
				const {
					data: res
				} = await this.$http.get('yK_record/list1', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.carMileageList = res.result.records
				this.total = res.result.total
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getCarMileageList()
			},

			// 页码值改变事件
			handleCurrentChange(pageNo) {
				this.queryInfo.pageNo = pageNo
				this.getCarMileageList()
			},
			
			// 点击搜索
			async search(){
				if(this.queryInfo.licenseplate){
					// console.log('有车牌')
					const {
						data: res
					} = await this.$http.post('yK_record/list2', this.queryInfo)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.carMileageList = []
					this.carMileageList[0] = res.result
					this.total = 1
					// console.log(this.carMileageList)
				}else{
					// console.log('没有车牌')
					this.getCarMileageList()
				}
				
			},
			// 获取所有车牌号
			async getAllPlateNumberListNew() {
				const {
					data: res
				} = await this.$http.get('yk_carinformation/listall')
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				console.log(res)
				this.plateNumberStates = []
				res.result.forEach(v => {
					this.plateNumberStates.push(v.licenseplate)
				})
				this.plateNumberList = this.plateNumberStates.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.plateNumberOptions = this.plateNumberList
			},

			// // 获取所有车牌号
			// async getAllPlateNumberList() {
			// 	const {
			// 		data: res
			// 	} = await this.$http.get('kCarinformation/findplate')
			// 	if (res.code !== 200) {
			// 		return this.$message.error(res.message)
			// 	}
			// 	// console.log(res)
			// 	// res.result.forEach(v => {
			// 	// 	this.plateNumberStates.push(v.driverLicense)
			// 	// })
			// 	this.plateNumberList = res.result.map(item => {
			// 		return {
			// 			value: `${item}`,
			// 			label: `${item}`
			// 		};
			// 	});
			// 	this.plateNumberOptions = this.plateNumberList
			// },

			// 选择车牌的方法
			remotePlateNumberMethod(query) {
				if (query !== '') {
					this.plateNumberLoading = true;
					setTimeout(() => {
						this.plateNumberLoading = false;
						this.plateNumberOptions = this.plateNumberList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.plateNumberOptions = this.plateNumberList
				}
			},
			// 车牌变化
			licenseplateChange(e){
				// if(!e){
					this.plateNumberOptions = this.plateNumberList
				// }
			},
			// 选择上周
			seleceLastWeek(){
				this.queryInfo.newStartTime = moment(moment().week(moment().week() - 1).startOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD ')
				this.queryInfo.newEndTime = moment(moment().week(moment().week() - 1).endOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD ')
				// console.log(this.queryInfo.newStartTime)
				// console.log(this.queryInfo.newEndTime)
			},
			// 选择近一个周
			seleceNearWeek(){
				this.queryInfo.newStartTime = moment().subtract(7, "days").format("YYYY-MM-DD ");
				this.queryInfo.newEndTime =moment().subtract(1, "days").format("YYYY-MM-DD ")
			},
			// 选择上月
			seleceLastMonth(){
				this.queryInfo.newStartTime =moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYY-MM-DD ')
				this.queryInfo.newEndTime =moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format('YYYY-MM-DD ')
				// console.log(this.queryInfo.newStartTime)
				// console.log(this.queryInfo.newEndTime)
			},
			// 选择近一个月
			seleceNearMonth(){
				this.queryInfo.newStartTime = moment().subtract(1, "months").format("YYYY-MM-DD ")
				this.queryInfo.newEndTime = moment().subtract(1, "days").format("YYYY-MM-DD ")
			},
			
			// 导出
			async allExport(){
				this.fullscreenLoading = true;
				this.daochuInfo.StartTime = this.queryInfo.StartTime
				this.daochuInfo.EndTime = this.queryInfo.EndTime
				
				let url = 'https://tkhhd.com/jeecg-boot/yK_record/exportoperatingdataA?StartTime='+this.daochuInfo.StartTime+'&EndTime='+this.daochuInfo.EndTime
					var xhr = new XMLHttpRequest(); //定义http请求对象
					xhr.open("get", url, true);
					xhr.responseType = "blob"; // 转换流
					xhr.setRequestHeader("satoken", window.sessionStorage.getItem('satoken'));
					let that = this
					xhr.onload = function() {
						
						// console.log(this)
						var blob = this.response;
						var a = document.createElement("a")
						var url = window.URL.createObjectURL(blob)
						a.href = url
						a.download = "全部车辆里程报表.xlsx" // 文件名
						a.click()
						window.URL.revokeObjectURL(url)
						a.remove()
						that.fullscreenLoading = false;
					}
				xhr.send();
				
				// !!!下面代码为location.href方法，不能携带token
				// const {data:res} = await this.$http.get('yK_record/exportoperatingdataA', {params: this.queryInfo})
				// // console.log(res)
				// window.location.href = 'http://81.70.151.121:8080/jeecg-boot/yK_record/exportoperatingdataA?StartTime='+this.daochuInfo.StartTime+'&EndTime='+this.daochuInfo.EndTime
				// this.fullscreenLoading = false;
			},
			
				//导出所需的数据
				// 选择框变化
				youhaoSelectionChange(e) {
					this.daochuSingleInfo.licenseplate = []
					e.forEach(v => {
						this.daochuSingleInfo.licenseplate.push(v.licenseplate)
					})
				},
				// 导出选中部分
				async singleExport() {
					this.daochuSingleInfo.StartTime = this.queryInfo.StartTime
					this.daochuSingleInfo.EndTime = this.queryInfo.EndTime
					if (!this.daochuSingleInfo.licenseplate[0]) {
						return this.$message.warning('请选择需要导出的数据！')
					}
					const {
						data: res
					} = await this.$http({
						url: 'yK_record/exportoperatingdatalistB',
						method: "post",
						data: {
							StartTime: this.daochuSingleInfo.StartTime,
							EndTime: this.daochuSingleInfo.EndTime,
							licenseplate: this.daochuSingleInfo.licenseplate
						},
						responseType: 'blob',
					})
				
					var blob = res
					// console.log(blob)
					const fileName = '车辆里程报表.xlsx'
					var a = document.createElement("a");
					a.href = window.URL.createObjectURL(blob);
					// console.log(a.href)
					a.download = fileName
					a.click()
					a.remove()
				},
				// 表格分页多选
				getLicenseplate(row){
					return row.licenseplate
				},
				// 清除选中
				clearExport(){
					this.$refs.carMileageForm.clearSelection()
				},
				

		}
	}
</script>

<style scoped>

</style>
