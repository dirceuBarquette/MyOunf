var MyOunf = {
	//quiz example
	quizzes : [{'quiz_id':'q1','quiz_name':"Diagnóstico de Campo",'elements':[],'lists':[]}],

	//templates
	quiz_template : {quiz_id:'',quiz_name:'',elements:[],lists:[]},
	elements_template : {elements_id:'',elements_name:'',element_type:'',question_num:'',question_text:'','el_type-html-content-text':'',entries:[]},
	entries_template : {entries_id:'',entries_name:'',entries_content:'','entries_content-fill_free-rules-content':'','entries_content-fill_free-rules-min_char':'','entries_content-fill_free-rules-max_char':'',entry_input_type:'', 'entries_content-fill_standardized-rules-min_opt':'','entries_content-fill_standardized-rules-max_opt':'',options:[]},
	lists_template : {lists_id:'',lists_name:'',options:[]},
	options_template : {label:'',value:''},
	entries_options_template : {label:'',value:''},

   run : function(obj_quiz) {
		//clipboard
		$('#clipboard').data('currents',{quiz:-1,elements:-1,entries:-1,lists:-1,'lists_options':-1,'entries_options':-1});
		/*
		MyOunf.quizzes[0].elements = diag_de_campo;
		$('<textarea cols="50" rows="20"></textarea>').attr('id','save_all').css({overflow:'scroll'}).appendTo('body');
		$('#save_quizzes').bind('click',function(e){
			var str = '',i = 0;
			$.each(MyOunf.quizzes[0].elements,function(key,val){
				$.each(MyOunf.elements_template,function(k,v){
					if (i == 0){str += "{\r\n";}
					if(typeof v != 'object') {
						str += "\t"+'"'+k+'":"'+MyOunf.quizzes[0].elements[key][k]+'",'+"\r\n";
						i++;
					} else {
						var str_ents = '';
						$.each(MyOunf.quizzes[0].elements[key].entries,function(kent,vent){
							var e = 0;
							$.each(MyOunf.entries_template,function(ket,vet){
								if (e == 0) {str_ents += "\r\n\t{";}
								str_ents += "\r\n\t\t"+'"'+ket+'":"'+MyOunf.quizzes[0].elements[key].entries[kent][ket]+'"';
								if (e < 8){str_ents += ",";}
								e++;
							});
							str_ents += "\r\n\t}";
							if ((kent +1) < MyOunf.quizzes[0].elements[key].entries.length){str_ents +=","}
						})
						str += "\tentries:["+str_ents+"]"+"\r\n}";
						if ((key + 1) < MyOunf.quizzes[0].elements.length){str +=",\r\n";}
						i = 0;
					}
				});
			});
			$('#save_all').val(str);
		});
*/
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
				MyOunf.set_currents(bid,this.selectedIndex - 1);
				MyOunf.set_blocks_from(bid);
            if ($(this).val() != '') {
               $(selector).find('.content_fieldset:first').show('normal',function(){
						MyOunf.choose_form_handler($('#'+this.id).find('.choose_form:checked'));
					});
            } else {
               MyOunf.set_currents(bid,-1);
            }
			});
			$(selector).find('.add_global:first').bind('click',function(e){
				$(selector + ' .settings').find('[class^=tochoose]:visible').hide();
				$(selector).find('.global_config:first').show('normal',function(){
					$(this).find('input:first').focus();
					$(selector).find('.content_fieldset:first').css({display:'none'});
					$(this).find('input[type=text]').val('');
					MyOunf.set_currents(bid,-1);//forcing to null
					MyOunf.set_blocks_from(bid);
					if (bid != 'lists_options') {
						$(selector).find('.block_combo:first').val(['']);
					} else {
						$('#block_list-lists_options option').val(['']);
						$(this).children('div[class=item_set]').show();
					}
				});
			});
			$(selector).find('.edit_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').show('normal',function(){
					$(this).find('input:first').focus();
					$(selector).find('.content_fieldset:first').css({display:'none'});
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
				});
			});
			$(selector).find('.cancel_adding_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').hide();
			});

			$(selector).find('.adding_global:first').bind('click',function(e){
				$(selector).find('.global_config:first').hide('normal',function(){
				var conf = {};
					var str_id = bid+'_id',str_name = bid+'_name';
					var id = $(this).find('#'+str_id).val();
					var name = $(this).find('#'+str_name).val();
					switch (bid) {
						case 'quiz' :
							conf = {quiz_id:'',quiz_name:'',elements:[],lists:[]};
							conf[str_id] = id;
							conf[str_name] = name;
							if (MyOunf.get_currents('quiz') < 0) {
								MyOunf.quizzes.push(conf);
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quiz')] = $.extend({},conf);
							}
						break;
						case 'elements' :
							conf = {elements_id:'',elements_name:'',element_type:'',question_num:'',question_text:'','el_type-html-content-text':'',entries:[]};
							conf[str_id] = id;
							conf[str_name] = name;
							if (MyOunf.get_currents('elements') < 0) {
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements.push(conf);
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')] = $.extend({},conf);
							}
						break;
						case 'entries' :
							conf = {entries_id:'',entries_name:'',entries_content:'','entries_content-fill_free-rules-content':'','entries_content-fill_free-rules-min_char':'','entries_content-fill_free-rules-max_char':'',entry_input_type:'', 'entries_content-fill_standardized-rules-min_opt':'','entries_content-fill_standardized-rules-max_opt':'',options:[]};
							conf[str_id] = id;
							conf[str_name] = name;
							if (MyOunf.get_currents('entries') < 0) {
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries.push(conf);
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')] = $.extend({},conf);
							}
						break;
						case 'lists' :
							conf = {lists_id:'',lists_name:'',options:[]};
							conf[str_id] = id;
							conf[str_name] = name;
							if (MyOunf.get_currents('lists') < 0) {
								MyOunf.quizzes[MyOunf.get_currents('quiz')].lists.push(conf);
							} else {
								MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')] = $.extend({},conf);
							}
						break;
					}
					MyOunf.set_block_list('block_list-'+bid,bid,id,function(obj) {
						$(selector).find('.content_fieldset:first').show();
						MyOunf.set_currents(bid,obj.selected);
						//console.log('currents->',$('#clipboard').data('currents'),' selected->',obj.selected);
						MyOunf.set_blocks_from(bid);
					});
				});
			});
		});
		$('.choose_form').bind('click',function(e){
			MyOunf.choose_form_handler(this);
		});
		$('#set_content_options-option,#set_content_options-entries_option').bind('click',function(e){
			$(this).parents('.global_config').hide();
			var conf = {},str = '',block2set = 'lists_options';
				if (this.id == 'set_content_options-option') {
					str = $('input[name=lists_options]:checked').val();
				} else {
					str = $('input[name=entries_options]:checked').val();
					block2set = 'entries_options';
				}
				//var str = this.id == 'set_content_options-option' ? $('input[name=lists_options]:checked').val() : $('input[name=entries_options]:checked').val();
			switch (str) {
				case 'new_option' :
					conf = {label:'',value:''};
					conf.label = $('#label').val();
					conf.value = $('#value').val();
					MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options.push(conf);
				break;
				case 'from_lists' :
					$.each(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[$('#lists_available').val()].options,function(k,v){
						conf = {label:'',value:''};
						conf.label = v.label;
						conf.value = v.value;
						MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options.push(conf);
					});
					//conf = MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[$('#lists_available').val()].options;
				break;''
				case 'from_csv' :
					var w_text = $('#lists_options-from_csv-text').val().split("\n");
					$.each(w_text,function(k,v){
						var ln = v.split('";"');
						//console.log('ln->',ln);
						conf = {label:'',value:''};
						conf.label = ln[0].substr(1);
						conf.value = ln[1].substr(0,ln[1].length -1);
						MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options.push(conf);
					});
				break;
				case 'entries_new_option' :
					conf = {label:'',value:''};
					conf.label = $('#label').val();
					conf.value = $('#value').val();
					MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options.push(conf);
				break;
				case 'entries_from_lists' :
					$.each(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[$('#entries_lists_available').val()].options,function(k,v){
						conf = {label:'',value:''};
						conf.label = v.label;
						conf.value = v.value;
						MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options.push(conf);
					});
					//conf = MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[$('#lists_available').val()].options;
				break;''
				case 'entries_from_csv' :
					var w_text = $('#entries_options-entries_from_csv-text').val().split("\n");
					$.each(w_text,function(k,v){
						var ln = v.split('";"');
						//console.log('ln->',ln);
						conf = {label:'',value:''};
						conf.label = ln[0].substr(1);
						conf.value = ln[1].substr(0,ln[1].length -1);
						MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options.push(conf)
					});
				break;
			}

			MyOunf.set_block_list('block_list-'+block2set,block2set,'');
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
				break;
				case 'entries' :
					MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')] = '';
					MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')] = conf;
				break;
			}
			//console.log('current->',id,' CONF->',conf);
		});
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
				//console.log('cur_list->',MyOunf.get_currents('lists'));
				if (MyOunf.get_currents('lists') > -1) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('lists')].options,function(n,i){return {lists_options_id:n.value,lists_options_nm:n.label};});
				}
			break;
			case 'entries_options' :
				//console.log('cur_list->',MyOunf.get_currents('lists'));
				if (MyOunf.get_currents('entries') > -1) {
					scan_into = $.map(MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options,function(n,i){return {entries_options_id:n.value,entries_options_nm:n.label};});
				}
			break;
		}
		//console.log('scan_into->',scan_into,' data_from->',data_from);
		$('#'+elmid+' option:not(:empty)').remove();
		if (scan_into) {
			//var str_i = data_from+'_id';
			//var str_n = data_from+'_name';
			$.each(scan_into,function(k,v){
				//console.log('k->',k,' v->',v);
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
					//case 'select-one' :
					//	val = $(selector+':selected').val();
					//break;
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
				//console.log('currents in set_blocks_from->',$('#clipboard').data('currents'));
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
				if (MyOunf.get_currents('entries') > -1) {
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')]));
				} else {
					to_scan = $.extend({},MyOunf.entries_template);
				}
			break;
			case 'lists_options' :
				if (MyOunf.get_currents('lists_options') > -1) {
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].lists[MyOunf.get_currents('listts')].options[MyOunf.get_currents('lists_options')]));
				} else {
					to_scan = $.extend({},MyOunf.options_template);
				}
			break;
			case 'entries_options' :
				if (MyOunf.get_currents('entries_options') > -1) {
					MyOunf.scan_block($.extend({},MyOunf.quizzes[MyOunf.get_currents('quiz')].elements[MyOunf.get_currents('elements')].entries[MyOunf.get_currents('entries')].options[MyOunf.get_currents('entries_options')]));
				} else {
					to_scan = $.extend({},MyOunf.entries_options_template);
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
		//console.log('display_id->',display_id,hide_class)
		$(hide_class).css({display:'none'});
		$(display_id).show('normal',function(){
			//console.log('display_id->',display_id,hide_class);
			switch (display_id) {
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
