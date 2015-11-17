var govau_calendar = window.govau_calendar || {};

(function(window, document, $, govau_calendar) {
    govau_calendar.bookAppointmentCalendar = (function() {
        var booking_json;
        var arr_available_bookings = "";
        var selected_booking_slot = 0;
        var dateSwitcher = $(".date-switcher");
        var calendar = $(".booking-calendar");
        var startDate;
        var endDate;
        var slides;
        var daysPerSlide;
        var currentSlide;
        var timeout;
        var slot_arr = {
            complete: [],
            morning: [],
            afternoon: [],
            no_of_slots: 0,
            slot_length: 0,
            start_time: 0,
            end_time: 0,
            m_last_index: 700,
            a_last_index: 1040
        };
        var monthConv = {
            jan: "January",
            feb: "February",
            mar: "March",
            apr: "April",
            may: "May",
            jun: "June",
            jul: "July",
            aug: "August",
            sep: "September",
            oct: "October",
            nov: "November",
            dec: "December"
        };
        var dayConv = {
            mon: "Monday",
            tue: "Tuesday",
            wed: "Wednesday",
            thu: "Thursday",
            fri: "Friday",
            sat: "Saturday",
            sun: "Sunday"
        };
        var scale = function() {
            startDate = endDate = slides = daysPerSlide = 0;
            currentSlide = 1;
            var calendarWidth = calendar.width() + calendar.offset().left - 10;
            $(".inner section", calendar).each(function(index) {
                var section = $(this);
                if (!startDate && (section.offset().left - calendar.offset().left + 10) > 0) {
                    startDate = section.find("h4").text();
                }
                if (section.offset().left < calendarWidth) {
                    endDate = section.find("h4").text();
                    if (startDate) {
                        daysPerSlide++;
                    }
                }
            }
            );
            if (daysPerSlide !== 0) {
                slides = Math.ceil(21 / daysPerSlide);
            } else {
                slides = 7;
            }
            if (slides > 9) {
                slides = 9;
            }
            if (calendar.hasClass("slide-1")) {
                currentSlide = 1;
            } else {
                if (calendar.hasClass("slide-2")) {
                    currentSlide = 2;
                } else {
                    if (calendar.hasClass("slide-3")) {
                        currentSlide = 3;
                    } else {
                        if (calendar.hasClass("slide-4")) {
                            currentSlide = 4;
                        } else {
                            if (calendar.hasClass("slide-5")) {
                                currentSlide = 5;
                            }
                            else {
                                if (calendar.hasClass("slide-6")) {
                                    currentSlide = 6 ;
                                }
                                else {
                                    if (calendar.hasClass("slide-7")) {
                                        currentSlide = 7;
                                    }
                                    else {
                                        if (calendar.hasClass("slide-8")) {
                                            currentSlide = 8;
                                        }
                                        else {
                                            if (calendar.hasClass("slide-9")) {
                                                currentSlide = 9;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (currentSlide == 1) {
                dateSwitcher.find(".prev").hide();
            } else {
                dateSwitcher.find(".prev").show();
            }
            if (currentSlide >= slides) {
                dateSwitcher.find(".next").hide();
            } else {
                dateSwitcher.find(".next").show();
            }
            dateSwitcher.find("h3").html(startDate + " - " + endDate);
            if (currentSlide > slides) {
                calendar.removeClass("slide-1 slide-2 slide-3 slide-4 slide-5 slide-6 slide-7 slide-8 slide-9").addClass("slide-" + slides);
            }
        }
        ;
        var displayEl = $("#aCal-tables");
        var sliderEl = $("#aCal-tableslider");
        var filterEl = $("#aCal-filter");
        var calEl = $("#aCal");
        var colEl = $("#aCal-cols");
        var headerEl = $("#aCal-headrow");
        var initDateSwitcher = function() {
            dateSwitcher.on("click", ".prev", function(e) {
                e.preventDefault();
                if (calendar.hasClass("slide-1")) {
                    return;
                }
                calendar.find('section, section button[type="button"]').removeClass("selected");
                $(".booking-calendar .booking-time").remove();
                $("p#selected-slot").hide();
                calendar.removeClass("slide-1 slide-2 slide-3 slide-4 slide-5 slide-6 slide-7 slide-8 slide-9").addClass("slide-" + (currentSlide - 1));
                $(this).hide();
                $(".date-switcher .next").show();
                scale();
            }
            );
            dateSwitcher.on("click", ".next", function(e) {
                e.preventDefault();
                if (calendar.hasClass("slide-" + slides)) {
                    return;
                }
                calendar.find('section, section button[type="button"]').removeClass("selected");
                $(".booking-calendar .booking-time").remove();
                $("p#selected-slot").hide();
                calendar.removeClass("slide-1 slide-2 slide-3 slide-4 slide-5 slide-6 slide-7 slide-8 slide-9").addClass("slide-" + (currentSlide + 1));
                $(this).hide()
                $(".date-switcher .prev").show();
                scale();
            }
            );
        }
        ;
        var initDaytimeClick = function() {
            calendar.on("click", 'section button[type="button"]', function(e) {
                e.preventDefault();
                var daytime = $(this);
                if (daytime.hasClass("empty")) {
                    return;
                }
                $(".booking-calendar .booking-time").remove();
                $("p#selected-slot").hide();
                calendar.find('section, section button[type="button"]').removeClass("selected");
                daytime.addClass("selected").closest("section").addClass("selected");
                var dayNumber = daytime.closest("section").index() + 1;
                var times = daytime.data("times");
                var bookingTime = $(".booking-time.hidden").clone();
                daytime.after(bookingTime);
                var newList = "<ul>";
                for (var key in times) {
                    if (times.hasOwnProperty(key)) {
                        newList += '<li><a href="#">' + times[key] + "</a></li>";
                    }
                }
                newList += "</ul>";
                bookingTime.find("ul").replaceWith(newList);
                bookingTime.removeClass("hidden");
                if ($(".panel.first").hasClass("active")) {
                    $(".panel.first.active").hide();
                }
                $("html, body").animate({
                    scrollTop: daytime.offset().top - 10
                }, 800);
            }
            );
        }
        ;
        var initTimeClick = function() {
            calendar.on("click", ".booking-time ul a", function(e) {
                e.preventDefault();
                $(this).closest(".booking-time").find("ul a").removeClass("selected");
                $(this).addClass("selected");
                $(this).closest(".booking-time").find("button").removeAttr("disabled");
                $(".booking-time button").focus();
                var time = getAppTime(), date = getAppDay();
                $("#selApptTime").text(date + " "+ time);
                $("p#selected-slot").show();

                $("html, body").animate({
                    scrollTop: $("#selected-slot").offset().top - 200
                }, 800);
            }
            );
        }
        ;
        function getMins(hour, min) {
            return (hour * 60) + min;
        }
        function convert_to_hours(mins) {
            if (!mins) {
                return;
            } else {
                var h = parseInt(mins / 60);
                var meridian_str = "AM";
                if (h >= 12) {
                    meridian_str = "PM";
                    if (h >= 13) {
                        h = h - 12;
                    }
                }
                var min = parseInt(mins % 60)
                  , m = 0;
                if (min != 0) {
                    m = min;
                } else {
                    m = "00";
                }
                return "" + h + ":" + m + " " + meridian_str;
            }
        }
        function getRange(start, end, hours) {
            if (!hours) {
                return getMins(end[0], end[1]) - getMins(start[0], start[1]);
            } else {
                return (!end[1] ? end[0] : end[0] + 1) - start[0];
            }
        }
        var set_slot_arr = function() {
            slot_arr.start_time = booking_json.RequestProperties.info.start[0] * 60 + booking_json.RequestProperties.info.start[1];
            slot_arr.end_time = booking_json.RequestProperties.info.finish[0] * 60 + booking_json.RequestProperties.info.finish[1];
            slot_arr.slot_length = booking_json.RequestProperties.info.app_length;
            slot_arr.no_of_slots = parseInt((slot_arr.end_time - slot_arr.start_time) / slot_arr.slot_length);
            var st = slot_arr.start_time
              , j = 0
              , k = 0;
            for (var i = 0; i < slot_arr.no_of_slots; i++) {
                slot_time = st + i * slot_arr.slot_length;
                slot_arr.complete[i] = slot_time;
                if (slot_time < slot_arr.m_last_index) {
                    slot_arr.morning[i] = slot_time;
                } else {
                    slot_arr.afternoon[j++] = slot_time;
                }
            }
        }
        ;
        var convert_to_timeslot = function(index) {
            var mins = slot_arr.complete[index];
            var str = convert_to_hours(mins);
            var h = 0;
            var slot_str1_arr = str.split(" ");
            if (slot_str1_arr[1] == "PM") {
                h = 12;
            }
            var slot_str1 = slot_str1_arr[0].split(":");
            if (slot_str1[0] == 12) {
                h = 12;
            } else {
                h = h + parseInt(slot_str1[0]);
            }
            slot_str1 = "" + h + slot_str1[1];
            return '"' + slot_str1 + '" : " ' + str + '"';
        }
        ;
        var create_calendar = function() {
            set_slot_arr();
            if ($(".inner", calendar).length === 0) {
                calendar.html('<div class="inner"></div>');
            }
            var container = $(".inner", calendar);
            var w = booking_json.RequestProperties.info.weeks, d = booking_json.RequestProperties.info.days, appointment_length = booking_json.RequestProperties.info.app_length, slot_data = {
                M: {},
                A: {},
                E: {}
            }, ms, as, es, morn_tile_txt, anoon_tile_txt, arr_available_bookings = "", week_days = [], no_of_days, day_bookings, slot_html = container.html();
            week_index = -1,
            days_arr = [],
            weeks = "",
            week_arr = "",
            i = 0,
            dn = "",
            mf = af = ef = false;
            if (typeof selected_booking_slot == "undefined" || selected_booking_slot == 0) {
                arr_available_bookings = booking_json.RequestProperties.bookings[0];
            } else {
                arr_available_bookings = booking_json.RequestProperties.bookings[selected_booking_slot];
            }
            for (var key in arr_available_bookings) {
                if (arr_available_bookings.hasOwnProperty(key)) {
                    week_days.push(key);
                }
            }
            weeks = booking_json.RequestProperties.weeks;
            for (week in weeks) {
                week_arr = weeks[week];
                for (dn in week_arr) {
                    if (dn == "days") {
                        days_arr[i++] = week_arr[dn];
                    }
                }
            }
            no_of_days = week_days.length;
            for (var i = 0, i1 = 0, aa = 0; i < no_of_days; i++,
            aa++) {
                ms = as = es = 0;
                mf = af = ef = false;
                if(i%d == 0){
                    week_index ++;
                }
                if (aa >= d) {
                    aa = 0;
                }
                date_key_str = days_arr[week_index][aa][1] + "-" + days_arr[week_index][aa][2] + "-" + days_arr[week_index][aa][3];
                day_bookings = arr_available_bookings[date_key_str];
                slot_data.M = "";
                slot_data.A = "";
                for (var j = 0; j < day_bookings.length; j++) {
                    if (j < slot_arr.morning.length) {
                        if (day_bookings[j] != 0) {
                            time_str = convert_to_timeslot(j);
                            if (mf) {
                                slot_data.M += time_str;
                            } else {
                                slot_data.M += "{" + time_str;
                                mf = true;
                            }
                            ms++;
                        }
                        if (j == slot_arr.morning.length - 1 && slot_data.M != "") {
                            if (slot_data.M[slot_data.M.length - 2] == ",") {
                                slot_data.M = slot_data.M.substring(0, slot_data.M.length - 2);
                                slot_data.M += "}";
                            } else {
                                slot_data.M += "}";
                            }
                        } else {
                            if (day_bookings[j] != 0 && slot_data.M != "") {
                                slot_data.M += ", ";
                            }
                        }
                    } else {
                        if (j < (slot_arr.morning.length - 1 + slot_arr.afternoon.length)) {
                            if (day_bookings[j] != 0) {
                                time_str = convert_to_timeslot(j);
                                if (af) {
                                    slot_data.A += time_str;
                                } else {
                                    slot_data.A += "{" + time_str;
                                    af = true;
                                }
                                as++;
                            }
                            if (j == (slot_arr.morning.length - 2 + slot_arr.afternoon.length) && slot_data.A != "") {
                                if (slot_data.A[slot_data.A.length - 2] == ",") {
                                    slot_data.A = slot_data.A.substring(0, slot_data.A.length - 2);
                                    slot_data.A += "}";
                                } else {
                                    slot_data.A += "}";
                                }
                            } else {
                                if (day_bookings[j] != 0 && slot_data.A) {
                                    slot_data.A += ", ";
                                }
                            }
                        }
                    }
                }
                if (i >= booking_json.RequestProperties.info.days) {
                    i1 = i - (booking_json.RequestProperties.info.days*week_index);
                } else {
                    i1 = i;
                }
                day_str = booking_json.RequestProperties.weeks[week_index].days[i1];
                var its_weekend = false;
                if(["sat", "sun"].indexOf(day_str[0])>-1 ){
                    its_weekend=true;
                }
                if (slot_data.M != "") {
                    morn_tile_txt = '<button type="button" data-times=\'' + slot_data.M + "'><h5>Morning</h5><p>" + ms + " available</p></button>";
                } else if(!its_weekend){
                    morn_tile_txt = '<button disabled="disabled" type="button"><h5>Morning</h5><p>0 available</p></button>';
                }
                else{
                    morn_tile_txt = '<button disabled="disabled" type="button"></button>';
                }
                if (slot_data.A != "") {
                    anoon_tile_txt = '<button type="button" data-times=\'' + slot_data.A + "'><h5>Afternoon</h5><p>" + as + " available</p></button>";
                } else if(!its_weekend){
                    anoon_tile_txt = '<button disabled="disabled" type="button"><h5>Afternoon</h5><p>0 available</p></button>';
                }
                else{
                    anoon_tile_txt = '<button disabled="disabled" type="button"></button>';
                }
                slot_html = container.html() + '<section><h4 data-app-date="' + day_str[0] + " " + day_str[1] + " " + day_str[2] + " " + day_str[3] + '">' + day_str[0] + " " + day_str[1] + " " + day_str[2] + "</h4>" + morn_tile_txt + anoon_tile_txt + "</section>";
                container.html(slot_html);
            }
            scale();
        }
        ;
        var editAppointment = function() {
            $(".appointment-details .edit").on("click", function(e) {
                e.preventDefault();
                closePanel3();
                $(".selected", calendar).removeClass("selected");
                $(".inner .booking-time", calendar).addClass("hidden");
                $("#optNum").val("");
                openPanel2();
            }
            );
        }
        ;
        var getAppTime = function () {
            return $(".booking-time ul a.selected").text();
        };
        var getAppDay = function () {
            return $(".booking-calendar section.selected h4").attr("data-app-date");
        };
        var onAppTimeSelect = function() {
            $(".booking-calendar section.selected .booking-time a.selected").on("click", function(e) {
                var app_day = getAppDay(), app_time = getAppTime(), day_arr;
                day_arr = app_day.split(" ");
                $(".appointment-details .app-day").text(dayConv[day_arr[0]] + " " + day_arr[1] + " " + monthConv[day_arr[2]]);
                $(".appointment-details .appoint-time").text(app_time);
                openPanel3();
                $("body").scrollTo(".panel.last");
                $("#optDate").val(dayConv[day_arr[0]] + " " + day_arr[1] + " " + monthConv[day_arr[2]]);
                $("#time").val($.trim(app_time.toLowerCase()));
                $("#month").val(day_arr[2]);
                $("#date").val(day_arr[1]);
                $("#year").val(day_arr[3]);
                $("#appLenth").val(booking_json.RequestProperties.info.app_length);
            }
            );
        }
        ;
        var load_calendar_json = function() {
            var jsonobject = null ;
            $(".inner span", calendar).css("top", "0");
            $.ajax({
                url: "js/calendar.json",
                dataType: "json",
                success: function(responseData) {
                    jsonobject = responseData;
                    $(".inner", calendar).html("").removeAttr("style");
                    var dataObj = jsonobject.RequestProperties;
                    if (dataObj == false) {
                        $(".panel.second .date-switcher").addClass("hidden");
                        $(".panel.second .calendar-err").removeClass("hidden");
                    } else {
                        $(".second").css("cursor", "default");
                        $(".last").css("cursor", "default");
                        booking_json = jsonobject;
                        create_calendar();
                        initDateSwitcher();
                        initDaytimeClick();
                        initTimeClick();
                        onAppTimeSelect();
                        editAppointment();
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {}
            });
        }
        ;
        var init = function() {
            if (!calendar.length || !dateSwitcher.length) {
                return;
            }
            $(window).on("load resize", function() {
                clearTimeout(timeout);
                timeout = setTimeout(scale, 200);
            }
            );
            calendar.on("transitionend", scale);
            load_calendar_json();
        }
        ;
        return {
            init: init
        };
    }
    ());

    selectDate = function(){
        var time = $(".booking-time ul a.selected").text(),
         date = $(".booking-calendar section.selected h4").attr("data-app-date");
        window.location.href ="confirmation.html?date="+date+"&time="+time;
    };
}
(window, document, jQuery, govau_calendar));

jQuery(govau_calendar.bookAppointmentCalendar.init);
