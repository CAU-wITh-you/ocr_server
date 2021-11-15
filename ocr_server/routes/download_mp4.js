var express = require('express');
var router = express.Router();


// url을 request받아서 mp4를 다운받고, 고유번호를 response (다음 ocr시도 시 고유번호와 함께 request를 위해서 )
// request body는 { "url" : "..."}

router.post('/', function(req, res, next) {
  //1. request body 에서 url 받아오기
    url = req.body.url;
  //2. child_process -> downloader.py이용해서 mp4 다운로드. (return 값은 video파일 이름(경로)) -- promise로 해야함.
    download_video(url).then(function(video_name){
        res.status(200).json(
            {
            "video_name" : video_name
            }
        )
    }).catch()
  //3. response 로 video name 전송. (video name은 uuid로 고유이름을 만든다.) 서버에서 video 이름 저장 필요? -- 캡쳐 시 request body 에 video name 을 받을 예정.
    
});

function download_video(url){
    return new Promise(function(resolve, reject){
        const spawn = require('child_process').spawn;

        //@@서버에선 python3
        const result = spawn('python', ['./capture_module/downloader.py', url]);
        try{
            result.stdout.on('data', function(data){
                console.log(data.toString());
                video_name = data.toString();
            });
            result.on('close', function () {
                console.log('end');
                resolve(video_name);
            });
        }catch (err){
            console.log('error')
            reject(err)
        }
    })
}

module.exports = router;
