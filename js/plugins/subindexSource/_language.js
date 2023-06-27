/* JS组件语言包 */
var TEDU_LANGUAGE = {
    /* dataTable 中文 */
    _dataTable: {
        'zh-CN': {
            "processing": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.processing"],
            "lengthMenu": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.lengthMenu"],
            "zeroRecords": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.zeroRecords"],
            "info": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.info"],
            "infoEmpty": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.infoEmpty"],
            "infoFiltered": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.infoFiltered"],
            "infoPostFix": "",
            "search": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.search"],
            "url": "",
            "emptyTable": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.emptyTable"],
            "loadingRecords": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.loadingRecords"],
            "infoThousands": ",",
            "paginate": {
                "first": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_first"],
                "previous": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_previous"],
                "next": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_next"],
                "last": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_last"],
                "btnToPage": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.paginate_btnToPage"] || "跳转"
            },
            "aria": {
                "sortAscending": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.sortAscending"],
                "sortDescending": LOCAL_MESSAGE_DATA["platform.plugin.dataTable.sortDescending"]
            }
        }
    },
    /* validate 中文 */
    _validate: function () {
        var _lang_ = "platform.plugin.validate.";
        return ($.validator && {
            'zh-CN': {
                required: LOCAL_MESSAGE_DATA[_lang_ + "required"],
                remote: LOCAL_MESSAGE_DATA[_lang_ + "remote"],
                email: LOCAL_MESSAGE_DATA[_lang_ + "email"],
                url: LOCAL_MESSAGE_DATA[_lang_ + "url"],
                date: LOCAL_MESSAGE_DATA[_lang_ + "date"],
                dateISO: LOCAL_MESSAGE_DATA[_lang_ + "dateISO"],
                number: LOCAL_MESSAGE_DATA[_lang_ + "number"],
                digits: LOCAL_MESSAGE_DATA[_lang_ + "digits"],
                creditcard: LOCAL_MESSAGE_DATA[_lang_ + "creditcard"],
                equalTo: LOCAL_MESSAGE_DATA[_lang_ + "equalTo"],
                extension: LOCAL_MESSAGE_DATA[_lang_ + "extension"],
                maxlength: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "maxlength"]),
                minlength: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "minlength"]),
                rangelength: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "rangelength"]),
                range: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "range"]),
                max: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "max"]),
                min: $.validator.format(LOCAL_MESSAGE_DATA[_lang_ + "min"])
            }
        });
    },
    _select2: function () {
        if (jQuery.fn.select2 && jQuery.fn.select2.amd) {
            var e = jQuery.fn.select2.amd;
            var _lang_ = "platform.plugin.select2.";
            return e.define("select2/i18n/zh-CN", [], function () {
                return {
                    errorLoading: function () {
                        return LOCAL_MESSAGE_DATA[_lang_ + "errorLoading"]
                    },
                    inputTooLong: function (e) {
                        var t = e.input.length - e.maximum;
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "inputTooLong"], [t]);
                    },
                    inputTooShort: function (e) {
                        var t = e.minimum - e.input.length;
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "inputTooShort"], [t]);
                    },
                    loadingMore: function () {
                        return LOCAL_MESSAGE_DATA[_lang_ + "loadingMore"];
                    },
                    maximumSelected: function (e) {
                        return TEDU_MESSAGE.format(LOCAL_MESSAGE_DATA[_lang_ + "maximumSelected"], [e.maximum]);
                    },
                    noResults: function () {
                        return LOCAL_MESSAGE_DATA[_lang_ + "noResults"];
                    },
                    searching: function () {
                        return LOCAL_MESSAGE_DATA[_lang_ + "searching"];
                    }
                }
            }), {
                define: e.define,
                require: e.require
            }
        }
    },
    _datetimepicker: function () {
        var _lang_ = "platform.plugin.datetimepicker.";
        return {
            "zh-CN": {
                days: [
                    LOCAL_MESSAGE_DATA[_lang_ + "sunday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "monday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "tuesday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "wednesday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "thursday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "friday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "saturday"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sunday"]
                ],
                daysShort: [
                    LOCAL_MESSAGE_DATA[_lang_ + "sun"],
                    LOCAL_MESSAGE_DATA[_lang_ + "mon"],
                    LOCAL_MESSAGE_DATA[_lang_ + "tue"],
                    LOCAL_MESSAGE_DATA[_lang_ + "wed"],
                    LOCAL_MESSAGE_DATA[_lang_ + "thu"],
                    LOCAL_MESSAGE_DATA[_lang_ + "fri"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sat"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sun"]
                ],
                daysMin: [
                    LOCAL_MESSAGE_DATA[_lang_ + "s"],
                    LOCAL_MESSAGE_DATA[_lang_ + "m"],
                    LOCAL_MESSAGE_DATA[_lang_ + "t"],
                    LOCAL_MESSAGE_DATA[_lang_ + "w"],
                    LOCAL_MESSAGE_DATA[_lang_ + "th"],
                    LOCAL_MESSAGE_DATA[_lang_ + "f"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sa"],
                    LOCAL_MESSAGE_DATA[_lang_ + "s"]
                ],
                months: [
                    LOCAL_MESSAGE_DATA[_lang_ + "jan"],
                    LOCAL_MESSAGE_DATA[_lang_ + "feb"],
                    LOCAL_MESSAGE_DATA[_lang_ + "mar"],
                    LOCAL_MESSAGE_DATA[_lang_ + "apr"],
                    LOCAL_MESSAGE_DATA[_lang_ + "may"],
                    LOCAL_MESSAGE_DATA[_lang_ + "jun"],
                    LOCAL_MESSAGE_DATA[_lang_ + "jul"],
                    LOCAL_MESSAGE_DATA[_lang_ + "aug"],
                    LOCAL_MESSAGE_DATA[_lang_ + "sep"],
                    LOCAL_MESSAGE_DATA[_lang_ + "oct"],
                    LOCAL_MESSAGE_DATA[_lang_ + "nov"],
                    LOCAL_MESSAGE_DATA[_lang_ + "dec"]
                ],
                monthsShort: [
                    LOCAL_MESSAGE_DATA[_lang_ + "short_jan"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_feb"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_mar"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_apr"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_may"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_jun"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_jul"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_aug"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_sep"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_oct"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_nov"],
                    LOCAL_MESSAGE_DATA[_lang_ + "short_dec"]
                ],
                today: LOCAL_MESSAGE_DATA[_lang_ + "today"],
                clear: LOCAL_MESSAGE_DATA[_lang_ + "clear"],
                suffix: [],
                meridiem: [LOCAL_MESSAGE_DATA[_lang_ + "am"], LOCAL_MESSAGE_DATA[_lang_ + "pm"]],
                format: LOCAL_MESSAGE_DATA[_lang_ + "format"],
                weekStart: 1
            }
        }
    }(),
    _daterangepicker: function () {
        var _lang_ = "platform.plugin.datetimepicker.";
        return {
            firstDay: 1,
            separator: " - ",
            //fromLabel: "From",
            //toLabel: "To",
            applyLabel: LOCAL_MESSAGE_DATA["platform.plugin.com_btn.confirm"],
            cancelLabel: LOCAL_MESSAGE_DATA["platform.plugin.com_btn.cancel"],
            customRangeLabel: "自定义",
            weekLabel: "W",
            daysOfWeek: [
                LOCAL_MESSAGE_DATA[_lang_ + "s"],
                LOCAL_MESSAGE_DATA[_lang_ + "m"],
                LOCAL_MESSAGE_DATA[_lang_ + "t"],
                LOCAL_MESSAGE_DATA[_lang_ + "w"],
                LOCAL_MESSAGE_DATA[_lang_ + "th"],
                LOCAL_MESSAGE_DATA[_lang_ + "f"],
                LOCAL_MESSAGE_DATA[_lang_ + "sa"]
            ],
            monthNames: [
                LOCAL_MESSAGE_DATA[_lang_ + "jan"],
                LOCAL_MESSAGE_DATA[_lang_ + "feb"],
                LOCAL_MESSAGE_DATA[_lang_ + "mar"],
                LOCAL_MESSAGE_DATA[_lang_ + "apr"],
                LOCAL_MESSAGE_DATA[_lang_ + "may"],
                LOCAL_MESSAGE_DATA[_lang_ + "jun"],
                LOCAL_MESSAGE_DATA[_lang_ + "jul"],
                LOCAL_MESSAGE_DATA[_lang_ + "aug"],
                LOCAL_MESSAGE_DATA[_lang_ + "sep"],
                LOCAL_MESSAGE_DATA[_lang_ + "oct"],
                LOCAL_MESSAGE_DATA[_lang_ + "nov"],
                LOCAL_MESSAGE_DATA[_lang_ + "dec"]
            ],
            format: LOCAL_MESSAGE_DATA[_lang_ + "format"].replace("yyyy", "YYYY").replace("mm", "MM").replace("dd", "DD")
                .replace("hh", "HH").replace("ii", "mm")
        }
    }
};