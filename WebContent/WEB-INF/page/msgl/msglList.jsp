<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<%@ include file="/WEB-INF/page/include/taglib.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="utf-8">
<title>面试跟踪</title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="expires" content="Wed, 26 Feb 1997 08:21:57 GMT">
<meta name="format-detection" content="telephone=no">
<link rel="stylesheet" href="${ctx }/layui/css/layui.css" media="all" />
<link rel="stylesheet" href="${ctx }/css/font_eolqem241z66flxr.css"
	media="all" />
<link rel="stylesheet" href="${ctx }/css/list.css" media="all" />
<script>
	var ctx = "${ctx}";
</script>


</head>
<body class="childrenBody">
<form class="layui-form">
	<input type="hidden" name="zwid" value="${post.uid}" id="zwid"/>
	<blockquote class="layui-elem-quote news_search">
	<div style="margin-top: 1%">
		<div class="layui-inline">
			<input type="text" id="createTimeStart"
				   class="layui-input userName" name="createTimeStart"
				   placeholder="发布时间(开始)" value="">
		</div>
		<div class="layui-inline">
			<input type="text" id="createTimeEnd" class="layui-input userName"
				   name="createTimeEnd" placeholder="发布时间(结束)" value="">
		</div>
		<a class="layui-btn search_btn" lay-submit="" data-type="search"
		   lay-filter="search">查询</a>
		<shiro:hasPermission name="user:user:save">
			<div class="layui-inline">
				<a class="layui-btn layui-btn-normal userAdd_btn">发布职位</a>
			</div>
		</shiro:hasPermission>
		<shiro:hasPermission name="user:user:delete">
			<div class="layui-inline">
				<a class="layui-btn layui-btn-danger batchDel">批量删除</a>
			</div>
		</shiro:hasPermission>
		<div class="layui-inline">（支持模糊查询）</div>
	</div>
	</blockquote>
</form>
	<div class="layui-form">
		<table id="msglList" lay-filter="msglList"></table>
	</div>
	<script type="text/javascript" src="${ctx }/layui/layui.js"></script>
	<script type="text/html" id="barEdit">
  		<a class="layui-btn layui-btn-xs" lay-event="check">查看</a>
	</script>
	<script type="text/html" id="barEdit2">
		<a class="layui-btn layui-btn-xs" lay-event="yes">是</a>
		<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="no">否</a>
	</script>
<script type="text/javascript" src="${ctx }/page/msgl/msglList.js"></script>
</body>
</html>