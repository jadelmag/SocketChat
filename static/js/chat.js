$(function() {
    var $login = $("#login");
    var $chat = $("#chat");
    var $messages = $("#messages");
    var $message = $("#message");
    var $sidebar = $("#sidebar");
    var $footer = $("#footer");
    var socket = io.connect('/');

    socket.on('connect', function() {
        console.log('Connected with socket');

        init();
    });

    var hideDivs = function() {
        $chat.hide();
        $sidebar.hide();
        $footer.hide();
    };

    var showChatElements = function() {
        $chat.show();
        $sidebar.show();
        $footer.show();
    };

    var init = function() {
        $("#nickname").keyup(function(e) {
            var code = e.which || e.keyCode;

            if (code == 13) {
                setNickname($(this).val());
            }
        });

        hideDivs();
    };

    var setNickname = function(nickname) {
        socket.emit('set_nickname', nickname, function(is_available) {
            if (is_available) {
                console.log('Nickname ' + nickname + 'is available');
                setUpChat(nickname);
            }
            else {
                console.log('Nickname ' + nickname + 'is not available');
            }
        });
    };

    var setUsersConnected = function(nickname) {
        socket.emit('users_connected', nickname, function(clients) {

            for (var i=0; i<clients.length; i++) {
                if (clients[i] != null)
                    $sidebar.append($("<li>" + clients[i] + "</li>"));
            }
        });
    };

    var setUpChat = function(nickname) {
        $login.hide();
        showChatElements();
        setUsersConnected(nickname);

        $("#submit-message").click(function() {

            if ($message.val() != '')
            {
                sendMessage($message.val());
                $message.val('');
            }
        });

        socket.on('message', function(nickname, message) {
            addMessage(nickname, message);
        });
    };

    var sendMessage = function(msg) {
        socket.emit('message', msg);
    };

    var addMessage = function(nickname, message) {
        $messages.append($("<li>@" + nickname + ":" + message + "</li>"));
    };

});