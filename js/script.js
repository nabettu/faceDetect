$(function() {

  var video = $('#video')[0];
  var canvas = $("<canvas></canvas>")[0];
  canvas.height = 480;
  canvas.width = 640;
  var ctx = canvas.getContext('2d');
  var localMediaStream = null;

  //カメラ使えるかチェック
  var hasGetUserMedia = function() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia);
  };
  var onFailSoHard = function(e) {
    console.log('エラー!', e);
  };

  if (hasGetUserMedia()) {
    console.log("カメラ OK");
  } else {
    alert("未対応ブラウザです。");
  }

  window.URL = window.URL || window.webkitURL;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

  navigator.getUserMedia({
    video: true
  }, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
    console.log(video);
  }, onFailSoHard);

  var interval = setInterval(function() {
    if (localMediaStream) {
      ctx.drawImage(video, 0, 0);

      var img = new Image();
      img.src = canvas.toDataURL('image/webp');


      // 画像の読み込み完了時の処理
      img.onload = function() {
        $("#img").attr("src", img.src);


        if (!nowdetect) {
          nowdetect = true;
          // プログラムの実行
          $("#img").faceDetection({

            // プログラムが完了すると[obj]に顔に関するデータが含まれている
            complete: function(obj) {
              console.log("start");

              // 顔を認識できなかった(objにデータがない)場合
              if (typeof(obj) == 'undefined') {
                alert("顔情報を認識できませんでした…。");
                return false;
              }

              // 顔を認識できた場合
              else {
                // テキストエリアに表示するためのデータ
                var object_str = '';
                console.log(obj.length);

                if (obj.length > 0) {



                  //人数分だけループ処理する
                  for (var i = 0; i < obj.length; i++) {
                    // 取得したデータをテキストエリアに表示していくためのデータ
                    object_str += "[No: " + i + "]" + "\n";
                    object_str += "x: " + obj[i].x + "\n";
                    object_str += "y: " + obj[i].x + "\n";
                    object_str += "width: " + obj[i].width + "\n";
                    object_str += "height: " + obj[i].height + "\n";
                    object_str += "positionX: " + obj[i].positionX + "\n";
                    object_str += "positionY: " + obj[i].positionY + "\n";
                    object_str += "offsetX: " + obj[i].offsetX + "\n";
                    object_str += "offsetY: " + obj[i].offsetY + "\n";
                    object_str += "scaleX: " + obj[i].scaleX + "\n";
                    object_str += "scaleY: " + obj[i].scaleY + "\n";
                    object_str += "confidence: " + obj[i].confidence + "\n\n";

                    // 取得したデータをテキストエリアに表示
                    $('#face-data').val(object_str).css('height', (object_str.split("\n").length + 5) + 'em');

                    // ラッパー要素内に、顔範囲を示すdiv要素を追加

                    $("#detectResult").html("").append('<div class="' + id + '-border"></div>');

                    // 顔範囲の場所を動的に指定
                    $('.' + id + '-border').eq(i).css({
                      left: (obj[i].x * obj[i].scaleX) + ($('#' + id).offset().left - $('#' + id).parent().offset().left) + 'px',
                      top: (obj[i].y * obj[i].scaleY) + ($('#' + id).offset().top - $('#' + id).parent().offset().top) + 'px',
                      width: obj[i].width * obj[i].scaleX + 'px',
                      height: obj[i].height * obj[i].scaleY + 'px'
                    });

                  }

                  console.log(nowdetect);
                }
                nowdetect = false;

              }
            },

            // プログラムの実行に失敗した時の処理
            error: function(code, message) {
              // エラーすると原因を示すテキストを取得できるのでアラート表示する
              alert('Error:' + message);
            }
          });
        }
      };
    }
  }, 50);

  var id = 'video';

  var nowdetect = false;



});
