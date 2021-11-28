var express = require('express');
const fs= require('fs');
var router = express.Router();
const config= require('../config');
// 파일을 주고 받지 않고, 다운받아 놓은 mp4를 기반으로 프레임 캡쳐 후 img파일 (.png)로 저장.
// img 저장 후, ocr진행.
// ocr result (text) -> response

// 해야할 것!
// 캡쳐 후 이미지 스토리지 저장하고 url 반환해주는 거 추가
// 캡쳐 시도 시 mp4없으면 loading 확인 하고 기다렸다가 하기. (생각해보니 video_name 이 없어서 )
// 똑같은 캡쳐 시도 들어올 때. -->> 중복 이미지 고려방향 생각.


/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The path to your file to upload
// const filePath = 'path/to/your/file';

// The new ID for your GCS file
// const destFileName = 'your-new-file-name';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({ keyFilename : config.gs_key}); //google cloud storage key path.

//google storage upload 함수
async function uploadFile(filePath) {
    destFileName = 'video_capture/' + filePath.slice(15);  // ./image_frames/ -잘라내기
    bucketName = 'cap_video_capture'
  await storage.bucket(bucketName).upload(filePath, {
    destination: destFileName,
  });
  result_url = 'https://storage.googleapis.com/' + bucketName + '/' + destFileName;
  return result_url; 
}


//한장에 대해서 ocr 리퀘스트
router.post('/', function(req, res, next) {
      const {x,y,w,h,video_time,video_name} = req.body;
      console.log(x,y,w,h, video_name, video_time);
    //2. converter.py를 child_process로 생성해서 img파일 저장. return 값 이미지 파일 이름
      capture_frame(video_name, video_time, x, y, w, h).then((img_file_name) => { 
          console.log(img_file_name, '!');
          var res_url = '';
          uploadFile(img_file_name).then((result) =>{ // upload image file to google storage.
              res_url = result;
          }).catch(console.error)
          ocr_imge(img_file_name).then((result_text) => {//3. 이미지 파일이름을 ocr.py에 인자로 child_process 생성 -> return 값 ocr 결과 text
                res.status(200).json(//4. response -> result_text, img_url
                  {
                      "result" : result_text,
                      "img_url" : res_url
                  }
              )
              return img_file_name;
          }).then((img_file_name)=>{
            fs.unlink(img_file_name, function(err){
                if(err) {
                console.log("Error : ", err)
                }
            })
          }).catch()
      }).catch()
  });

  //캡쳐만 리퀘스트
  router.post('/only_capture', function(req, res, next) { // ocr 없이 캡쳐만 request 시
      const {x,y,w,h,video_time,video_name} = req.body;
      console.log(x,y,w,h, video_name, video_time);
  
      capture_frame(video_name, video_time, x, y, w, h).then((img_file_name) => { 
          console.log(img_file_name, '!');
          var res_url = '';
          uploadFile(img_file_name).then((result) =>{
              res_url = result;
              res.status(200).json(//4. response -> img_url
                {
                    "img_url" : res_url
                }
            )
            return img_file_name;
          }).catch(console.error).then((img_file_name)=>{
            fs.unlink(img_file_name, function(err){
                if(err) {
                console.log("Error : ", err)
                }
            })
          })
      }).catch()
  });

  // 연속된 ocr 리퀘스트
  router.post('/continuous', function(req, res, next) {
    const {x,y,w,h,start_time, end_time,video_name} = req.body; //x,y,w,h 좌표와 시작시간, 끝시간, video_name을 받는다.
    console.log(x,y,w,h, video_name, start_time, end_time);

  //2. segmenter.py를 child_process로 생성해서 img파일 저장. return 값 이미지 폴더 이름
    capture_multi_frames(video_name, start_time,end_time, x, y, w, h).then((img_folder_name) => { 
        console.log(img_folder_name, '!');
        // 이미지 업로드 x
        ocr_multi_image(img_folder_name).then((result_text) => {//3. 이미지 폴더이름을 multi_ocr.py에 인자로 child_process 생성 -> return 값 ocr 결과 text
              res.status(200).json(//4. response -> result_text
                {
                    "result" : result_text,
                }
            )
            return img_folder_name;
        }).then((img_folder_name)=>{ //완료한 폴더 삭제.
            fs.rmdir(img_folder_name, {recursive: true},function(err){
                if(err) {
                console.log("Error : ", err)
                }
            })
          })
    }).catch()
});

// .then((img_folder_name)=>{ //완료한 폴더 삭제.
//     fs.rmdir(img_folder_name, {recursive: True},function(err){
//         if(err) {
//         console.log("Error : ", err)
//         }
//     })
//   }).catch()

//한장에 대해서 img frame 찾아서 저장하기.
function capture_frame(video_name, video_time, x, y, w, h){
    return new Promise(function(resolve, reject){
        const spawn = require('child_process').spawn;

        //@@서버에선 python3
        const result = spawn('python3', ['./capture_module/converter.py', video_time, video_name, x, y, w, h]);
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
// 여러장에 대해서 img frames 찾아서 저장하기. 이미지 프레임의 폴더명 반환.
function capture_multi_frames(video_name, start_time,end_time, x, y, w, h){
    return new Promise(function(resolve, reject){
        const spawn = require('child_process').spawn;

        //@@서버에선 python3
        const result = spawn('python3', ['./capture_module/segmenter.py', x, y, w, h,start_time,end_time, video_name ]);
        try{
            result.stdout.on('data', function(data){
                console.log(data.toString());
                captured_img_folder = data.toString();
            });
            result.on('close', function () {
                console.log('end');
                resolve(captured_img_folder);
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
        const result = spawn('python3', ['./ocr/ocr.py', img_file_name]);
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

function ocr_multi_image(img_folder_name){
    return new Promise(function(resolve, reject){
        const spawn = require('child_process').spawn;

        //@@서버에선 python3
        const result = spawn('python3', ['./ocr/multi_ocr.py', img_folder_name]);
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
