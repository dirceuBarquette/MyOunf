var MyOunf = {
	//quizzes : [{quiz_id:'a',quiz_title:'aa',elements:[{elem_id:'e1'}]},{quiz_id:'b',quiz_title:'bb',elements:[{elem_id:'b-e1'}]}],
	quizzes : [],
   run : function() {
		$('.open_settings').live('click',function(e){
			var parent_group_config = $(this).parents('.group_config:first');
			//console.log('open ',$(parent_group_config).find('.settings:first'));
			$(parent_group_config).find('.settings').show();
		});
		$('.close_settings').live('click',function(e){
			var parent_group_config = $(this).parents('.group_config:first');
			//console.log('close ',$(parent_group_config).find('.settings:first'));bind
			$(parent_group_config).find('.settings').hide();
		});
		//console.log('k->',k,' v->',v);
		$('.choose_form').live('click',function(e){
			var parent_settings = $(this).parents('.settings:first');
			var tochoose_needed_id = $(parent_settings).attr('id');
			$('#'+tochoose_needed_id).find('.tochoose').hide();
			//$('.tochoose').find('input,select,textarea').attr('disabled','disabled');
			if (tochoose_needed_id.split('_')[0] == 'partit') {
				$('#'+tochoose_needed_id).find('#partit_'+$(this).val()+'_config').show();
			} else {
				$('#'+tochoose_needed_id).find('#'+$(this).val()+'_config').show();
			}
			//$('#'+$(this).val()+'_config').find('input,select,textarea').attr('disabled','');
		});
		//$('.choose_form_unique').live('click',function(e){
		//
		//	var parent_settings = $(this).parents('.settings:first');
		//	var tochoose_needed_id = $(parent_settings).attr('id');
		//	$('#'+tochoose_needed_id).find('.tochoose_unique').hide();
		//	if ($(this).val() == "true") {
		//		$('#'+tochoose_needed_id).find('#'+$(this).attr('name')+'_config').hide();
		//		$(this).val("false");
		//	} else {
		//		$('#'+tochoose_needed_id).find('#'+$(this).attr('name')+'_config').show();
		//		$(this).val('true')
		//	}
		//});

		$('#new_quiz').bind('click',function(e){
			var s_f = $(this).parents('.settings');
			if($(s_f).find('.settings_form').is(':hidden')){
				$(s_f).find('.settings_form').show(function(){
					//$(this).find('input').not('[type=button]').val('');
					$(this.id + ' div.item_set').find('input').val('');
				});
			}
		});
		$('#new_list').bind('click',function(e){
			var s_f = $(this).parents('.settings');
			if($(s_f).find('.list_setting').is(':hidden')){
				$(s_f).find('.list_setting').show(function(){
					$(this).find('input').not('[type=button],[type=radio]').val('');
				});
			}
		});
		$('#new_tools_option').bind('click',function(e){
			var s_f = $(this).parents('.settings');
			if($(s_f).find('.tools_option_setting').is(':hidden')){
				$(s_f).find('.tools_option_setting').show(function(){
					$(this).find('input').not('[type=button],[type=radio]').val('');
				});
			}
		});

		$('#add_new_quiz').bind('click',function(e){
			var input_arr = [$('#quiz_id'),$('#quiz_title')];
			var data = MyOunf.get_input_data(input_arr);
			var s_f = $(this).parents('.settings_form');
			MyOunf.save_quiz(data,function(obj){
				$(s_f).hide();
				MyOunf.set_quiz_list_select(data[0].value,MyOunf.set_clipboard({index:'current_quiz',data:obj.quiz_idx},MyOunf.show_more_config_block()));
				MyOunf.set_element_list_select(obj.quiz_idx,'');
			});

			//alert(MyOunf.quizzes.toSource());
		});
		$('#add_new_element').live('click',function(e){
			var s_f = $(this).parents('.settings_form');
			$(this).remove();
			var input_arr = [$('#element_id'),$('#element_name'),$('input[name=elem_type]:checked'),$('#html_elem_content'),$('#question_mark'),$('#question_text')];
			//var form_data = MyOunf.get_input_data('#settings-elements_config');
			var form_data = MyOunf.get_input_data(input_arr);
			var cur_quiz = MyOunf.get_clipboard_data({'index':'current_quiz'});
			//console.log('cur_quiz in add_new_element->',cur_quiz);
			//console.log('FORMDATA->',form_data);
			MyOunf.insert_element(form_data,cur_quiz,function(){
				$(s_f).find('.tochoose').hide();
				$(s_f).hide();
				MyOunf.set_element_list_select(cur_quiz,form_data[0].value);
			});
			//alert(MyOunf.quizzes.toSource());
		});
		$('#select_quiz').bind('change',function(e){
			//var this_val = $(this).val();
			var cur_quiz = '';
			if ($(this).val() != '') {
				MyOunf.show_more_config_block();
				cur_quiz = $(this).find('option:eq('+this.selectedIndex+')').data('quiz_idx');
				MyOunf.set_element_list_select(cur_quiz,'');
			} else {
				MyOunf.hide_more_config_block();
			}
			MyOunf.set_clipboard({index:'current_quiz',data:cur_quiz});
		});
		MyOunf.set_quiz_list_select('');

		$('#select_element_quiz').bind('change',function(e){
			//var this_val = $(this).val();
			var cur_element = $(this).val();
			//if ($(this).val() != '') {
			//	//MyOunf.show_more_config_block();
			//	cur_element = $(this).find('option:eq('+this.selectedIndex+')').data('quiz_idx');
			//	MyOunf.set_element_list_select(cur_quiz,'');
			//} else {
			//	MyOunf.hide_more_config_block();
			//}
			MyOunf.set_clipboard({index:'current_element',data:cur_element});
		});
		$('#new_element').bind('click',function(e){
			var s_f = $(this).parents('.settings');
			if($(s_f).find('.settings_form').is(':hidden')){
				$(s_f).find('.settings_form').show(function(){
					$(this).find('input').not('[type=button],[type=radio]').val('');
					$(this).find('[type=radio]').filter('[name=elem_type]').attr({checked:false})
					$(this).find('textarea').val('');
					$('#g_c-element_type').find('.settings').hide()
					$(this).append('<input type="button" id="add_new_element" value="ok" />')
				});
			}
		});
		$('#new_entry').bind('click',function(e){
			var s_f = $(this).parents('.settings');
			if($(s_f).find('.entry_setting').is(':hidden')){
				$(s_f).find('.entry_setting').show(function(){
					$(this).find('input').not('[type=button],[type=radio]').val('');
					$(this).find('textarea').val('');
					$(this).append('<input type="button" id="add_new_entry" value="ok" />')
				});
			}
		});
		$('#add_new_entry').live('click',function(e){
			var s_f = $(this).parents('.settings_form');
			$(this).remove();
			var input_arr = [$('#entry_id'),$('#entry_name'),$('input[name=content_fill]:checked'),$('#fill_free_rules'),$('#fill_free_min_char'),$('#fill_free_max_char'),$('input[name=entry_input_type]:checked')];
			//var form_data = MyOunf.get_input_data('#settings-elements_config');
			var form_data = MyOunf.get_input_data(input_arr);
			var cur_quiz = MyOunf.get_clipboard_data({'index':'current_quiz'});
			//console.log('cur_quiz in add_new_element->',cur_quiz);
			console.log('FORMDATA->',form_data);
			//MyOunf.insert_element(form_data,cur_quiz,function(){
			//	$(s_f).find('.tochoose').hide();
			//	$(s_f).hide();
			//	MyOunf.set_element_list_select(cur_quiz,form_data[0].value);
			//});
			//alert(MyOunf.quizzes.toSource());
		});
		$('#new_option').bind('click',function(e){
			var s_f = $(this).parents('.settings');
			if($(s_f).find('.option_setting').is(':hidden')){
				$(s_f).find('.option_setting').show(function(){
					$(this).find('input').not('[type=button],[type=radio]').val('');
					$(this).find('textarea').val('');
				});
			}
		});
   },
	show_more_config_block : function () {
		MyOunf.show_elements_block();
		$('#tools_config').show();
		$('#layout_config').show();
		$('#qgrouping_config').show();
		$('#qdeps_config').show();
	},
	hide_more_config_block : function () {
		MyOunf.hide_elements_block();
		$('#tools_config').hide();
		$('#layout_config').hide();
		$('#qgrouping_config').hide();
		$('#qdeps_config').hide();
	},
	show_elements_block : function () {
		$('#elements_config').show();
	},
	hide_elements_block : function () {
		$('#elements_config').hide();
	},
	set_quiz_list_select : function (selected,callback) {
		$('#select_quiz option:not(:empty)').remove();
		$.each(MyOunf.quizzes,function(k,v){
			$('<option value="'+v.quiz_id+'">'+v.quiz_title+'</option>').data('quiz_idx',k).appendTo('#select_quiz');
		});
		//console.log('selected->',selected)
		$('#select_quiz option').filter('[value='+selected+']').attr({'selected':'selected'});
		if (callback && typeof callback == 'function') {
			callback();
		}
	},
	set_element_list_select : function (quiz_idx,selected,callback) {
		$('#select_element_quiz option:not(:empty)').remove();
		//console.log('quiz_idx in set_element->',quiz_idx);
		$.each(MyOunf.quizzes[quiz_idx].elements,function(k,v){
			//console.log('k->',k,' $(v)->',v);
			$('<option value="'+v.element_id+'">'+v.element_name+'</option>').appendTo('#select_element_quiz');
			if (selected == v.element_id) {
				MyOunf.set_clipboard({index:'current_element',data:k});
			}
		});
		$('#select_element_quiz option').filter('[value='+selected+']').attr({'selected':'selected'});
		if (callback && typeof callback == 'function') {
			callback();
		}

	},
	get_input_data : function (input_arr) {
      var ret = [];
		$.each(input_arr,function(k,v){
			//console.log('k->',k,' $(v)->',$(v));
         var vv = '';
         switch ($(v).attr('type')) {
            case 'radio' :
            if ($(v).is(':checked')) {
               vv = $(v).val();
               ret.push({'name':$(v).attr('name'),'value':vv});
            };
            break;
            default :
               vv = $(v).val();
               ret.push({'name':$(v).attr('name'),'value':vv});
         }
      });
      return ret;
   },
	//deprecated
   get_form_data : function (tgt) {
      var ret = [];
      $.each($(tgt).find('input,select,textarea').not('[type=button]'),function(k,v){
         var vv = '';
         switch (v.type) {
            case 'radio' :
            if (v.checked) {
               vv = v.value;
               ret.push({'name':v.name,'value':vv});
            };
            break;
            default :
               vv = v.value;
               ret.push({'name':v.name,'value':vv});
         }
      });
      return ret;
   },
   save_quiz : function (obj,callback) {
      var conf = {};
      $.each(obj,function(k,v){
         if (v.quiz_id != '' && v.quiz_title != '') {
            conf[v.name] = v.value;
         }
      });
		conf.elements = [];
		var new_len = MyOunf.quizzes.push(conf);
		if (callback && typeof callback == 'function') {
			callback({quiz_idx:new_len - 1});
		}
   },
	insert_element : function (obj,quiz_idx,callback) {
		//console.log('quiz_idx in insert_element->',quiz_idx);
      var conf = {};
      $.each(obj,function(k,v){
			//console.log('k->',k,' $(v)->',$(v));
         //if ($(v).attr('[name=element_id]').val() != '') {
            conf[$(v).attr('name')] = $(v).val();
         //}
      });
		MyOunf.quizzes[quiz_idx].elements.push(conf);
		if (callback && typeof callback == 'function') {
			callback();
		}
   },
   set_clipboard : function (obj,callback) {
      $('#clipboard').data(obj.index,obj.data);
      if (callback && typeof callback == 'function') {
         callback(obj);
      }
   },
   get_clipboard_data : function (obj) {
      var ret = false;
      //if (typeof $('#clipboard').data(obj.index) == 'number' || typeof $('#clipboard').data(obj.index) == 'string') {
		//var t_o = typeof $('#clipboard').data(obj.index);

		if (jQuery.inArray(typeof $('#clipboard').data(obj.index),['number','string','object']) >= 0) {
			ret = $('#clipboard').data(obj.index);
		}
      return ret;
   }

};
