var main_url = 'http://localhost/Apps_Servers/Learners_Crib'
var started = 0
var All_Resources = {}

function start_app() {
    getResources()
    if (localStorage.learners_crib_user_Logged == 'true') {
        $.ajax({
            url: main_url + '/confirm_user_existence',
            data: {
                User: localStorage.learners_crib_user
            },
            method: 'POST',
            success: function (data) {
                data = JSON.parse(data)
                if (data.status == 1) {
                    to_main()
                } else {
                    Navigates = document.getElementById('main_navigator')
                    Navigates.pushPage('login.html')
                }
            },
            fail: function (data) {
                console.log(data)
                Navigates = document.getElementById('main_navigator')
                Navigates.pushPage('login.html')
            },
            error: function (data) {
                console.log(data)
                Navigates = document.getElementById('main_navigator')
                Navigates.pushPage('login.html')
            }
        })
    } else {
        Navigates = document.getElementById('main_navigator')
        Navigates.pushPage('login.html')
    }
}

function to_register() {
    Navigates = document.getElementById('main_navigator')
    Navigates.pushPage('register.html')
}

function to_main() {
    Navigates = document.getElementById('main_navigator')
    Navigates.pushPage('main.html').then(function () {
        for (var r_count = 0; r_count < 21 && r_count < All_Resources.length; r_count++) {
            var main_data_main = All_Resources[r_count]
            var AddResource = '<div class="main_list_file">' +
                '<div class="main_list_file_left">' +
                '<img src="img_placeholder/' + main_data_main.File_Type + '.png">' +
                '<label> ' + main_data_main.File_Type.toUpperCase() + ' File </label>' +
                '</div>' +
                '<div class="main_list_file_center">' +
                '<h3> ' + main_data_main.File_Name + ' </h3>' +
                '<h6> ' + main_data_main.File_Description.substring(0, 90) + '... </h6>' +
                '<p> Uploaded by <span> ' + main_data_main.User + ' </span> On <span> ' + main_data_main.When_Uploaded + ' </span> </p>' +
                '</div>' +
                '</div>'
            $('#main_list_file_container').append(AddResource)
        }
        if (All_Resources.length < 21) {
            $('#load_more_button').remove()
        }

        document.querySelector('ons-tabbar').addEventListener('postchange', function (event) {
            console.log(event.index)
        })

        document.querySelector('ons-tabbar').addEventListener('reactive', function (event) {
            console.log(event.index)
        })
    })
}

function getResources() {
    $.ajax({
        url: main_url + '/get_all_materials',
        success: function (data) {
            data = JSON.parse(data)
            if (data.status == 1) {
                All_Resources = data.Main
            }
        },
        error: function (data) {
            console.log(data)
        },
        fail: function (data) {
            console.log(data)
        },
    })
}

function login_user() {

    $('#sign_in_user').attr('disabled', true)
    $('#sign_in_user').html('Logging In')

    var Email = $('#Login_Email').val()
    var Password = $('#Login_Password').val()

    $.ajax({
        url: main_url + '/login_student',
        data: {
            Email,
            Password
        },
        method: 'POST',
        success: function (data) {
            data = JSON.parse(data)
            if (data.status == 1) {
                swal("Good News!", data.message, "success", {
                    button: "Thank You!",
                }).then(function () {
                    localStorage.setItem('learners_crib_user_Logged', true)
                    localStorage.setItem('learners_crib_user', data.Username)
                    to_main()
                })
            } else {
                swal("Oops!", data.message, "error", {
                    button: "Oh, Okay.",
                })
                $('#sign_in_user').html('Try Again!')
                $('#sign_in_user').removeAttr('disabled')
            }
        },
        error: function (data) {
            console.log(data)
            swal("Oops!", 'Error Connecting To Server', "error", {
                button: "Oh, Okay.",
            })
            $('#sign_in_user').html('Try Again!')
            $('#sign_in_user').removeAttr('disabled')
        },
        fail: function (data) {
            console.log(data)
            swal("Oops!", 'Error Connecting To Server', "error", {
                button: "Oh, Okay.",
            })
            $('#sign_in_user').html('Try Again!')
            $('#sign_in_user').removeAttr('disabled')
        }
    })

    return false

}

function register_user() {

    $('#sign_up_user').attr('disabled', true)
    $('#sign_up_user').html('Adding To Database')

    var Full_Name = $('#Register_Name').val()
    var User_Name = $('#Register_User').val()
    var Email = $('#Register_Email').val()
    var Password = $('#Register_Password').val()

    $.ajax({
        url: main_url + '/new_student_register',
        data: {
            Full_Name,
            User_Name,
            Email,
            Password
        },
        method: 'POST',
        success: function (data) {
            console.log(data)
        },
        error: function (data) {
            console.log(data)
            swal("Oops!", 'Error Connecting To Server', "error", {
                button: "Oh, Okay.",
            })
            $('#sign_up_user').html('Try Again!')
            $('#sign_up_user').removeAttr('disabled')
        },
        fail: function (data) {
            console.log(data)
            swal("Oops!", 'Error Connecting To Server', "error", {
                button: "Oh, Okay.",
            })
            $('#sign_up_user').html('Try Again!')
            $('#sign_up_user').removeAttr('disabled')
        }
    })

    return false

}

ons.ready(function () {
    document.addEventListener('init', function (event) {
        if (started == 0) {
            setTimeout(start_app, 2000)
            started = 1
        }
    })
})

if (ons.platform.isIPhoneX()) {
    document.documentElement.setAttribute('onsflag-iphonex-portrait', '')
    document.documentElement.setAttribute('onsflag-iphonex-landscape', '')
}