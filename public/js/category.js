/*
* @Author: Yuk
* @Date:   2016-05-09 14:47:26
* @Last Modified by:   Yuk
* @Last Modified time: 2016-05-09 14:56:01
*/

'use strict';
// 删除分类
$(function() {
	$('.del').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);
		$.ajax({
				type: 'DELETE',
				url: '/admin/category/list?id=' + id
			})
			.done(function(results) {
				if (results.success === 1) {
					if (tr.length > 0) {
						tr.remove()
					}
				}
			})
	})
})
