var $;
var $form;
var form;
	layui
		.config({
			base : "js/"
		})
		.use(
			[ 'form', 'layer', 'jquery', 'table', 'laydate' ],
			function() {
				var form = layui.form, table = layui.table, layer = parent.layer === undefined ? layui.layer
					: parent.layer, laydate = layui.laydate
				$ = layui.jquery,
					nowTime = new Date().valueOf(),
					max = null,
					active = {
						search : function() {
							var nickname = $('#nickname'), sex = $('#sex option:selected'), status = $('#status option:selected');
							createTimeStart = $("#createTimeStart"),
								createTimeEnd = $("#createTimeEnd");
							//执行重载
							table
								.reload(
									'userList',
									{
										page : {
											curr : 1
											//重新从第 1 页开始
										},
										where : {
											//key: {
											nickname : nickname
												.val(),
											sex : sex
												.val(),
											status : status
												.val(),
											createTimeStart : createTimeStart
												.val(),
											createTimeEnd : createTimeEnd
												.val()
											//}
										}
									});
						}
					};

				var start = laydate.render({
					elem : '#createTimeStart',
					type : 'datetime',
					max : nowTime,
					btns : [ 'clear', 'confirm' ],
					done : function(value, date) {
						endMax = end.config.max;
						end.config.min = date;
						end.config.min.month = date.month - 1;
					}
				});
				var end = laydate.render({
					elem : '#createTimeEnd',
					type : 'datetime',
					max : nowTime,
					done : function(value, date) {
						if ($.trim(value) == '') {
							var curDate = new Date();
							date = {
								'date' : curDate.getDate(),
								'month' : curDate.getMonth() + 1,
								'year' : curDate.getFullYear()
							};
						}
						start.config.max = date;
						start.config.max.month = date.month - 1;
					}
				})

				//加载页面数据
				table
					.render({
						id : 'postList',
						elem : '#postList',
						url : ctx + '/post/getPostList' //数据接口
						,limit : 10//每页默认数
						,limits : [ 10, 20, 30, 40 ]
						,cols : [ [ //表头
							{
								type : 'checkbox'
							},{
								title : '操作',
								toolbar : '#barEdit', width:100
							},
							{
								field : 'uid',
								title : '序号'
							},
							{
								field : 'zdeptname',
								title : '用人单位'
							},
							{
								field : 'zname',
								title : '职位名称'
							},
							{
								field : 'xlyq',
								title : '学历要求'
							},
							{
								field : 'gwxl',
								title : '岗位序列'
							},
							{
								field : 'gzdd',
								title : '工作地点'
							},
							{
								field : 'jlsl',
								title : '简历数量'
							},
							{
								field : 'createTime',
								title : '发布时间',
								templet : '<div>{{ formatTime(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>'
							},
							{
								field : 'zstatus',
								title : '职位状态'
							} ] ],
						page : true
						,where: {timestamp: (new Date()).valueOf()}
						,done:function(res,curr,count){
							// 隐藏列
							$(".layui-table-box").find("[data-field='uid']").css("display","none");
						}
						//开启分页
					});
				//监听工具条
				table.on('tool(postList)', function(obj) {
					var data = obj.data;
					if (obj.event === 'del') {
						layer.confirm('真的删除行么', function(index) {
							$.ajax({
								url : ctx + '/user/delUserByUid/'
									+ data.uid,
								type : "get",
								success : function(d) {
									if (d.code == 0) {
										obj.del();
									} else {
										layer.msg(data.msg, {
											icon : 5
										});
									}
								}
							})
							layer.close(index);
						});
					}else if(obj.event === 'submit'){
						if(data.zstatus === '发布'){
							layer
								.msg(
									"该职位已发布！",
									{
										icon : 5
									});
						}else if(data.zstatus === '下架'){layer
							.msg(
								"该职位已下架！",
								{
									icon : 5
								});

						}
						else{
							layer.confirm('是否发布此职位？', function(index) {
								$.ajax({
									url : ctx + '/post/subPostByUid/'
										+ data.uid,
									type : "get",
									success : function(d) {
										if (d.code == 0) {
											location.reload();
											layer
												.msg(
													"发布成功！",
													{
														icon : 1
													});
										} else {
											layer.msg(data.msg, {
												icon : 5
											});
										}
									}
								})
								layer.close(index);
							});
						}


					} else if(obj.event === 'under'){
						if(data.zstatus === '下架'){
							layer
								.msg(
									"该职位已发布！",
									{
										icon : 5
									});
						}else if(data.zstatus === '发布'||data.zstatus === '创建'){
							layer.confirm('是否下架此职位？', function(index) {
								$.ajax({
									url : ctx + '/post/underPostByUid/'
										+ data.uid,
									type : "get",
									success : function(d) {
										if (d.code == 0) {
											// obj.del();
											location.reload();
											layer
												.msg(
													"下架成功！",
													{
														icon : 1
													});
										} else {
											layer.msg(data.msg, {
												icon : 5
											});
										}
									}
								})
								layer.close(index);
							});
						}
					}else if (obj.event === 'edit') {
						// if(data.zstatus === '下架'){
						// 	layer
						// 		.msg(
						// 			"该职位已下架，不允许修改！",
						// 			{
						// 				icon : 5
						// 			});
						// }else if(data.zstatus === '发布' ){
						// 	layer
						// 		.msg(
						// 			"该职位已发布，不允许修改！",
						// 			{
						// 				icon : 5
						// 			});
						// }else{
						//
						// }
						var index = layui.layer.open({
							// layer.open({
							type : 2,
							title : "修改职位",
							content : ctx + "/post/editPost/"
								+ data.uid, //这里content是一个普通的String
							success : function(layero, index) {

							}
						})
						//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
						$(window).resize(function() {
							layui.layer.full(index);
						})
						layui.layer.full(index);
					}
					else if (obj.event === 'check') {
						var index = layui.layer.open({
							title : "简历列表",
							type : 2,
							content : ctx + "/cv/cvList/"+ data.uid,
							success : function(layero, index) {

							}
						})
						//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
						$(window).resize(function() {
							layui.layer.full(index);
						})
						layui.layer.full(index);

					}

				});

				//查询
				$(".search_btn").click(function() {
					var type = $(this).data('type');
					active[type] ? active[type].call(this) : '';
				})
				//增加职位
				$(".postAdd_btn").click(function() {
					var index = layui.layer.open({
						title : "发布职位",
						type : 2,
						content : ctx + "/post/addPost",
						success : function(layero, index) {

						}
					})
					//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
					$(window).resize(function() {
						layui.layer.full(index);
					})
					layui.layer.full(index);
				})

				//发布
				$(".postSub_btn").click(function() {
					var checkStatus = table
						.checkStatus('postList'), data = checkStatus.data, postUid = '', postStu = '';
					if (data.length > 0) {
						$.each(data, function(n,
											  value) {
							postUid += value.uid
								+ ',';
							postStu += value.zstatus
								+ ',';
						});
						postUid = postUid
							.substring(
								0,
								postUid.length - 1);
						if (postStu.indexOf('发布')!=-1) {
							layer
								.msg(
									"选中职位已发布！",
									{
										icon: 5
									});
						}
						else {
							layer.confirm('是否发布选中职位？', function (index) {
								$.ajax({
									url: ctx + '/post/subPostByUid/'
										+ postUid,
									type: "get",
									success: function (d) {
										if (d.code == 0) {
											// obj.del();
											location.reload();
											layer
												.msg(
													"发布成功！",
													{
														icon: 1
													});
										} else {
											layer.msg(data.msg, {
												icon: 5
											});
										}
									}
								})
								layer.close(index);
							});
						}
					}else {
						layer.msg("请选择需要发布的职位");
					}
				});
				//下架
				$(".postUnder_btn").click(function() {
					var checkStatus = table
						.checkStatus('postList'), data = checkStatus.data, postUid = '',postStu = '';
					if (data.length > 0) {
						$.each(data, function(n,
											  value) {
							postUid += value.uid
								+ ',';
							postStu += value.zstatus
								+ ',';
						});
						postUid = postUid
							.substring(
								0,
								postUid.length - 1);
						if (postStu.indexOf('下架')!=-1) {
							layer
								.msg(
									"选中职位已下架！",
									{
										icon: 5
									});
						}
						else {
							layer.confirm('是否下架选中职位？', function (index) {
								$.ajax({
									url: ctx + '/post/underPostByUid/'
										+ postUid,
									type: "get",
									success: function (d) {
										if (d.code == 0) {
											// obj.del();
											location.reload();
											layer
												.msg(
													"下架成功！",
													{
														icon: 1
													});
										} else {
											layer.msg(data.msg, {
												icon: 5
											});
										}
									}
								})
								layer.close(index);
							});
						}
					}else {
						layer.msg("请选择需要下架的职位");
					}


				});
				//批量删除
				$(".batchDel").click(function() {
							var checkStatus = table
								.checkStatus('userList'), data = checkStatus.data, userStr = '';
							if (data.length > 0) {
								$.each(data, function(n,
													  value) {
									userStr += value.uid
										+ ',';
								});
								userStr = userStr
									.substring(
										0,
										userStr.length - 1);
								layer
									.confirm(
										'确定删除<strong>'
										+ data.length
										+ '</strong>条数据吗？',
										function(
											index) {
											//调用删除接口
											$
												.ajax({
													url : ctx
														+ '/user/delUsers/'
														+ userStr,//接口地址
													type : "get",
													success : function(
														d) {
														if (d.code == 0) {
															//删除成功，刷新父页面
															parent.location
																.reload();
														} else {
															layer
																.msg(
																	"权限不足，联系超管！",
																	{
																		icon : 5
																	});
														}
													}
												})
										});
							} else {
								layer.msg("请选择需要删除的用户");
							}
						})

			})

	//格式化时间
	function formatTime(datetime, fmt) {
		if (datetime == null || datetime == 0) {
			return "";
		}
		if (parseInt(datetime) == datetime) {
			if (datetime.length == 10) {
				datetime = parseInt(datetime) * 1000;
			} else if (datetime.length == 13) {
				datetime = parseInt(datetime);
			}
		}
		datetime = new Date(datetime);
		var o = {
			"M+" : datetime.getMonth() + 1, //月份
			"d+" : datetime.getDate(), //日
			"h+" : datetime.getHours(), //小时
			"m+" : datetime.getMinutes(), //分
			"s+" : datetime.getSeconds(), //秒
			"q+" : Math.floor((datetime.getMonth() + 3) / 3), //季度
			"S" : datetime.getMilliseconds()
			//毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1,
					(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
						.substr(("" + o[k]).length)));
		return fmt;
	}
