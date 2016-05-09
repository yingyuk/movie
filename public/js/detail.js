/*
 * @Author: Yuk
 * @Date:   2016-04-21 17:33:20
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-04-25 21:18:53
 */

'use strict';
// 删除
$(function() {
    $('.comment').click(function(e) {
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');
        console.log($('#toId').length);

        if ($('#toId').length > 0) {
            $('#toId').val(toId);
        } else {
            $('<input>').attr({
                type: 'hidden',
                id: 'toId',
                name: 'comment[tid]',
                value: toId
            }).appendTo('#commentFrom');
        }
        if ($('#commentId').length > 0) {
            $('#commentId').val(commentId);
        } else {
            $('<input>').attr({
                type: 'hidden',
                id: 'commentId',
                name: 'comment[cid]',
                value: commentId
            }).appendTo('#commentFrom');
        }
    })
})
