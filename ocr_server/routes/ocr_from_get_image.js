var express = require('express');
var router = express.Router();


const multer  = require('multer');
const fs = require('fs');
const path = require('path');

// 이미지 파일로 전송 받았을 때를 위해서 작성한 router.
// 현재 사용 x

//파일을 저장할 디렉토리 설정 (현재 위치에 uploads라는 폴더가 생성되고 하위에 파일이 생성된다.)
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
      if (!fs.existsSync('./images')){
        fs.mkdirSync('./images');
      }
      cb(null, './images');
    }, // 이미지 업로드 경로
    filename : (req,file, cb) => {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname))
    }
}) 

const upload = multer({storage : storage});

router.post('/test_body', upload.single("img"), async function(req,res){
  const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = req.file;
  const { name } = req.body;

  // ocr.py 실행
  const promise1 = ocr(path);
  // ocr.py 실행 끝

  //확인용
  // console.log("body 데이터 : ", name);
  // console.log("폼에 정의된 필드명 : ", fieldname);
  // console.log("사용자가 업로드한 파일 명 : ", originalname);
  // console.log("파일의 엔코딩 타입 : ", encoding);
  // console.log("파일의 Mime 타입 : ", mimetype);
  // console.log("파일이 저장된 폴더 : ", destination);
  // console.log("destinatin에 저장된 파일 명 : ", filename);
  // console.log("업로드된 파일의 전체 경로 ", path);
  // console.log("파일의 바이트(byte 사이즈)", size);

  //결과가 오면 받은 이미지 파일을 삭제하고 ocr완료한 text를 리턴
  promise1
  .then((value) =>{
    fs.access(path, fs.constants.F_OK, (err) => { // A
      if (err) return console.log('삭제할 수 없는 파일입니다');
    
      fs.unlink(path, (err) => err ?  
        console.log(err) : console.log(`${path} 를 정상적으로 삭제했습니다`));
    });
    res.status(200).json(
      {
      "message" : value
      }
    )
  })
  .catch()
  
});

async function ocr(path){
  const spawn = require('child_process').spawn;

  const result = spawn('python', ['./ocr/ocr.py', path]);
  var ocr_text = '';

  //ocr.py 는 동기적으로 실행되어 결과값을 기다려야함.
  await new Promise(async (resolve) => {   
    result.stdout.on('data', function(data){
        console.log(data.toString());
        ocr_text = data.toString();
    });

    result.stderr.on('data', function(data){
        console.log(data.toString());
        ocr_text = data.toString();
    });
    result.on('close', resolve);
  }).catch() 
  return ocr_text;
  
  
}


module.exports = router;
