/*
* @Author: Yuk
* @Date:   2016-05-09 15:52:07
* @Last Modified by:   Yuk
* @Last Modified time: 2016-05-09 16:15:18
*/

'use strict';
// 删除
$(function() {
	$('.add').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		$.ajax({
				type: 'POST',
				url: '/admin/movie/addtop?id=' + id
			});
	})
})
