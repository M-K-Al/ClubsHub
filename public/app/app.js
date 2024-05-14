let sidePanelState;

if (!clubs[0]) sidePanelState = "closed";
else sidePanelState = localStorage.getItem("side-panel-state") ?? "opened";

const categoryMap = {
    "religious_spiritual": "Religious & Spiritual",
    "adventure": "Adventure",
    "language_literature": "Language & Literature",
    "music_dance": "Music & Dance",
    "film_media": "Film & Media",
    "gaming_esports": "Gaming & Esports",
    "business_entrepreneurship": "Business & Entrepreneurship",
    "stem": "STEM (Science, Technology, Engineering, & Math)",
    "design_creativity": "Design & Creativity",
    "international_global": "International & Global",
    "mental_health_advocacy": "Mental Health & Advocacy",
    "academic": "Academic",
    "arts_culture": "Arts & Culture",
    "sports": "Sports",
    "hobbies": "Hobbies",
    "volunteering": "Volunteering",
    "professionalDevelopment": "Professional Development"
};

const getCategoryNameFromValue = value => categoryMap[value] || value;

$().ready(function () {
    const sidePanel = $("#side-panel"),
        mainPanel = $("#main-panel"),
        clubsPanel = $("#clubsPanel"),
        clubDiscussion = $("#club-discussion"),
        clubDiscussionHeader = $("#club-discussion-header"),
        clubInfo = $("#club-info"),
        clubMembers = $("#club-members"),
        clubEvents = $("#club-events"),
        clubName = $("#club-name"),
        infoClubName = $("#info-club-name"),
        infoClubDescription = $("#info-club-description"),
        clubId = $("#club-id"),
        logoutTab = $("#logout-tab"),
        messages = $("#messages"),
        messageForm = $("#message-form"),
        messageContent = $("#message-content"),
        categories = $("#categories");

    if (!clubs[0]) messageForm.addClass("hidden");

    $("#close-side-panel").on("click", function () {
        localStorage.setItem("side-panel-state", "closed");
        sidePanel.addClass("!hidden");
        mainPanel.addClass("col-span-2");
        clubDiscussionHeader.addClass("tab");
    });

    clubDiscussionHeader.on("click", function () {
        if (!clubs[0]) return;
        localStorage.setItem("side-panel-state", "opened");
        sidePanel.removeClass("!hidden");
        mainPanel.removeClass("col-span-2");
        clubDiscussionHeader.removeClass("tab");
    });

    if (sidePanelState === "opened") clubDiscussionHeader.trigger("click");

    $("#members-tab").on("click", function () {
        clubInfo.addClass("hidden").removeClass("inline-flex");
        clubMembers.addClass("inline-flex").removeClass("hidden");
    });

    $("#close-club-members").on("click", function () {
        clubMembers.addClass("hidden").removeClass("inline-flex");
        clubInfo.addClass("inline-flex").removeClass("hidden");
    });

    $("#club-events-tab").on("click", function () {
        clubDiscussion.addClass("hidden").removeClass("inline-flex");
        clubEvents.addClass("inline-flex").removeClass("hidden");
    });

    $("#close-club-events").on("click", function () {
        clubEvents.addClass("hidden").removeClass("inline-flex");
        clubDiscussion.addClass("inline-flex").removeClass("hidden");
    });

    if (clubs[0]) {
        for (const category of clubs[0].categories)
            categories.append(`<span class="chip">${getCategoryNameFromValue(category)}</span>`);
    }

    $(".club").on("click", function () {
        const club = clubs[$(this).data("club-index")];
        clubName.text(club.clubName);
        infoClubName.text(club.clubName);
        infoClubDescription.text(club.clubDescription);
        clubId.val(club._id);
        categories.empty();
        for (const category of club.categories)
            categories.append(`<span class="chip">${getCategoryNameFromValue(category)}</span>`);

        $.ajax({
            url: `/messages`,
            data: {clubId: club._id},
            dataType: 'json',
            method: 'POST',
            success: function (data) {
                messages.empty();
                for (const message of data) {
                    messages.append(`
                        <div class="inline-flex h-fit w-full items-start justify-end pt-2 gap-1.5">
                            <div class="inline-flex items-end justify-end py-1 gap-2.5">
                                <span class="text-sm font-normal leading-tight text-black">
                                    ${new Date(message.timestamp)
                        .toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                </span>
                                <div class="inline-flex flex-col items-start justify-start rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl bg-cyan-200 px-4 py-3 shadow gap-1.5">
                                    <span class="text-sm font-normal leading-tight text-black">${message.content}</span>
                                </div>
                            </div>
                        </div>`
                    );
                }
            },
        });
    });

    messageForm.on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            url: `/send-message`,
            data: messageForm.serializeArray(),
            dataType: 'json',
            method: 'POST',
            success: function () {
                messageForm.trigger("reset");
            },
        });
        messages.append(`
        <div class="inline-flex h-fit w-full items-start justify-end pt-2 gap-1.5">
            <div class="inline-flex items-end justify-end py-1 gap-2.5">
                <span class="text-sm font-normal leading-tight text-black select-none">
                    ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </span>
                <div class="inline-flex flex-col items-start justify-start rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl bg-cyan-200 px-4 py-3 shadow gap-1.5">
                    <span class="text-sm font-normal leading-tight text-black">${messageContent.val()}</span>
                </div>
            </div>
        </div>`
        );
        messages.scrollTop(messages.prop("scrollHeight"));
    });

    $("#leave-club-tab").on("click", function () {
        $.ajax({
            url: `/leave-club`,
            data: {clubId: clubId.val()},
            dataType: 'json',
            method: 'POST',
            success: function () {
                location.reload();
            }
        });
    });

    logoutTab.on("click", function () {
        $.ajax({
            url: `/logout`,
            method: 'GET',
            success: function () {
                location.reload();
            }
        });
    });

});
