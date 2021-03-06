var app = angular.module('ionicApp', ['ionic'])
app.config(function($stateProvider, $urlRouterProvider) {
  var sp = $stateProvider;
  sp.state('song', {
    url: '/',
    templateUrl: 'song.html',
    controller: 'SongController'
  });
  $urlRouterProvider.otherwise("/");
});
app.controller("PlayContoller", function($scope){  });

app.controller('SongController', function($scope, $state, JwInfos, $ionicScrollDelegate) {
  JwInfos.getSingles(function(datas){
    console.log(datas[0]);
    datas.forEach(function(single){
      single.jw_created_at = new Date(single.created_at);
      single.jw_stream_url = single.stream_url + "?client_id=" + JwInfos.clientId;
      single.jw_artwork_url = single.artwork_url.replace("large", "original");
      $scope.singles.push(single);
    });

    var ran = Math.ceil(Math.random() * $scope.singles.length);
    var single = $scope.singles[ran];
    play360(single);
  });

  function createSournd(url) {
    var options = {
      id: url,
      url: url
    };
    var sound = soundManager.createSound(options);
    return sound;
  }

  function play() {
    var url = $scope.currentSingle.jw_stream_url;
    soundManager.setup({
      onready: function() {
        if($scope.currentSound) $scope.currentSound.stop();
        var sound = createSournd(url);

        sound.play();
        $scope.currentSound = sound;
      }
    });
  }

  angular.element(document).ready(function(){

  });

  function play360(single){
    var xsource = $("#jw-source").attr("href", single.jw_stream_url);
    soundManager.play();
  }

  function loadComments(single){
    if(single.comments) return;
    single.comments = [];
    JwInfos.getComments(single.id, function(datas){
      datas.forEach(function(comment){
        comment.jw_created_at = new Date(comment.created_at);
        comment.body = comment.body.trim();
        single.comments.push(comment);
      });
    });
  }

  $scope.singles = [];
  $scope.currentSingle = null;
  $scope.currentSound = null;

  // Select single
  // - Update reference
  // - Slide to next
  // - Load comemnts
  // - Play selected single
  $scope.selectSingle = function(single){
    $scope.currentSingle = single;
    loadComments(single);
    play360(single);
    $scope.$broadcast('slideBox.setSlide', 1);
  };

  $scope.back = function() {
    $scope.$broadcast("slideBox.setSlide", 0);
  };

});


app.factory("JwInfos", function($http){
  var clientId = "0be8085a39603d77fbf672a62a7929ea";
  var jwTracks = "http://api.soundcloud.com/users/67393202/tracks.json?client_id=" + clientId;
  var jwComments = "http://api.soundcloud.com/tracks/[id]/comments.json?client_id=" + clientId;

  function getSingles(callback){
    var request = $http({
      url: jwTracks,
      method: "GET"
    });

    request.success(function(data, status){
      callback(data);
    });
  };

  function getComments(id, callback){
    var request = $http({
      url: jwComments.replace("[id]", id),
      method: "GET"
    });

    request.success(function(datas, status){
      callback(datas);
    });
  }

  return {
    getSingles : getSingles,
    clientId: clientId,
    getComments: getComments
  };
});


