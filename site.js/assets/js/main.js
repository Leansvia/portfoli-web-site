function copyText(text, info) {
    navigator.clipboard.writeText(text).then(
        function() {
            showSuccess(`${info} (${text})`);
        },
        function(err) {
            console.error("Async: Could not copy text: ", err);
        }
    );
}

var currentBoxModel = null;

function getCurrentBoxModel() {
    return this.currentBoxModel;
}

function setCurrentBoxModel(model) {
    currentBoxModel = model;
}

function removeCurrentBoxModel() {
    if (this.currentBoxModel != null) {
        $(this.currentBoxModel).remove();
    }
}

function showElement(element) {
    element.style.display = "block";
}

function hideElement(element) {
    if (element == null) return;
    element.style.display = "none";
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function closeModels() {
    removeCurrentBoxModel();
}

window.onclick = function(event) {
    var targetElement = event.target;
    var elementID = targetElement.id;
    if (elementID == "new-profile") closeModels();
}

$('#file-button').click(function() {
    $("input[type='file']").trigger('click');
})

$("input[type='file']").change(function() {
    $('#file-button').val(this.value.replace(/C:\\fakepath\\/i, ''))
})

function openNewProfile() {
    closeModels();
    var model = document.createElement("DIV");
    model.id = "new-profile";
    setCurrentBoxModel(model);
    var box = document.createElement("DIV");
    var inbox = document.createElement("DIV");
    $(box).addClass("profileBox");
    $(inbox).addClass("relative");
    $(box).append(inbox);
    $(inbox).append('<button id="closeButton" onclick="closeModels()" class="close" data-dismiss="alert" type="button"><span aria-hidden="true">x</span><span class="sr-only">Kapat</span></button>');
    $(inbox).append('<p class="modal-header font-bold">Yeni Profil</p>');
    $(inbox).append('<p class="modal-text"><i class="fi fi-rr-link"></i> Bir URL belirle.</p>');
    $(inbox).append('<div class="input-group mb-3 modal-input"><input type="text" class="form-control" placeholder="Profil isminiz" id="profile-name-area"></div>');
    $(inbox).append('<div class="input-group mb-3 modal-input"><div class="input-group-prepend h-35p"><span class="input-group-text" id="profile-url">https://ppf.one</span></div><input type="text" class="form-control" placeholder="Profil linkiniz" id="profile-url-area"></div>');
    $(inbox).append('<input type="button" class="create-profile load-button" onclick="onClickNewProfile()" value="Oluştur">');
    model.appendChild(box);
    document.body.appendChild(model);
    showElement(model);
}

function onClickNewProfile() {
    var profileName = $("#profile-name-area").val();
    var url = $("#profile-url-area").val();
    if (url == "" || url == null || profileName == null || profileName == "") return;
    loadButton();

    $.ajax({
        url: "/posts/post-createprofile.php",
        type: "POST",
        data: {
            newprofilename: profileName,
            newprofilelink: url
        },
        dataType: "JSON",
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        success: function(result) {
            unloadButton();
            if (result.type == "success") showSuccess(result.message);
            else showError(result.message);

            if (result.type == "success") {
                setTimeout(() => {
                    window.location = '/edit-profile/' + url;
                }, 2000);
            }
        },
        error: function(jqXHR, exception) {
            var msg = "";
            if (jqXHR.status === 0) {
                msg = "Not connect.\n Verify Network.";
            } else if (jqXHR.status == 404) {
                msg = "Requested page not found. [404]";
            } else if (jqXHR.status == 500) {
                msg = "Internal Server Error [500].";
            } else if (exception === "parsererror") {
                msg = "Requested JSON parse failed.";
            } else if (exception === "timeout") {
                msg = "Time out error.";
            } else if (exception === "abort") {
                msg = "Ajax request aborted.";
            } else {
                msg = "Uncaught Error.\n" + jqXHR.responseText;
            }
        },
    });
}

function loadButton() {
    let button = $(".load-button");
    button.addClass("disabled");
    button.attr("disabled", true);
}

function unloadButton() {
    let button = $(".load-button");
    button.removeClass('disabled');
    button.attr("disabled", false);
}

function onDeleteProfile(username) {
    if (username == "" || username == null) return;

    $.ajax({
        url: "/posts/post-deleteprofile.php",
        type: "POST",
        data: {
            username: username
        },
        dataType: "JSON",
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        success: function(result) {
            if (result.type == "success") showSuccess(result.message);
            else showError(result.message);

            if (result.type == "success") {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        },
        error: function(jqXHR, exception) {
            var msg = "";
            if (jqXHR.status === 0) {
                msg = "Not connect.\n Verify Network.";
            } else if (jqXHR.status == 404) {
                msg = "Requested page not found. [404]";
            } else if (jqXHR.status == 500) {
                msg = "Internal Server Error [500].";
            } else if (exception === "parsererror") {
                msg = "Requested JSON parse failed.";
            } else if (exception === "timeout") {
                msg = "Time out error.";
            } else if (exception === "abort") {
                msg = "Ajax request aborted.";
            } else {
                msg = "Uncaught Error.\n" + jqXHR.responseText;
            }
        },
    });
}

function deleteProfile(username, profilePhoto) {
    closeModels();
    var model = document.createElement("DIV");
    model.id = "new-profile";
    setCurrentBoxModel(model);
    var box = document.createElement("DIV");
    var inbox = document.createElement("DIV");
    $(box).addClass("profileBox");
    $(inbox).addClass("relative");
    $(box).append(inbox);
    $(inbox).append('<button id="closeButton-upg" onclick="closeModels()" class="close" data-dismiss="alert" type="button"><span aria-hidden="true">x</span><span class="sr-only">Kapat</span></button>');
    $(inbox).append('<p class="modal-header-upg font-bold">Profil Sil</p>');
    $(inbox).append('<img class="modal-image" src="' + profilePhoto + '" alt="">');
    $(inbox).append('<p class="modal-text text-red mb-4"><i class="fi fi-rr-trash"></i></i> ' + username + ' profilini silmek istediğine emin misin?</p>');

    $(inbox).append('<input type="button" class="create-profile" onclick="onDeleteProfile(' + "'" + username + "'" + ')" value="Evet">');
    $(inbox).append('<input type="button" class="create-profile bg-red ml-3" onclick="closeModels()" value="Hayır">');
    model.appendChild(box);
    document.body.appendChild(model);
    showElement(model);
}


var polipop = new Polipop('ppf-polipop', {
    layout: 'popups',
    insert: 'before',
    position: 'top-right',
    pool: 0,
    closeText: "Kapat",
    life: 5000,
});

function showError(content, title = "Leans") {
    unloadButton();
    polipop.add({
        content: content,
        title: 'Leans',
        type: 'error',
    });
}

function showSuccess(content, title = "Leans") {
    unloadButton();
    polipop.add({
        content: content,
        title: 'Leans',
        type: 'success',
    });
}
var isOpened = false;
$('button[data-toggle="collapse"]').click(function() {
    if (isOpened) {
        $("#main_navbar").addClass("collapse");
        isOpened = false;
    } else {
        $("#main_navbar").removeClass("collapse");
        isOpened = true;
    }
});
var coll = document.getElementsByClassName("ppf-collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("ppf-active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}