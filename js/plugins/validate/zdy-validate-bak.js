/*
 * Last modified time :2017-06-07
 */
/*只输入字母*/	
TEDU_MESSAGE.set({
	"valid_letter":{"zh-CN":"只能输入英文字母"},
	"valid_chinese":{"zh-CN":"只能输入汉字"},
	"valid_numAndLetter":{"zh-CN":"必须同时包含数字和字母"},
	"valid_email":{"zh-CN":"邮箱格式错误"},
	"valid_phone":{"zh-CN":"手机号格式错误"},
	"valid_idCaid":{"zh-CN":"身份证格式错误"},
	"valid_zipCode":{"zh-CN":"邮政编码格式错误"},
	"valid_numOrLetter":{"zh-CN":"只能输入字母或数字"},
	"valid_numOrLetterOrUline":{"zh-CN":"只能输入字母、下划线或数字"},
	"valid_require_from_group":{"zh-CN":"请至少填写{0}个字段。"},
	"valid_skip_or_fill_minimum":{"zh-CN":"请跳过这些字段或至少填写{0}个字段"}
});
/*只输入字母*/
$.validator.addMethod("ck-letter",function(value,element,params){  
	var reg_=/^[a-zA-Z]+$/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valid_letter'));
/*只输入字母或数字*/
$.validator.addMethod("ck-numorletter",function(value,element,params){  
	var reg_=/^[0-9a-zA-Z]+$/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valid_numOrLetter'));
/*只输入字母或数字或下划线*/
$.validator.addMethod("ck-numorletteroruline",function(value,element,params){  
	var reg_=/^[0-9a-zA-Z_]+$/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valid_numOrLetterOrUline'));
/*只输入汉字*/
$.validator.addMethod("ck-chinese",function(value,element,params){  
	var reg_=/^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valid_chinese'));
/*必须同时包含数字和字母(同时存在)*/
$.validator.addMethod("ck-numandletter",function(value,element,params){  
	var reg_=/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valid_numAndLetter'));
/*邮箱验证*/
$.validator.addMethod("ck-email",function(value,element,params){  
	var reg_=/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valid_email'));
/*手机验证*/
$.validator.addMethod("ck-phone",function(value,element,params){  
	var reg_=/^((?!1{11})1\d{10})|((?!1{10})1\d{9})$/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valid_phone'));
/*身份验证*/
/*$.validator.addMethod("ck-idcard",function(value,element,params){  
	var reg_=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valIdCaid'));*/
$.validator.addMethod("ck-idcard",function(value,element,params){
	var len, re, type_;
	num = value.toUpperCase();  
	//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
	if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))){
		type_=false;
	}else{
	//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	//下面分别分析出生日期和校验位
		len = num.length; 
		if (len == 15){
			re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/); 
			var arrSplit = num.match(re); 
		
			//检查生日日期是否正确
			var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]); 
			var bGoodDay; 
			bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 
			if (!bGoodDay){
				type_=false;
			}else{
				//将15位身份证转成18位
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
				var nTemp = 0, i;   
				num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6); 
				for(i = 0; i < 17; i ++){
					nTemp += num.substr(i, 1) * arrInt[i];
				} 
				num += arrCh[nTemp % 11];   
				type_=true;   
			}   
		}else if(len == 18){
			re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/); 
			var arrSplit = num.match(re); 
			 
			//检查生日日期是否正确
			var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]); 
			var bGoodDay; 
			bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 
			if(!bGoodDay){ 
				type_=false; 
			}else{ 
				//检验18位身份证的校验码是否正确。
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				var valnum; 
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
				var nTemp = 0, i; 
				for(i = 0; i < 17; i ++){ 
					nTemp += num.substr(i, 1) * arrInt[i]; 
				} 
				valnum = arrCh[nTemp % 11]; 
				if (valnum != num.substr(17, 1)){
					type_=false;
				} 
				type_=true; 
			} 
		}
	}
	return this.optional(element) || type_;
},TEDU_MESSAGE.get('valid_idCaid'));
/*邮编验证*/
$.validator.addMethod("ck-zipcode",function(value,element,params){  
	var reg_=/^[1-9]\d{5}(?!\d)$/;
	return this.optional(element) || reg_.test(value);
},TEDU_MESSAGE.get('valid_zipCode'));
/*
 * 一组元素中至少N项被填写
 * @example
 * 两个元素中至少填写一项
 * <input class="productinfo" name="partnumber">
 * <input class="productinfo" name="description">
 * 
 * partnumber:	{require_from_group: [1,".productinfo"]},
 * description: {require_from_group: [1,".productinfo"]}
 *
 * options[0]: 组中至少填写的字段数
 * options[1]: CSS选择器，用于定义有条件的字段组
 */
$.validator.addMethod( "require_from_group", function( value, element, options ) {
	var $fields = $( options[ 1 ], element.form ),
		$fieldsFirst = $fields.eq( 0 ),
		validator = $fieldsFirst.data( "valid_req_grp" ) ? $fieldsFirst.data( "valid_req_grp" ) : $.extend( {}, this ),
		isValid = $fields.filter( function() {
			return validator.elementValue( this );
		} ).length >= options[ 0 ];
	$fieldsFirst.data( "valid_req_grp", validator );
	if ( !$( element ).data( "being_validated" ) ) {
		$fields.data( "being_validated", true );
		$fields.each( function() {
			validator.element( this );
		} );
		$fields.data( "being_validated", false );
	}
	return isValid;
}, TEDU_MESSAGE.get('valid_require_from_group'));

/*
 * 一组元素中至少N项被填写 或者 都不填写
 * @example
 * 三个元素中至少填写两项或都不填写
 * <input class="productinfo" name="partnumber">
 * <input class="productinfo" name="description">
 * <input class="productinfo" name="color">
 *
 * partnumber:	{skip_or_fill_minimum: [2,".productinfo"]},
 * description: {skip_or_fill_minimum: [2,".productinfo"]},
 * color:		{skip_or_fill_minimum: [2,".productinfo"]}
 *
 * options[0]: 组中至少填写的字段数
 * options[1]: CSS选择器，用于定义有条件的字段组 *
 */
$.validator.addMethod( "skip_or_fill_minimum", function( value, element, options ) {
	var $fields = $( options[ 1 ], element.form ),
		$fieldsFirst = $fields.eq( 0 ),
		validator = $fieldsFirst.data( "valid_skip" ) ? $fieldsFirst.data( "valid_skip" ) : $.extend( {}, this ),
		numberFilled = $fields.filter( function() {
			return validator.elementValue( this );
		} ).length,
		isValid = numberFilled === 0 || numberFilled >= options[ 0 ];
	$fieldsFirst.data( "valid_skip", validator );
	if ( !$( element ).data( "being_validated" ) ) {
		$fields.data( "being_validated", true );
		$fields.each( function() {
			validator.element( this );
		} );
		$fields.data( "being_validated", false );
	}
	return isValid;
}, TEDU_MESSAGE.get('valid_skip_or_fill_minimum'));
