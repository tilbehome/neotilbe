function updateCountdown() {
            var now = new Date();
            var targetTime = new Date();
            targetTime.setHours(13, 0, 0, 0);  // Saat 13:00'te kargo için hedefi ayarladık

            var dayOfWeek = now.getDay();
            var hour = now.getHours();

            // Eğer şu an saat 13:00'dan sonra ise, hedefi bir sonraki güne ayarla
            if (now > targetTime) {
                targetTime.setDate(targetTime.getDate() + 1);
            }

            var timeDifference = targetTime - now;
            var hours = Math.floor(timeDifference / (1000 * 60 * 60));
            var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            // Cumartesi 13:00 sonrası ve Pazar günü için Pazartesi'yi ayarla
            if ((dayOfWeek === 6 && hour >= 13) || (dayOfWeek === 0 && hour < 13)) {
                if (timeDifference <= 0) {
                    return;
                } else {
                    hours += 24;  // Bir gün ekleyerek saat farkını düzelt
                    $("span.hours").each(function () {
                        $(this).text(hours);
                    });

                    if (hours == 0) {
                        $(".hours-vision").hide();
                    } else {
                        $(".hours-vision").show();
                    }

                    $("span.day").text("Pazartesi");

                    $("span.minute").each(function () {
                        $(this).text(minutes);
                    });

                    if (minutes == 0) {
                        $(".minutes-vision").hide();
                    } else {
                        $(".minutes-vision").show();
                    }
                }
            } else {
                if (timeDifference <= 0) {
                    return;
                } else {
                    $("span.hours").each(function () {
                        $(this).text(hours);
                    });

                    if (hours == 0) {
                        $(".hours-vision").hide();
                    } else {
                        $(".hours-vision").show();
                    }

                    $("span.minute").each(function () {
                        $(this).text(minutes);
                    });

                    if (minutes == 0) {
                        $(".minutes-vision").hide();
                    } else {
                        $(".minutes-vision").show();
                    }

                    if (now.getHours() < 13) {
                        $("span.day").text("bugün");
                    } else {
                        $("span.day").text("yarın");
                    }
                }
            }
        }

        $(document).ready(function() {
            updateCountdown();
            setInterval(updateCountdown, 5000);
        });