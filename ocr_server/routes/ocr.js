var express = require('express');
var router = express.Router();

// 파일을 주고 받지 않고, 다운받아 놓은 mp4를 기반으로 프레임 캡쳐 후 img파일 (.png)로 저장.
// img 저장 후, ocr진행.
// ocr result (text) -> response

router.post('/', function(req, res, next) {
  //1. request body (time, video_name) 을 받아서 저장\
    const { video_time, video_name } = req.body;
  //2. converter.py를 child_process로 생성해서 img파일 저장. return 값 이미지 파일 이름

    capture_frame(video_name, video_time).then((img_file_name) => {
        ocr_imge(img_file_name).then((result_text) => {
            res.status(200).json(
                {
                    "result" : result_text,
                }
            )
        }).catch()
    }).catch()
  //3. 이미지 파일이름을 ocr.py에 인자로 child_process 생성 -> return 값 ocr 결과 text

  //4. response -> result_text
    
});

function capture_frame(video_name, video_time){
    return new Promise(function(resolve, reject){
        const spawn = require('child_process').spawn;

        //@@서버에선 python3
        const result = spawn('python', ['./capture_module/converter.py', video_time, video_name]);
        try{
            result.stdout.on('data', function(data){
                console.log(data.toString());
                captured_img = data.toString();
            });
            result.on('close', function () {
                console.log('end');
                resolve(captured_img);
            });
        }catch (err){
            console.log('error')
            reject(err)
        }
    })
}

function ocr_imge(img_file_name){
    return new Promise(function(resolve, reject){
        const spawn = require('child_process').spawn;

        //@@서버에선 python3
        const result = spawn('python', ['./ocr/ocr.py', img_file_name]);
        try{
            result.stdout.on('data', function(data){
                console.log(data.toString());
                result_text = data.toString();
            });
            result.on('close', function () {
                console.log('end');
                resolve(result_text);
            });
        }catch (err){
            console.log('error')
            reject(err)
        }
    })
}

module.exports = router;
