var MyOunf = {
	//quizzes : [],
	quizzes : [{id:"a", name:"aa", elements:[{id:"q", name:"qq",'element_type':'question',question_num:'1',question_text:'texto da q 1',entries:[{id:"s", name:"ss", blah:[], entries_content:"fill_free", 'entries_content-fill_free-rules-content':"rules-allows_all_char", 'entries_content-fill_free-rules-min_char':"1", 'entries_content-fill_free-rules-max_char':"11", entry_input_type:"text", 'entries_content-fill_standardized-rules-min_opt':"", 'entries_content-fill_standardized-rules-max_opt':""}]}], lists:[{id:"q", name:"qq", options:[{label:"w", value:"s"}]}]}],
	quiz_template : {id:'',name:'',elements:[],lists:[]},
	element_template : {id:'',name:'',entries:[]},
	entrie_template : {id:'',name:'',blah:[]},
	lists_template : {id:'',name:'',options:[]},
	options_template : {label:'',value:''},
   run : function() {
		$('#clipboard').data('currents',{quizzes:-1,elements:-1,entries:-1,lists:-1,'lists-options':-1});
		if (MyOunf.quizzes.length > 0) {
			MyOunf.set_block_list('block_list-quizzes','quizzes','');
		}
		$.each($('.block,.simple_block'),function(k,v){
			var selector = '#'+this.id;
			$(selector).find('.open_settings:first').bind('click',function(e){
				$(selector).find('.settings:first').show();
			});
			$(selector).find('.close_settings:first').bind('click',function(e){
				$(selector).find('.settings:first').hide();
			});
		});
		$.each($('.block'),function(k,v){
			var block_id = $(v).attr('id');
			var selector = '#'+block_id;
			var bid = block_id.split('block-')[1];
			$(selector).find('.block_combo:first').bind('change',function(e){
				if ($(this).val() != '') {
					MyOunf.set_currents(bid,this.selectedIndex - 1);
					$(selector).find('.content_fieldset:first').show();
				} else {
					MyOunf.set_currents(bid,-1);
					$(selector).find('.content_fieldset:first').css({display:'none'});
					$(selector).find('.global_config:first').css({display:'none'});
				}
				MyOunf.set_block_data(bid,'');
			});
			$(selector).find('.add_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').show('normal',function(){
					$(selector).find('.content_fieldset:first').css({display:'none'});
					$(this).find('input[type=text]').val('');
					if (bid != 'lists_options') {
						$(selector).find('.block_combo:first option:eq(0)').attr({selected:true});
					} else {
						$('#block_list-lists_options option').val(['']);
						$(this).children('div[class=item_set]').show();
					}
					MyOunf.set_currents(bid,-1);
					MyOunf.set_block_data(bid,'adding');
					//console.log('bid->',bid);
				});
			});
			$(selector).find('.edit_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').show('normal',function(){
					switch (bid) {
						case 'lists_options' :
							$(this).children('div[class=item_set]').hide();
							$(this).find('#choose_form-lists_options-new_option').show('normal',function(){
								$(this).find('input[type=text]:eq(0)').val($(selector).find('#block_list-lists_options option:selected').text());
								$(this).find('input[type=text]:eq(1)').val($(selector).find('#block_list-lists_options option:selected').val());
							});
						break;
						default :
							$(this).find('input[type=text]:eq(0)').val($(selector).find('.block_combo:first option:selected').val());
							$(this).find('input[type=text]:eq(1)').val($(selector).find('.block_combo:first option:selected').text());
						break;
					}
					//console.log('bid->',bid);
				});
			});
			$(selector).find('.cancel_adding_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').hide();
			});

			$(selector).find('.adding_global:first').bind('click',function(e){
				var conf = {};
				$(selector).find('.global_config:first').hide('normal',function(){
					var id = $(this).find('#'+bid+'-id').val();
					var name = $(this).find('#'+bid+'-name').val();
					switch (bid) {
						case 'quizzes' :
							conf = $.extend({},MyOunf.quiz_template);
							conf.id = id;
							conf.name = name;
							//console.log('block_combo_val->',block_combo_val);
							if (MyOunf.get_currents('quizzes') < 0) {
								MyOunf.quizzes.push(conf);
								MyOunf.set_block_data(bid,'');
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quizzes')] = $.extend({},conf);
							}
						break;
						case 'elements' :
							conf = $.extend({},MyOunf.element_template);
							conf.id = id;
							conf.name = name;
							if (MyOunf.get_currents('elements') < 0) {
								MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements.push(conf);
								MyOunf.set_block_data(bid,'');
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements[MyOunf.get_currents('elements')] = $.extend({},conf);
							}
						break;
						case 'entries' :
							conf = $.extend({},MyOunf.entrie_template);
							conf.id = id;
							conf.name = name;
							if (MyOunf.get_currents('entries') < 0) {
								MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements[MyOunf.get_currents('elements')].entries.push(conf);
								MyOunf.set_block_data(bid,'');
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')] = $.extend({},conf);
							}
						break;
						case 'lists' :
							conf = $.extend({},MyOunf.lists_template);
							conf.id = id;
							conf.name = name;
							if (MyOunf.get_currents('lists') < 0) {
								MyOunf.quizzes[MyOunf.get_currents('quizzes')].lists.push(conf);
								MyOunf.set_block_data(bid,'');
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quizzes')].lists[MyOunf.get_currents('lists')] = $.extend({},conf);
							}
						break;
					}
					//console.log('---> conf->',conf,' quizzes->',MyOunf.quizzes);
					MyOunf.set_block_list('block_list-'+bid,bid,id,function(obj) {
						$(selector).find('.content_fieldset:first').show();
						MyOunf.set_currents(bid,obj.selected);
					});
				});
			});
		});
		$('.choose_form').bind('click',function(e){
			MyOunf.choose_form_handler(this);
		});
		$('#set_content_options-option').bind('click',function(e){
			$(this).parents('.global_config').hide();
			var conf = {};
			var inputs = {
				new_option:[$('#label'),$('#value')],
				from_lists:[$('#lists_available')],
				from_db:[$('#lists_options-from_db-table_name'),$('#lists_options-from_db-field_name_for_label'),$('#lists_options-from_db-field_name_for_value'),$('#lists_options-from_db-filtered_by')]
			};
			var str = $('input[name=lists_options]:checked').val();
			switch (str) {
				case 'new_option' :
					conf = $.extend({},MyOunf.options_template);
					conf.label = $('#label').val();
					conf.value = $('#value').val();
				break;
				case 'from_lists' :
					var needed = $('#lists_available option').index($('#lists_available option:seleced'));
					//conf = MyOunf.get_currents('quizzes').lists[needed];
				break;
				case 'from_db' :
				break;
			}
			MyOunf.quizzes[MyOunf.get_currents('quizzes')].lists[MyOunf.get_currents('lists')].options.push(conf);
			//console.log('conf->',conf);
			MyOunf.set_block_list('block_list-lists_options','lists_options',conf.value);
		});
		$('.cancel_content_options').bind('click',function(e){
			$(this).parents('.global_config').hide();
		});
		$('.adding_content').bind('click',function(){
			var inputs = {
				element:[$('input[name=element_type]:checked'),$('#el_type-html-content-text'),$('#question_num'),$('#question_text')],
				entry:[$('input[name=entries_content]:checked'),$('#entries_content-fill_free-rules-content'),$('#entries_content-fill_free-rules-min_char'),$('#entries_content-fill_free-rules-max_char'),$('input[name=entry_input_type]:checked'),$('#entries_content-fill_standardized-rules-min_opt'),$('#entries_content-fill_standardized-rules-max_opt')]
			};
			var str = this.id.split('-')[1];
			var form_data = MyOunf.get_input_data(inputs[str]);
			//console.log('form_data->',form_data);
			$.each(form_data,function(k,v){
				//console.log('k->',k,' v->',v);
				if (v.name && v.name != 'undefined') {
					switch (str) {
						case 'element' :
							MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements[MyOunf.get_currents('elements')][v.name] = v.value;
						break;
						case 'entry' :
							MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')][v.name] = v.value;
						break;
					}
				}
			});
			//console.log('form_data->',form_data);
		});
   },
	set_block_list : function (elmid,data_from,selected,callback) {
		//console.log('data_from->',data_from);
		var sel = '';
		var scan_into = false;
		switch (data_from) {
			case 'quizzes' :
				scan_into = $.map(MyOunf.quizzes,function(n,i){return n;});
			break;
			case 'elements' :
				if (MyOunf.get_currents('quizzes') >= 0) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements,function(n,i){return n;});
				}
			break;
			case 'lists' :
				if (MyOunf.get_currents('quizzes') >= 0) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quizzes')].lists,function(n,i){return n;});
				}
			break;
			case 'entries' :
				if (MyOunf.get_currents('elements') >= 0) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements[MyOunf.get_currents('elements')].entries,function(n,i){return n;});
				}
			break;
			case 'lists_options' :
				if (MyOunf.get_currents('lists') >= 0) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quizzes')].lists[MyOunf.get_currents('lists')].options,function(n,i){return {id:n.value,name:n.label};});
				}
			break;
		}
		////console.log('scan_into->',scan_into);
		$('#'+elmid+' option:not(:empty)').remove();
		if (scan_into) {
			$.each(scan_into,function(k,v){
				$('<option value="'+v.id+'">'+v.name+'</option>').appendTo('#'+elmid);
				sel = v.id == selected ? k : '';
			});
			$('#'+elmid+' option').filter('[value='+selected+']').attr({'selected':'selected'});

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
	set_input_data : function (obj,data,callback) {
		var ret = {};
		switch (obj.t) {
			case 'select-one' :
				$('#'+obj.s).val([data]);
				ret = $('#'+obj.s);
			break;
			case 'radio' :
				$('input[name='+obj.s+']').val([data]);
				ret = $('input[name='+obj.s+']:checked');
			break;
			default :
				$('#'+obj.s).val(data);
				ret = $('#'+obj.s);
			break;
		}
		if (callback && typeof callback == "function") {
			callback(ret);
		}
	},
	set_block_data : function (block,action,values_obj,callback) {
		//console.log('set_block_data->',block);
		switch (block) {
			case 'quizzes' :
				if (action == 'adding') {
					$.each($('#clipboard').data('currents'),function(k,v){
						MyOunf.set_currents(k,-1);
					});
				}
				MyOunf.set_block_list('block_list-elements','elements','');
				MyOunf.set_block_list('block_list-lists','lists','');
				MyOunf.set_block_list('block_list-entries','entries','');
			break;
			case 'entries' :
				if (action == 'adding') {
					MyOunf.set_currents('entries',-1);
				}
				//MyOunf.set_block_list('block_list-entries','entries','');
				var inputs = [{s:'entries_content',t:'radio'},{s:'entries_content-fill_free-rules-min_char',t:'text'},{s:'entries_content-fill_free-rules-max_char',t:'text'},{s:'entry_input_type',t:'radio'},{s:'entries_content-fill_free-rules-content',t:'select-one'},{s:'entries_content-fill_standardized-rules-min_opt',t:'text'},{s:'entries_content-fill_standardized-rules-max_opt',t:'text'}];
				var elem = {};
				var def_value = "";
				if (MyOunf.get_currents('entries') >= 0) {
					elem = $.extend({},MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')]);
				}
				$.each(inputs,function(k,v){
					var str = v.s;
					if (elem[str]) {
						def_value = elem[str];
					} else {
						def_value = "";
					}

					//console.log('selector->',inputs[k],' elem->',elem,' def_value->',def_value);
					MyOunf.set_input_data(inputs[k],def_value,function(obj){
						//console.log('OBJ->',obj);
						if ($(obj).hasClass('choose_form')) {
							MyOunf.choose_form_handler($(obj));
						}
					});
				});
			break;
			case 'elements' :
				if (action == 'adding') {
					MyOunf.set_currents('entries',-1);
				}
				MyOunf.set_block_list('block_list-entries','entries','');
				//var inputs = [{s:'element_type',t:'radio'},{s:'el_type-html-content-text',t:'text'},{s:'question_num',t:'text'},{s:'question_text',t:'text'},{s:'entries_content-fill_free-rules-min_char',t:'text'},{s:'entries_content-fill_free-rules-max_char',t:'text'},{s:'entry_input_type',t:'radio'},{s:'entries_content-fill_standardized-rules-min_opt',t:'text'},{s:'entries_content-fill_standardized-rules-max_opt',t:'text'}];
				var inputs = [{s:'element_type',t:'radio'},{s:'el_type-html-content-text',t:'text'},{s:'question_num',t:'text'},{s:'question_text',t:'text'}];
				var elem = {};
				var def_value = "";
				if (MyOunf.get_currents('elements') >= 0) {
					elem = $.extend({},MyOunf.quizzes[MyOunf.get_currents('quizzes')].elements[MyOunf.get_currents('elements')]);
				}
				$.each(inputs,function(k,v){
					var str = v.s;
					if (elem[str]) {
						def_value = elem[str];
					} else {
						def_value = "";
					}

					//console.log('selector->',inputs[k],' elem->',elem,' def_value->',def_value);
					MyOunf.set_input_data(inputs[k],def_value,function(obj){
						//console.log('OBJ->',obj);
						if ($(obj).hasClass('choose_form')) {
							MyOunf.choose_form_handler($(obj));
						}
					});
				});
			break;
			case 'lists_options' :
				if (action == 'adding') {
					MyOunf.set_currents('lists_options',-1);
				}
			break;
			case 'lists' :
				if (action == 'adding') {
					MyOunf.set_currents('lists_options',-1);
				}
				MyOunf.set_block_list('block_list-lists_options','lists_options','');
			break;
		}
		if (callback && typeof callback == "function") {
			callback();
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
			$(Obj).find('.settings').show('normal',function(){
				switch (display_id) {
					case 'choose_form-lists_options-new_option' :
						$('#lists_available option:not(:empty)').remove();
						$.each(MyOunf.quizzes[MyOunf.get_currents('quizzes')].lists,function(k,v){
							if (v.id != MyOunf.get_currents('lists')) {
								$('<option value="'+v.id+'">'+v.name+'</option>').appendTo('#lists_available');
							}
						});
					break;
				}
			});
		});
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
		//console.log('ret->',ret);
      return ret;
   }
};
