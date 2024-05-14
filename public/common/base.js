jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad', swing: function (x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    }, easeOutQuad: function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    }, easeInOutQuad: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }, easeInOutCubic: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    }, easeInOutQuart: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
});

$().ready(function () {
    const cardsRibbon = $("#cards-ribbon");

    $(".cards-ribbon-arrow").on("click", function () {
        if ($(this).data("arrow-dir") === "right") {
            cardsRibbon.animate({scrollLeft: "+=500"}, {duration: 750, easing: "easeInOutCubic"});
        } else {
            cardsRibbon.animate({scrollLeft: "-=500"}, {duration: 750, easing: "easeInOutCubic"});
        }
    });

    $(".modal-pioneer").on("click", function () {
        $("#" + this.getAttribute("data-modal-id")).css("display", "flex");
    });

    $(".modal").on("click", function (e) {
        $(this).closest(".modal").css("display", "none");
        e.stopPropagation();
    });

    $(".modal-body").on("click", function (e) {
        e.stopPropagation();
    });

    $(".modal #close-modal").on("click", function () {
        $(this).closest(".modal").css("display", "none");
    });
});
