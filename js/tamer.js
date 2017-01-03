window.fbAsyncInit = function() {
  FB.init({
    appId      : '1482735298654928',
    xfbml      : true,
    version    : 'v2.2',
    status     : true
  });

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      console.log('Logged in.');
    }
    else {
      window.location = "http://107.170.140.106/Ignite/";
    }

    // getRandom();

  FB.api(
  "me",
  function (response) {
    if (response && !response.error) {
          FB.api(
          "me/picture",
          {
            "redirect": false,
            "height": "100",
            "type": "normal",
            "width": "100"
          },
          (function(user){
                        return function(resp) {
                          $("#profile-pic").attr("src", resp.data.url);
                          $("#name").text(user.name);
                        }
                      })(response)
          );
    }
    });

    var grantedLikes = false;
    var grantedFriends = false;
    FB.api(
      "me/permissions",
      function(response) {
        if (response && !response.error) {
          for(i = 0; i < response.data.length; i++) {
            if (response.data[i].permission === "user_likes" && response.data[i].status === "granted") {
              grantedLikes = true;
            }
            if(response.data[i].permission === "user_friends" && response.data[i].status === "granted") {
              grantedFriends = true;
            }
          }
          if (!grantedLikes) {
            var c = confirm("you must accept likes permission to use this site");
            if(c == true) {
              FB.login(function(response){}, {scope: "user_likes", auth_type: "rerequest"});
              getLikes("me", "myLikes");
            }
          } else {
            getLikes("me", "myLikes");
          }

          if (!grantedFriends) {
            var c = confirm("you must accept friends permission to use this site");
            if(c == true) {
              FB.login(function(response){}, {scope: "user_friends", auth_type: "rerequest"});
              getFriendsLikes();
            }
          } else {
            getFriendsLikes();
          }
        }
      });
  });
};



function getLikes(uID, domID) {
  FB.api(
  "/"+uID+"/likes",
  {
    fields: "about, id, category, name, website, cover",
  },
  function (response) {
    if (response && !response.error) {
      for (i = 0; i < response.data.length; i++) {
        var page = response.data[i];
        if (page.category == "Non-profit organization") {
          // $("#likes").append("<p> <img id='"+page.id+"'>"+page.name+" category: "+page.category+" id: "+page.id+"</p>");
          FB.api(
          page.id + "/picture",
          {
            "redirect": false,
            "height": "100",
            "type": "normal",
            "width": "100"
          },
          (function(page){
                        return function(resp) {
                          if( domID === "myLikes" && $("#myLikes").text().trim() === "You haven't liked any charities yet!!") {
                            $("#myLikes").text("");
                          }

                          if( domID === "friendsLikes" && $("#friendsLikes").text().trim() === "Your friends haven't started using this app yet :(") {
                            $("#friendsLikes").text("");
                          }
                          var p = $("#myLikes").find("#"+page.id).length == 0;
                          if(p) {
                            var src = $("#org-template").html();
                            var templ = Handlebars.compile(src);
                            var ht = templ({
                              page: page,
                              url: resp.data.url,
                            });
                            var htt = $.parseHTML(ht);
                            $("#"+domID).append(htt);
                            $("#"+page.id).mCustomScrollbar({
                                theme: "dark",
                                scrollInertia: 0,
                              });
                            FB.XFBML.parse();
                          }
                        }
                      })(page)
          );
        }
      }
    }
  });
  // FB.Event.subscribe("edge.create", function(url, htmlE){
  //   var id = url.replace("https://facebook.com/", "");
  //   #("#"+id).find(".")
  // });
};

function getFriendsLikes() {
  FB.api(
  "/me/friends", 
  function (response) {
    if (response && !response.error) {
      for (i = 0; i < response.data.length; i++) {
        getLikes(response.data[i].id, "friendsLikes");
      }
    }
  });
};

function getRandom() {
  var id = Math.floor((Math.random() * 100000000000000) + 100000000000000);
  FB.api(
  "/pages/" + id,
  function(response) {
    if (response && !response.error) {
      getLikes(response.data.id, "discover");
      setTimeout(getRandom, 1000);
    } else {
      getRandom();
    }
  });
};

// function likeClicked(e) {
//   FB.api(
//     "me/likes",

//   );
// };

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));