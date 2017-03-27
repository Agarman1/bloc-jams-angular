(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};

        /**
        * @desc Active album from list of albums
        * @type {Object}
        */

        var currentAlbum = Fixtures.getAlbum();

         /**
         * @desc Buzz object audio file
         * @type {Object}
         */

         var currentBuzzObject = null;

         /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song
         */

         var setSong = function(song) {
             if (currentBuzzObject) {
               /** currentBuzzObject.stop();
               * SongPlayer.currentSong.playing = null;
               */
               stopSong(song);
             }

             currentBuzzObject = new buzz.sound(song.audioUrl, {
                 formats: ['mp3'],
                 preload: true
             });

             currentBuzzObject.bind('timeupdate', function() {
                 $rootScope.$apply(function() {
                     SongPlayer.currentTime = currentBuzzObject.getTime();
                 });
             });

             SongPlayer.currentSong = song;
          };

          /**
          * @function playSong
          * @desc Plays song and sets song.playing to true
          * @param {Object} song
          */

          var playSong = function(song) {
             currentBuzzObject.play();
             song.playing = true;
          }

          /**
          * @function stopSong
          * @desc Stops song and sets song.playing to null
          * @param {Object} song
          */

          var stopSong = function(song) {
             currentBuzzObject.stop();
             SongPlayer.currentSong.playing = null;
          }

          /**
          * @function getSongIndex
          * @desc Gets index of song object from current album
          * @param {Object} song
          */

          var getSongIndex = function(song) {
              return currentAlbum.songs.indexOf(song);
          };

          /**
          * @desc Active song object from list of songs
          * @type {Object}
          */

          SongPlayer.currentSong = null;

          /**
          * @desc Current playback time (in seconds) of currently playing song
          * @type {Number}
          */
          SongPlayer.currentTime = null;

          /**
          * @desc Default volume
          * @type {Number}
          */
          SongPlayer.currentVolume = null;

          /**
          * @desc Max volume
          * @type {Number}
          */
          SongPlayer.maxVolume = 100;

          SongPlayer.play = function(song) {
             song = song || SongPlayer.currentSong;
             if (SongPlayer.currentSong !== song) {
                 setSong(song);
                 playSong(song);

             } else if (SongPlayer.currentSong === song) {
                 if (currentBuzzObject.isPaused()) {
                       playSong(song);
                 }
             }
          };

          SongPlayer.pause = function(song) {
             song = song || SongPlayer.currentSong;
             currentBuzzObject.pause();
             song.playing = false;
          };

          SongPlayer.previous = function() {

            /**
            * @desc Holds current song index
            * @type {Object}
            */

              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex--;

              if (currentSongIndex < 0) {
                  /** currentBuzzObject.stop();
                  * SongPlayer.currentSong.playing = null;
                  */
                  stopSong(song);

              } else {
                  var song = currentAlbum.songs[currentSongIndex];
                  setSong(song);
                  playSong(song);
              }

          };

          SongPlayer.next = function() {

            /**
            * @desc Holds current song index
            * @type {Object}
            */

              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex++;

              if (currentSongIndex > currentAlbum.songs.length) {
                /** currentBuzzObject.stop();
                * SongPlayer.currentSong.playing = null;
                */
                stopSong(song);
              } else {
                  var song = currentAlbum.songs[currentSongIndex];
                  setSong(song);
                  playSong(song);
              }

          };

          /**
          * @function setCurrentTime
          * @desc Set current time (in seconds) of currently playing song
          * @param {Number} time
          */
          SongPlayer.setCurrentTime = function(time) {
              if (currentBuzzObject) {
                  currentBuzzObject.setTime(time);
              }
          };

          /**
          * @function setCurrentVolume
          * @desc Set current volume of currently playing song
          * @param {Number} volume
          */
          SongPlayer.setVolume = function(volume) {
              if (currentBuzzObject) {
                  currentBuzzObject.setVolume(volume);
              }
          };

          return SongPlayer;
    }



    angular
          .module('blocJams')
          .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
