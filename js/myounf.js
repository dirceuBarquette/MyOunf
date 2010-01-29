var MyOunf = {
	//quiz example
	quizzes : [],

	//templates
	quiz_template : {quiz_id:'',quiz_name:'',html:'',elements:[],lists:[]},
	elements_template : {elements_id:'',elements_name:'',element_type:'',question_num:'',question_text:'','el_type_html_content_text':'',entries:[]},
	entries_template : {entries_id:'',entries_name:'',entries_content:'','entries_content-fill_free-rules-content':'','entries_content-fill_free-rules-min_char':'','entries_content-fill_free-rules-max_char':'',entry_input_type:'','entries_content-fill_label-text':'', 'entries_content-fill_standardized-rules-min_opt':'','entries_content-fill_standardized-rules-max_opt':'',options:[]},
	lists_template : {lists_id:'',lists_name:'',options:[]},
	options_template : {label:'',value:''},
	entries_options_template : {label:'',value:''},

   run : function(obj_quiz,quiz_wrapper_selector) {

		var qws = quiz_wrapper_selector || '#quiz_wrapper';

		//clipboard
		$('#clipboard').data('currents',{quiz:-1,elements:-1,entries:-1,lists:-1,'lists_options':-1,'entries_options':-1});

		if (obj_quiz) {
			MyOunf.quizzes = '';
			MyOunf.quizzes = [obj_quiz];
			MyOunf.set_currents('quiz','0');
			MyOunf.set_blocks_from('quiz');
		}
		if (MyOunf.quizzes.length > 0) {
			MyOunf.set_block_list('block_list-quiz','quiz','');
		}
		$.each($('.block,.simple_block'),function(k,v){
			var selector = '#'+this.id;
			$(selector).find('.open_settings:first').bind('click',function(e){
				$(selector).find('.settings:first').addClass('disp_block');
			});
			$(selector).find('.close_settings:first').bind('click',function(e){
				$(selector).find('.settings:first').removeClass('disp_block');
			});
		});
		$.each($('.block'),function(k,v){
			var block_id = $(v).attr('id');
			var selector = '#'+block_id;
			var bid = block_id.split('block-')[1];
			$(selector).find('.block_combo:first').bind('change',function(e){
				MyOunf.set_currents(bid,this.selectedIndex - 1);
				MyOunf.set_blocks_from(bid);
				MyOunf.set_settings_view(bid,MyOunf.get_currents(bid));
			});
			$(selector).find('.add_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').show('normal',function(){
					$(this).find('input:first').focus();
					$(this).find('input[type=text]').val('');
					MyOunf.set_currents(bid,-1);//forcing null
					MyOunf.set_blocks_from(bid);
					switch (bid) {
						case 'lists_options':
							$('#block_list-lists_options').val(['']);
							$('.tochoose-lists_options').css('display','none');
							$('[name=lists_options]').val(['']);
							$(this).find('.settings').removeClass('disp_block');
							$(this).children('div[class=item_set]').show();
						break;
						case 'entries_options' :
							$('#block_list-entries_options').val(['']);
							$('.tochoose-entries_options').css('display','none');
							$('[name=entries_options]').val(['']);
							$(this).find('.settings').removeClass('disp_block');
							$(this).children('div[class=item_set]').show();
						break;
						default :
							MyOunf.set_settings_view(bid,MyOunf.get_currents(bid));
							$(selector).find('.block_combo:first').val(['']);
					}
				});
			});
			$(selector).find('.edit_global:first,.remove_global:first').bind('click',function(e){
				if (MyOunf.get_currents(bid) > -1) {
					var action = this.className.split('_')[0];
					var ipt1 = ipt2 = '';
					$(selector).find('.global_config:first').show('normal',function(){
						//if from removing
						MyOunf.change2original_global_config_view(this);
						$(this).find('input:first').focus();
						$(selector).find('.content_fieldset:first').removeClass('disp_block');
						switch (bid) {
							case 'entries_options' :
								$(this).children('div[class=item_set]').hide();
								$(this).find('.title_bar').hide('fast',function(){
									$('[name=entries_options]').val(['entries_new_option']);
									$('#settings-entries_options-entries_new_option').show();
									$(this).find('#choose_form-entries_options-entries_new_option').show();
									if (action == 'edit' && $('#set-entries_options').is(':hidden')) {
										$('#set-entries_options').show();
									}
								});
								ipt1 = $(this).find('input[type=text]:eq(0)').val($(selector).find('#block_list-entries_options option:selected').text());
								ipt2 = $(this).find('input[type=text]:eq(1)').val($(selector).find('#block_list-entries_options option:selected').val());
							break;
							case 'lists_options' :
								$(this).children('div[class=item_set]').hide();
								$(this).find('.title_bar').hide('fast',function(){
									$('[name=lists_options]').val(['new_option']);
									$('#settings-lists_options-new').show();
									$(this).find('#choose_form-lists_options-new_option').show();
									if (action == 'edit' && $('#set-lists_options').is(':hidden')) {
										$('#set-lists_options').show();
									}
								});
								ipt1 = $(this).find('input[type=text]:eq(0)').val($(selector).find('#block_list-lists_options option:selected').text());
								ipt2 = $(this).find('input[type=text]:eq(1)').val($(selector).find('#block_list-lists_options option:selected').val());
							break;
							default :
								ipt1 = $(this).find('input[type=text]:eq(0)').val($(selector).find('.block_combo:first option:selected').val());
								ipt2 = $(this).find('input[type=text]:eq(1)').val($(selector).find('.block_combo:first option:selected').text());
							break;
						}
						if (action == 'remove') {
							$(ipt1).attr({readonly:'readonly'});
							$(ipt2).attr({readonly:'readonly'});
							$('#set-'+bid).css({display:'none'});
							$('#remove-'+bid).css({display:'block'});
						}
					});
				}
			});
			$(selector).find('.cancel_adding_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').hide('normal',function(){
					MyOunf.change2original_global_config_view(this);
					MyOunf.set_currents(bid,-1);
					MyOunf.set_blocks_from(bid);
					$(selector).find('.block_combo:first').val(['']);
				});
			});
			$(selector).find('.removing_global:first').bind('click',function(e){
				if (MyOunf.get_currents(bid) > -1) {
					$(selector).find('.global_config:first').hide('normal',function(){
						var new_object_arr = '';
						switch (bid) {
							case 'quiz' :
								new_object_arr = MyOunf.remove_object(MyOunf.quizzes,MyOunf.get_currents('quiz'));
								MyOunf.quizzes = new_object_arr;
							break;
							case 'elements' :
								new_object_arr = MyOunf.remove_object(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements,MyOunf.get_currents('elements'));
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements = new_object_arr;
							break;
							case 'entries' :
								new_object_arr = MyOunf.remove_object(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries,MyOunf.get_currents('entries'));
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries = new_object_arr;
							break;
							case 'lists' :
								new_object_arr = MyOunf.remove_object(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists,MyOunf.get_currents('lists'));
								MyOunf.quizzes[MyOunf.get_currents('quiz')].lists = new_object_arr;
							break;
							case 'lists_options' :
								new_object_arr = MyOunf.remove_object(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options,MyOunf.get_currents('lists_options'));
								MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options = new_object_arr;
							break;
							case 'entries_options' :
								new_object_arr = MyOunf.remove_object(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options,MyOunf.get_currents('entries_options'));
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options = new_object_arr;
							break;
						}
						MyOunf.set_currents(bid,-1);
						MyOunf.set_block_list('block_list-'+bid,bid,'',function(obj) {
							MyOunf.set_blocks_from(bid);
						});
					});
				}
			});
			$(selector).find('.adding_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').hide('normal',function(){
					var conf = {};
					var str_id = bid+'_id',str_name = bid+'_name';
					var id = $(this).find('#'+str_id).val();
					var name = $(this).find('#'+str_name).val();
					var editing = {};
					//if from removing
					MyOunf.change2original_global_config_view(this);
					switch (bid) {
						case 'quiz' :
							if (MyOunf.get_currents('quiz') < 0) {
								conf = {quiz_id:id,quiz_name:name,html:'',elements:[],lists:[]};
								MyOunf.quizzes.push(conf);
							} else {
								editing = {quiz_id:MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_id,quiz_name:MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_name};
								MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_id = id;
								MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_name = name;
							}
						break;
						case 'elements' :
							if (MyOunf.get_currents('elements') < 0) {
								conf = {elements_id:id,elements_name:name,element_type:'',question_num:'',question_text:'',el_type_html_content_text:'',entries:[]};
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements.push(conf);
							} else {
								editing = {elements_id:MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_id,elements_name:MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_name};
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_id = id;
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_name = name;
							}
						break;
						case 'entries' :
							if (MyOunf.get_currents('entries') < 0) {
								conf = {entries_id:id,entries_name:name,entries_content:'','entries_content-fill_free-rules-content':'','entries_content-fill_free-rules-min_char':'','entries_content-fill_free-rules-max_char':'',entry_input_type:'','entries_content-fill_label-text':'','entries_content-fill_standardized-rules-min_opt':'','entries_content-fill_standardized-rules-max_opt':'',options:[]};
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries.push(conf);
							} else {
								editing = {entries_id:MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].entries_id,entries_name:MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].entries_name};
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].entries_id = id;
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].entries_name = name;
							}
						break;
						case 'lists' :
							if (MyOunf.get_currents('lists') < 0) {
								conf = {lists_id:id,lists_name:name,options:[]};
								MyOunf.quizzes[MyOunf.get_currents('quiz')].lists.push(conf);
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].lists_id = id;
								MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].lists_name = name;
							}
						break;
					}
					MyOunf.set_block_list('block_list-'+bid,bid,id,function(obj) {
						MyOunf.set_currents(bid,obj.selected);
						MyOunf.set_settings_view(bid,MyOunf.get_currents(bid));
						MyOunf.set_blocks_from(bid);
						MyOunf.mount(bid,qws,editing);
					});
				});
			});
		});
		$('.choose_form').bind('click',function(e){
			MyOunf.choose_form_handler(this);
		});
		$('.block_options_combo').bind('change',function(e){
			var bid = this.id.split('-')[1];
			MyOunf.set_currents(bid,this.selectedIndex - 1);
			MyOunf.set_blocks_from(bid);
			if ($(this).val() == '') {
				MyOunf.set_currents(bid,-1);
			}
		});
		$('#set-lists_options,#set-entries_options').bind('click',function(e){
			$(this).parents('.global_config').hide('normal',function(){
				$(this).find('.title_bar').css('display','block');
			});
			var conf = {},str = '',block2set = 'lists_options';
				if (this.id == 'set-lists_options') {
					str = $('input[name=lists_options]:checked').val();
				} else {
					str = $('input[name=entries_options]:checked').val();
					block2set = 'entries_options';
				}
			switch (str) {
				case 'new_option' :
					conf = {label:$('#lists_options_label').val(),value:$('#lists_options_value').val()};
					if (MyOunf.get_currents('lists_options') <0) {
						MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options.push(conf);
					} else {
						MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options[MyOunf.get_currents('lists_options')] = conf;
					}
				break;
				case 'from_lists' :
					$.each(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[$('#lists_available').val()].options,function(k,v){
						conf = {label:v.label,value:v.value};
						MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options.push(conf);
					});
				break;''
				case 'from_csv' :
					var w_text = $('#lists_options-from_csv-text').val().split("\n");
					$.each(w_text,function(k,v){
						var ln = v.split('";"');
						conf = {label:ln[0].substr(1),value:ln[1].substr(0,ln[1].length -1)};
						MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options.push(conf);
					});
				break;
				case 'entries_new_option' :
					conf = {label:$('#label').val(),value:$('#value').val()};
					if (MyOunf.get_currents('entries_options') < 0) {
						MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options.push(conf);
					} else {
						MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options[MyOunf.get_currents('entries_options')] = conf;
					}
					MyOunf.mount('entry_content',qws);
				break;
				case 'entries_from_lists' :
					$.each(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[$('#entries_lists_available').val()].options,function(k,v){
						conf = {label:v.label,value:v.value};
						MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options.push(conf);
					});
					MyOunf.mount('entry_content',qws);
				break;''
				case 'entries_from_csv' :
					var w_text = $('#entries_options-entries_from_csv-text').val().split("\n");
					$.each(w_text,function(k,v){
						var ln = v.split('";"');
						conf = {label:ln[0].substr(1),value:ln[1].substr(0,ln[1].length -1)};
						MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options.push(conf)
					});
					MyOunf.mount('entry_content',qws);
				break;
			}

			MyOunf.set_block_list('block_list-'+block2set,block2set,'');
			MyOunf.set_settings_view(block2set,MyOunf.get_currents(block2set));
		});
		$('.cancel_content_options').bind('click',function(e){
			$(this).parents('.global_config').hide();
		});
		$('.adding_content').bind('click',function(){
			var id = this.id.split('-')[1]
			var str = id+'_template';
			var form_data = MyOunf.get_input_data(MyOunf[str]);
			switch (id) {
				case 'elements' :
					var conf = $.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')],form_data);
					MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')] = '';
					MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')] = conf;
					MyOunf.mount('element_content',qws);
				break;
				case 'entries' :
					var conf = $.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')],form_data);
					MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')] = '';
					MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')] = conf;
					MyOunf.mount('entry_content',qws);
				break;
			}
			//console.log('current->',id,' CONF->',conf);
		});
   },
	remove_object : function (arr,to_remove) {
		var new_arr,left_slice,right_slice;
		if (arr.length - 1 == to_remove) {
			arr.pop();
			new_arr = arr
		} else {
			if (to_remove != 0) {
				left_slice = arr.slice(0,to_remove);
				right_slice = arr.slice(to_remove + 1);
				new_arr = left_slice.concat(right_slice);
			} else {
				new_arr = arr.slice(1);
			}
		}
		return new_arr;
	},
	change2original_global_config_view : function (selector) {
		$(selector).find('input').filter('[type=text]').attr({readonly:false});
		//$(selector).find('.remove_global').attr({'class':'adding_global',value:'ok'});
		$(selector).find('.removing_global').css({display:'none'});
		$(selector).find('.adding_global').css({display:'block'});
	},
	mount : function (bid,qws,editing) {
		var str = 'mount_'+bid;
		if (MyOunf.builders[str] && typeof MyOunf.builders[str] == 'function') {
			MyOunf.builders[str](qws,editing);
		}
		//saving html
		MyOunf.quizzes[MyOunf.get_currents('quiz')].html = $(qws).html();
	},
	builders : {
		mount_quiz : function (selector,editing) {
			if (!editing.quiz_id) {
				var quiz_area = $('<div></div>').attr({'class':'myounf-quiz_area',id:MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_id});
				quiz_area = $(quiz_area).append('<div id="myounf-quiz_title">'+MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_name+'</div>');
				$(quiz_area).appendTo(selector);
			} else {
				$('#'+editing.quiz_id).attr({id:MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_id});
				$('#'+MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_id).find('#myounf-quiz_title').text(MyOunf.quizzes[MyOunf.get_currents('quiz')].quiz_name);
			}
		},
		mount_elements : function (selector,editing) {
			if (!editing.elements_id) {
				var element_area = $('<div></div>').attr({'class':'myounf-element_area',id:MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_id});
				var quiz_area = $(selector).find('[class=myounf-quiz_area]');
				$(element_area).appendTo(quiz_area);
				$('<div></div>').attr({'class':'myounf-element_content'}).appendTo(element_area);
			} else {
				$('#'+editing.elements_id).attr({id:MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_id});
			}
		},
		mount_element_content : function (selector) {
			var element_id = $('#'+MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_id);
			var content_area = $(element_id).find('.myounf-element_content');
			$(content_area).html('');
			switch (MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].element_type) {
				case 'html' :
					$('<div></div>').attr({'class':'el_type_html_content_text'})
					.text(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].el_type_html_content_text).appendTo(content_area);
				break;
				case 'question' :
					if (MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].question_num != '') {
						$('<div></div>').attr({'class':'question_num'}).text(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].question_num).appendTo(content_area);
					}
					if (MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].question_text != '') {
						$('<div></div>').attr({'class':'question_text'}).text(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].question_text).appendTo(content_area);
					}
					$('<div></div>').attr({'class':'myounf-entries_area'}).appendTo(content_area);
				break;
			}
		},
		mount_entries : function (selector,editing) {
			var element_id = $('#'+MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_id);
			var content_area = $(element_id).find('.myounf-element_content');
			if (!editing.entries_id) {
				var entry_area = $('<div></div>').attr({'class':'myounf-entry_area',id:'entry_area-'+MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].entries_id});
				if ($(element_id).find('.myounf-entries_area').size() == 0) {
					$('<div></div>').attr({'class':'myounf-entries_area'}).appendTo(content_area);
				}
				$(element_id).find('.myounf-entries_area').append(entry_area);
			} else {
				$('#entry_area-'+editing.entries_id).attr({id:'entry_area-'+MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].entries_id});
			}
		},
		mount_entry_content : function (selector) {
			var element_id = $('#'+MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].elements_id);
			var myounf_entry = MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')]
			var entries_id = myounf_entry.entries_id;
			var entry_area = $(element_id).find('#entry_area-'+entries_id);
			var type = myounf_entry.entry_input_type;
			$(entry_area).html('');
			switch (myounf_entry.entries_content) {
				case 'fill_label' :
					$('<div></div>').attr({id:myounf_entry.entries_id,'class':'entry_content_label'})
					.text(myounf_entry['entries_content-fill_label-text']).appendTo(entry_area);
				break;
				case 'fill_free' :
					switch (type) {
						case 'textarea' :
							$('<textarea></textarea>').attr({id:myounf_entry.entries_id,cols:'30',rows:'5'}).appendTo(entry_area);
						break;
						default :
							$('<input />').attr({type:type,id:myounf_entry.entries_id}).appendTo(entry_area);
						break;
					}
				break;
				case 'fill_standardized' :
					switch (type) {
						case 'checklist' :
							if (myounf_entry.options.length > 0) {
								type = myounf_entry['entries_content-fill_standardized-rules-min_opt'] == "1" && myounf_entry['entries_content-fill_standardized-rules-max_opt'] == 1 ? 'radio' : 'checkbox';

								$.each(myounf_entry.options,function(k,v){
									$('<input type="'+type+'" name="'+myounf_entry.entries_id+'['+k+']" value="'+v.value+'" /><span>'+v.label+'</span>')
									.appendTo(entry_area);
								});
							}
						break;
						default :
							$('<select></select>').attr({id:myounf_entry.entries_id}).appendTo(entry_area);
							$.each(myounf_entry.options,function(k,v){
								$('<option value="'+v.value+'">'+v.label+'</option>')
								.appendTo('#'+myounf_entry.entries_id);
							});
						break;
					}
				break;
			}
		}
	},
	set_block_list : function (elmid,data_from,selected,callback) {
		var sel = '';
		var scan_into = false;
		var str_id = data_from+'_id';
		var str_name = data_from+'_nm';
		switch (data_from) {
			case 'quiz' :
				scan_into = $.map(MyOunf.quizzes,function(n,i){return {quiz_id:n.quiz_id,quiz_nm:n.quiz_name};});
			break;
			case 'elements' :
				if (MyOunf.get_currents('quiz') > -1) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements,function(n,i){return {elements_id:n.elements_id,elements_nm:n.elements_name};});
				}
			break;
			case 'lists' :
				if (MyOunf.get_currents('quiz') > -1) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists,function(n,i){return {lists_id:n.lists_id,lists_nm:n.lists_name};});
				}
			break;
			case 'entries' :
				if (MyOunf.get_currents('elements') > -1) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries,function(n,i){return {entries_id:n.entries_id,entries_nm:n.entries_name};});
				}
			break;
			case 'lists_options' :
				if (MyOunf.get_currents('lists') > -1) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options,function(n,i){return {lists_options_id:n.value,lists_options_nm:n.label};});
				}
			break;
			case 'entries_options' :
				if (MyOunf.get_currents('entries') > -1) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options,function(n,i){return {entries_options_id:n.value,entries_options_nm:n.label};});
				}
			break;
		}
		//console.log('scan_into->',scan_into,' data_from->',data_from);
		$('#'+elmid+' option:not(:empty)').remove();
		if (scan_into) {
			$.each(scan_into,function(k,v){
				$('<option value="'+v[str_id]+'">'+v[str_name]+'</option>').appendTo('#'+elmid);
				sel = v[str_id] == selected ? k : '';
			});
			$('#'+elmid).val([selected]);

		}
		if (callback && typeof callback == 'function') {
			callback({combid:$('#'+elmid),'selected':sel});
		}
	},
	get_currents : function (needed) {
		return parseInt($('#clipboard').data('currents')[needed]);
	},
	set_currents : function (current2set,val) {
		$('#clipboard').data('currents')[current2set] = val;
	},
	set_input_data : function (fname,data,callback) {
		var ret = {};
		var selector = '[name='+fname+']';
		switch ($(selector).attr('type')) {
			case 'select-one' :
				$('#'+fname).val([data]);
				ret = $('#'+fname);
			break;
			case 'radio' :
				$('input[name='+fname+']').val([data]);
				ret = $('input[name='+fname+']:checked');
			break;
			default :
				$('#'+fname).val(data);
				ret = $('#'+fname);
			break;
		}
		if (callback && typeof callback == "function") {
			callback(ret);
		}
	},
	get_input_data : function (template) {
		var ret = {},selector,val='';
		$.each(template,function(k,v){
			selector = '[name='+k+']';
			if (typeof v != 'object') {
				switch ($(selector).attr('type')) {
					case 'checkbox' :
					case 'radio' :
						val = $('input'+selector+':checked').val();
					break;
					case 'select-one' :
					default :
						val = $(selector).val();
					break;
				}
				ret[k] = val;
			}
		});
		return ret;
	},
	scan_block : function (obj) {
		$.each(obj,function(k,v){
			if (typeof v != 'object') {
				MyOunf.set_input_data(k,v);
			}
		});
	},
	set_simple_block_view : function (selector) {
		$(selector).find('.global_config').hide();
		$(selector).find('.disp_block').removeClass('disp_block');
		$(selector).find('[class^=tochoose]').hide();
	},
	set_settings_view : function (block,current) {
		var selector = '#content_block-'+block;
		if (current > -1) {
			$(selector).addClass('disp_block');
		} else {
			$(selector).removeClass('disp_block');
		}
		MyOunf.set_simple_block_view(selector);
	},
	set_blocks_from : function (block) {
		var to_scan = {};
		switch (block) {
			case 'quiz' :
				if (MyOunf.get_currents('quiz') > -1) {
					if (MyOunf.quizzes[MyOunf.get_currents('quiz')].elements.length > 0) {
						MyOunf.set_block_list('block_list-elements','elements','');
					} else {
						MyOunf.set_block_list('block_list-elements','false','');
						MyOunf.set_currents('elements',-1);
						MyOunf.set_blocks_from('elements');
					}
					if (MyOunf.quizzes[MyOunf.get_currents('quiz')].lists.length > 0) {
						MyOunf.set_block_list('block_list-lists','lists','');
					} else {
						MyOunf.set_block_list('block_list-lists','false','');
						MyOunf.set_currents('lists',-1);
						MyOunf.set_blocks_from('lists');
					}
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')]));
				} else {
					MyOunf.set_block_list('block_list-elements','false','');
					MyOunf.set_block_list('block_list-lists','false','');
					$.each($('#clipboard').data('currents'),function(k,v){
						MyOunf.set_currents(k,-1);
					});
					MyOunf.set_blocks_from('elements');
					MyOunf.set_blocks_from('lists');
					MyOunf.scan_block($.extend({},MyOunf.quiz_template));
				}
			break;
			case 'elements' :
				MyOunf.set_currents('entries',-1);
				MyOunf.set_block_list('block_list-entries','false','');
				MyOunf.scan_block($.extend({},MyOunf.entries_template));
				if (MyOunf.get_currents('elements') > -1) {
					if (MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries.length > 0) {
						MyOunf.set_block_list('block_list-entries','entries','');
					} else {
						MyOunf.set_block_list('block_list-entries','false','');
						MyOunf.set_currents('entries',-1);
						MyOunf.set_blocks_from('entries');
					}
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')]));
				} else {
					MyOunf.set_block_list('block_list-entries','false','');
					MyOunf.set_currents('entries',-1);
					MyOunf.set_blocks_from('entries');
					MyOunf.scan_block($.extend({},MyOunf.elements_template));
				}
			break;
			case 'lists' :
				MyOunf.set_currents('lists_options',-1);
				MyOunf.set_block_list('block_list-lists_options','false','');
				MyOunf.scan_block($.extend({},MyOunf.options_template));
				if (MyOunf.get_currents('lists') > -1) {
					if (MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options.length > 0) {
						MyOunf.set_block_list('block_list-lists_options','lists_options','');
					}
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')]));
				} else {
					MyOunf.set_block_list('block_list-lists_options','false','');
					MyOunf.set_currents('lists_options',-1);
					MyOunf.set_blocks_from('lists_options');
					MyOunf.scan_block($.extend({},MyOunf.lists_template));
				}
			break;
			case 'entries' :
				MyOunf.set_currents('entries_options',-1);
				MyOunf.set_block_list('block_list-entries_options','false','');
				MyOunf.scan_block($.extend({},MyOunf.entries_options_template));
				if (MyOunf.get_currents('entries') > -1) {
					if (MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options.length > 0) {
						MyOunf.set_block_list('block_list-entries_options','entries_options','');
					}
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')]));
				} else {
					MyOunf.set_block_list('block_list-entries_options','false','');
					MyOunf.set_currents('entries_options',-1);
					MyOunf.set_blocks_from('entries_options');
					MyOunf.scan_block($.extend({},MyOunf.entries_options_template));
				}
			break;
			case 'lists_options' :
				if (MyOunf.get_currents('lists_options') > -1) {
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options[MyOunf.get_currents('lists_options')]));
				}
			break;
			case 'entries_options' :
				if (MyOunf.get_currents('entries_options') > -1) {
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options[MyOunf.get_currents('entries_options')]));
				}
			break;
		}
	},
	choose_form_handler : function (obj) {
		var Obj,o_name,o_value;
		if (obj.name && obj.name != 'undefined') {
			Obj = obj;
			o_name = obj.name;
			o_value = obj.value;
		} else {
			Obj = $(obj);
			o_name = $(obj).attr('name');
			o_value = $(obj).val();
		}
		var hide_class = '.tochoose-'+o_name;
		var display_id = '#choose_form-'+o_name+'-'+o_value;
		$(hide_class).css({display:'none'});
		$(display_id).show('normal',function(){
			switch (display_id) {
				case '#choose_form-lists_options-new_option' :
					$(display_id).children('#block-lists_options-new').show('normal',function(){
						$(this).children().show();
						MyOunf.change2original_global_config_view(this);
						$('#remove-lists_options').hide();
						$('#set-lists_options').show();
					});
				break;
				case '#choose_form-entries_options-entries_new_option' :
					$(display_id).children('#block-entries_options-entries_new_option').show('normal',function(){
						$(this).children().show();
						MyOunf.change2original_global_config_view(this);
						$('#remove-entries_options').hide();
						$('#set-entries_options').show();
					});
				break;
				case '#choose_form-entries_options-entries_from_lists' :
					$('#entries_lists_available option:not(:empty)').remove();
					$.each(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists,function(k,v){
						$('<option value="'+k+'">'+v.lists_name+'</option>').appendTo('#entries_lists_available');
					});
				break;
				case '#choose_form-lists_options-from_lists' :
					$('#lists_available option:not(:empty)').remove();
					$.each(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists,function(k,v){
						if (v.lists_id != $('#block_list-lists').val()) {
							$('<option value="'+k+'">'+v.lists_name+'</option>').appendTo('#lists_available');
						}
					});
				break;
			}
		});
	}
};
