<template>
	<div style="padding:20px">
		<div>
			<el-checkbox-group v-model="checkList2" @change="groupchange">
				<el-checkbox v-for="(value,index) in checkList2" :label="value.name" @change="groupchange(value.id)"></el-checkbox>
			  </el-checkbox-group>
		</div>
		
		<div id="mapContainer" style="height: 500px;width: 500px;"></div>
			<el-divider content-position="left">分割</el-divider>
		<div>
					
			<el-button @click="toStringButton">转换</el-button>
			<el-button type="primary" class="toshareUrl"  :data-clipboard-text="shareUrl" @click="clickShareUrl">点击分享
			  </el-button>
			<el-card class="box-card">
				<el-table :data="tableData7" border>
					<el-table-column prop="id" label="ID" width="180"></el-table-column>
					<el-table-column prop="name" label="name" width="180">
						<template slot-scope="scope" style="display: flex;">
							<!-- <div v-for="item in scope.row.name" > -->
							<span>{{scope.row.name[0]}} {{scope.row.name[1]}} {{scope.row.name[2]}}</span>
							<!-- </div> -->
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>
		<el-table :data="tableData6" :span-method="objectSpanMethod" border>
			<el-table-column prop="id" label="ID" width="180"></el-table-column>
			<el-table-column prop="name" label="姓名"></el-table-column>
			<el-table-column prop="amount1" label="数值 1（元）"></el-table-column>
		</el-table>

		<el-checkbox-group v-model="checkList" @change="checkboxchange">
			<el-checkbox label="复选框 A"></el-checkbox>
			<el-checkbox label="复选框 B"></el-checkbox>
			<el-checkbox label="复选框 C"></el-checkbox>
			<el-checkbox label="禁用" disabled></el-checkbox>
			<el-checkbox label="选中且禁用" disabled></el-checkbox>
		</el-checkbox-group>
		<el-input type="number" v-model="aaa" placeholder="单位:元"></el-input>

		<!-- 登陆界面 -->
		<div>
			<div class="outer_label">
				<img class="inner_label login_logo" src="../../assets/logo.png">
			</div>
			<div class="login_form">
				<input type="text" class="qxs-ic_user qxs-icon" placeholder="用户名" v-model="userName">
				<input type="text" class="qxs-ic_password qxs-icon" placeholder="密码" v-model="password">
				<!--<button class="login_btn el-button el-button&#45;&#45;primary is-round" type="primary" round>登录</button>-->
				<el-button class="login_btn" @click.native="login" type="primary" round :loading="isBtnLoading">登录</el-button>
				<div style="margin-top: 10px">
					<span style="color: #000099;" @click="login">司机账号登陆</span><span style="float: right;color: #A9A9AB">忘记密码？</span>
				</div>
			</div>
		</div>
		<!-- 下载excel -->
		<div>
			<a :href="downloadUrl">
				<button> 下载</button>
			</a>
		</div>
		<!-- echarts图表 -->
		<div id="main" style="width: 600px;height:400px;"></div>
		<button @click="dianji">点击</button>

		<div>
			<iframe src="https://www.baidu.com/" width="1200" height="300" frameborder="0" scrolling="auto"></iframe>
		</div>

		<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="handleSetLineChartData('newVisitis')">
				<div class="card-panel-icon-wrapper icon-people">
					<svg-icon icon-class="peoples" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">
						New Visits
					</div>
					<count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
				</div>
			</div>
		</el-col>
<!--高德历史轨迹 -->
		<div id="container"></div>
		<div class="input-card">
			<h4>轨迹回放控制</h4>
			<div class="input-item">
				<el-button @click="startAnimation">开始</el-button>
				<input type="button" class="btn" value="开始动画" id="start" @onclick="startAnimation" />
				<input type="button" class="btn" value="暂停动画" id="pause" onclick="pauseAnimation()" />
			</div>
			<div class="input-item">
				<input type="button" class="btn" value="继续动画" id="resume" onclick="resumeAnimation()" />
				<input type="button" class="btn" value="停止动画" id="stop" onclick="stopAnimation()" />
			</div>
		</div>
		
		<!-- 位置标记 -->
		<div id="locition" style="width: 300px;height: 300px;"></div>
		
		
	</div>
	



</template>
<script>
	export default {
		data() {
			return {
				checkList2:[{name:name1,id:id1},{name:name2,id:id2}],
				// 实时速度历史轨迹
				routeInfo:[{"lat":41.898985,"lng":123.532276,"speed":0.89},{"lat":41.898994,"lng":123.532212,"speed":1.55}],
				// 复制链接
				 shareUrl: '',
				 carid:'0000045',
				 
				tableData7: [{
					id: "1",
					name: ["1.9米", "6米", "13米"]
				}, {
					id: "2",
					name: ["3米", "5米"]
				}],
				bababa: '',
				ababab: ["1.9米", "6米", "13米及以上"],

				downloadUrl: 'http://81.70.151.121:8080/jeecg-boot/tPfPlist/exportXls',
				userName: '',
				password: '',
				isBtnLoading: false,



				aaa: 0,
				checkList: ['选中且禁用', '复选框 A'],
				spanArr: [], //用于存放每一行记录的合并数
				tableData6: [{
						id: "1",
						name: "王小虎",
						amount1: "234"
					},
					{
						id: "1",
						name: "王小虎",
						amount1: "165"
					},
					{
						id: "2",
						name: "王小虎",
						amount1: "324"
					},
					{
						id: "2",
						name: "王小虎",
						amount1: "621"
					},
					{
						id: "2",
						name: "王小虎",
						amount1: "539"
					}
				],

				xDataArr: [],
				yDataArr1: [],
				yDataArr2: [],
				firstArr:[116.478935, 39.997761],
				lineArr: [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]],
				
			};
		},

		created() {
			
			this.getEchartsData();

			if (JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')).userName) {
				this.userName = JSON.parse(localStorage.getItem('user')).userName;
				this.password = JSON.parse(localStorage.getItem('user')).password;
			}
		},
		computed: {
			

			btnText() {
				if (this.isBtnLoading) return '登录中...';
				return '登录';
			}

		},
		mounted: function() {
			setTimeout(() => {
				this.initMap();
				this.initroad();
				this.initLocationMap();
				this.history();
			}, 1000);
			this.getSpanArr(this.tableData6);
			// echarts
			this.creatEchartsMethod();

		},
		methods: {
			// 带瞬时速度的历史轨迹
			history(){
				console.log(this.routeInfo)
				   // 1. 创建地图
				    var map = new AMap.Map("mapContainer", {
				        view: new AMap.View2D({
				        }),
				        lang: "zh_cn"
				    });
				
				    // 2.创建小汽车markerpush
				    var carMarker = new AMap.Marker({
				        map: map,
				        position: [this.routeInfo[0].lng, this.routeInfo[0].lat],
				        icon: "http://webapi.amap.com/images/car.png",
				        offset: new AMap.Pixel(-26, -13),
				        autoRotation: true
				    });
						
						// 3.创建跟速度信息展示框
						    var carWindow = new AMap.InfoWindow({
						        offset: new AMap.Pixel(6, -25),
						        content: "速速速速"
						    });
								
						// 4.生成车辆回放轨迹routeInfo
						    var pathPolyline = initializePaths(this.routeInfo);
						
						    // 5.车辆随轨迹移动
						    carMarker.moveAlong(pathPolyline.getPath(), 1000, function (k) {
						        return k
						    }, false);
						
						    // 6.速度框随车辆移动
						    AMap.event.addListener(carMarker, 'moving', function (e) {
						        var lastLocation = e.passedPath[e.passedPath.length - 1];
						        carWindow.setPosition(lastLocation);
						        setVehicleSpeedInWidowns(lastLocation);
						    });
						
						    // 7.打开速度框
						    carWindow.open(map, carMarker.getPosition());
						
						    // 8.地图自适应缩放
						    map.setFitView();

			},
			initializePaths(paths) {
			        var line;
			        var pathLngLatArray = [];
			        if (paths) {
			            for (var i = 0; i < paths.length; i++) {
			                pathLngLatArray.push(new AMap.LngLat(paths[i].lng, paths[i].lat));
			            }
			            line = new AMap.Polyline({
			                map: map,
			                path: pathLngLatArray,
			                strokeColor: 'red',
			                strokeOpacity: 0.8,
			                strokeWeight: 6,
			                strokeStyle: 'solid'
			            });
			            line.setMap(map);
			        }
			        return line;
			    },
					setVehicleSpeedInWidowns(lnglat) {
					        for (var i = 0; i < this.routeInfo.length; i++) {
					            if (lnglat.distance(new AMap.LngLat(this.routeInfo[i].lng, this.routeInfo[i].lat)) < 4) {
					                carWindow.setContent("速度:" + (this.routeInfo[i].speed * 1.852).toFixed(2) + "公里/时");
					                return;
					            }
					        }
					
					    },

			
			// 复制链接
			clickShareUrl() {
			      this.shareUrl = 'http://81.70.151.121:8080/jeecg-boot/phonePage/'+this.carid
			let clipboard = new this.Clipboard(".toshareUrl");
			clipboard.on("success", e => {
				// 释放内存
				this.$message.success('已成功复制')
				clipboard.destroy();
			});
			},
			    
			
			toStringButton() {
				this.bababa = this.ababab.toString()
				console.log(this.bababa)
			},
			getEchartsData() {
				this.xDataArr = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号']
				this.yDataArr1 = ['80', '90', '95', '100', '110', '130', '120', '105', '95']
				this.yDataArr2 = ['55', '65', '70', '80', '85', '100', '95', '85', '75']
			},
			// echarts
			creatEchartsMethod() {
				var myChart = this.$echarts.init(document.getElementById('main'));
				var options = {
					title: {
						text: '数据'
					},
					legend: {
						data: ['里程', '收入']
					},
					xAxis: {
						type: 'category',
						data: this.xDataArr
					},
					yAxis: {
						type: 'value'
					},
					series: [{
							name: '里程',
							type: 'bar',
							data: this.yDataArr1,
							// 平均值
							markLine: {
								data: [{
									type: 'average'
								}]
							}
						},
						{
							name: '收入',
							type: 'bar',
							data: this.yDataArr2,
							// 平均值
							markLine: {
								data: [{
									type: 'average'
								}]
							}
						}
					],

				}
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(options);
			},
			dianji() {
				this.xDataArr = ['11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号']
				this.yDataArr1 = ['180', '90', '195', '100', '110', '130', '120', '105', '95']
				this.yDataArr2 = ['55', '65', '70', '80', '85', '100', '95', '85', '75']
				this.creatEchartsMethod();
			},
			// 		creatEcharts(){
			// 			var myChart = this.$echarts.init(document.getElementById('main'));
			// 			 // 指定图表的配置项和数据
			// 			        var option = {
			//     legend: {},
			//     tooltip: {},
			//     dataset: {
			//         // 用 dimensions 指定了维度的顺序。直角坐标系中，
			//         // 默认把第一个维度映射到 X 轴上，第二个维度映射到 Y 轴上。
			//         // 如果不指定 dimensions，也可以通过指定 series.encode
			//         // 完成映射，参见后文。
			//         dimensions: ['product', '里程', '收入'],
			//         source: [
			//             {product: '1号', '里程': 43.3, '收入': 85.8},
			//             {product: '2号', '里程': 83.1, '收入': 73.4},
			//             {product: '3号', '里程': 99, '收入': 85.6},
			//             {product: '4号', '里程': 120.5, '收入': 115},
			//             {product: '5号', '里程': 201, '收入': 186.6},
			//             {product: '6号', '里程': 33.5, '收入': 33},
			//             {product: '7号', '里程': 51, '收入': 46}
			//         ]
			//     },
			//     // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
			//     xAxis: {type: 'category'},
			//     // 声明一个 Y 轴，数值轴。
			//     yAxis: {},
			//     // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
			//     series: [
			//         {type: 'bar'},
			//         {type: 'bar'}
			//     ]
			// };

			// 			        // 使用刚指定的配置项和数据显示图表。
			// 			        myChart.setOption(option);
			// 		},
			// 下载
			async xiazai() {
				const {
					data: res
				} = await this.$http.get('tPfPlist/exportXls')
				console.log(res)
			},

			login() {
				if (!this.userName) {
					this.$message.error('请输入用户名');
					return;
				}
				if (!this.password) {
					this.$message.error('请输入密码');
					return;
				}

			},


			checkboxchange(e) {
				console.log(e)
				console.log(this.checkList)
			},

			getSpanArr(data) {
				// data就是我们从后台拿到的数据
				for (var i = 0; i < data.length; i++) {
					if (i === 0) {
						this.spanArr.push(1);
						this.pos = 0;
					} else {
						// 判断当前元素与上一个元素是否相同
						if (data[i].id === data[i - 1].id) {
							this.spanArr[this.pos] += 1;
							this.spanArr.push(0);
						} else {
							this.spanArr.push(1);
							this.pos = i;
						}
					}
					console.log(this.spanArr);
				}
			},
			objectSpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex === 0 || columnIndex === 1) {
					const _row = this.spanArr[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					console.log(`rowspan:${_row} colspan:${_col}`);
					return {
						// [0,0] 表示这一行不显示， [2,1]表示行的合并数
						rowspan: _row,
						colspan: _col
					};
				}
			},

			//初始化地图
			initMap() {
				this.map = new AMap.Map("container", {
					resizeEnable: true, //窗口大小调整
					center: this.firstArr, //中心 firstArr: [116.478935, 39.997761],
					zoom: 20
				});
				this.marker = new AMap.Marker({
					map: this.map,
					position: this.firstArr,
					icon: "https://webapi.amap.com/images/car.png",
					offset: new AMap.Pixel(-26, -13), //调整图片偏移
					autoRotation: true, //自动旋转
					angle: -90 //图片旋转角度
				});
				this.marker.text = "沙发沙发沙发"
				// this.marker.setTitle('我是marker的title');
				
				  // 设置label标签
    // label默认蓝框白底左上角显示，样式className为：amap-marker-label
    // this.marker.setLabel({
    //     offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
    //     content: "<div class='info'>我是 marker 的 label 标签</div>", //设置文本标注内容
    //     direction: 'top' //设置文本标注方位
    // });
			},
			
			//初始化轨迹
			  initroad() {
			      //绘制还未经过的路线
			      this.polyline = new AMap.Polyline({
			        map: this.map,
			        path: this.lineArr,
			        showDir: true,
			        strokeColor: "#28F", //线颜色--蓝色
			        // strokeOpacity: 1,     //线透明度
			        strokeWeight: 6 //线宽
			        // strokeStyle: "solid"  //线样式
			      });
			      //绘制路过了的轨迹
			      var passedPolyline = new AMap.Polyline({
			        map: this.map,
			        strokeColor: "#AF5", //线颜色-绿色
			        //path: this.lineArr,
			        // strokeOpacity: 1,     //线透明度
			        strokeWeight: 6 //线宽
			        // strokeStyle: "solid"  //线样式
			      });
						var infoWindow;
						infoWindow = new AMap.InfoWindow({
									isCustom:	true,
									draggable: true,  //是否可拖动
							        offset: new AMap.Pixel(0, -31),
							        content:""
							    });

			      this.marker.on("moving", e => {
							// e.target.text
			        // console.log(e)
							 infoWindow.setContent("<ul class='main'><li> 文字： <span style='color:blue'>"+e.target.text+"</span></li></ul>" );
											 infoWindow.open(this.map, e.lnglat);
			        passedPolyline.setPath(e.passedPath);
			      });
			      this.map.setFitView(); //合适的视口
			    },

			startAnimation() {
				this.marker.moveAlong(this.lineArr, 200);
			},
			pauseAnimation() {
				this.marker.pauseMove();
			},
			resumeAnimation() {
				this.marker.resumeMove();
			},
			stopAnimation() {
				this.marker.stopMove();
			},
			// 位置
			initLocationMap(){
				var map1 = new AMap.Map("locition", {
					resizeEnable: true, //窗口大小调整
					center: [116.397428, 39.90923], //中心 firstArr: [116.478935, 39.997761],
					zoom: 13
				});
				
				var marker1 = new AMap.Marker({
				            icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
				            position: [116.406315,39.908775],
				            offset: new AMap.Pixel(-13, -30)
				        });
								 marker1.setMap(map1);
			},
			groupchange(e){
				console.log(e)
			},
		}
	};
</script>
<style lang="less" scoped>
	.login_form {
		padding-top: 10%;
		padding-left: 10%;
		padding-right: 10%;
	}

	.qxs-ic_user {
		background: url("../../assets/name.png") no-repeat;
		background-size: 13px 15px;
		background-position: 3%;
	}

	.qxs-ic_password {
		background: url("../../assets/password.png") no-repeat;
		background-size: 13px 15px;
		background-position: 3%;
		margin-bottom: 20px;
	}

	.login_logo {
		height: 100%;
	}

	.login_btn {
		width: 100%;
		font-size: 16px;
		background: -webkit-linear-gradient(left, #000099, #2154FA);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(right, #000099, #2154FA);
		/* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(right, #000099, #2154FA);
		/* Firefox 3.6 - 15 */
		background: linear-gradient(to right, #000099, #2154FA);
		/* 标准的语法 */
		filter: brightness(1.4);
	}

	#container {
		height: 500px;
		width: 500px;
	}

	.input-card .btn {
		margin-right: 1.2rem;
		width: 9rem;
	}

	.input-card .btn:last-child {
		margin-right: 0;
	}
</style>
