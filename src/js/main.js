(function(window){
      var ytp = new SpektralTube('yt-player', 'playerContainer');

      ytp.onReady(function(){
      	ytp.loadVideo('EsQ0U5sqf_I');
      	console.log('Player Ready');
      });


}(window));