var express = require('express');
var router = express.Router();
const mp4_table = require('../data/data');

// url을 request받아서 mp4를 다운받고, 고유번호를 response (다음 ocr시도 시 고유번호와 함께 request를 위해서 )
// request body는 { "url" : "..."}

function wait_data(callback, url){
    setTimeout(()=>{
        if (check_mp4(url) !== -1){
            callback(mp4_table.return_video_name(url));
        }else{
            wait_data(callback, url);
        }
    }, 500);
}

router.post('/', function(req, res, next) {
  //1. request body 에서 url 받아오기
    // console.log(process.cwd(), '!!!!');
    url = req.body.url;
    url = url_modify(url);
    check_mp4(url).then((user_count) => { 
        // 2. 다운로드 전에 mp4_table 확인해서 현재 존재하는 mp4인지 확인
        if (user_count === -1){// 3. mp4_table 없으면 check loading
            mp4_table.isLoadingData(url).then((in_loading) => {
                console.log('when user_count == -1 ');
                if (in_loading){ // loading에 있으면 data에 뜰 때까지 wait 필요.
                    new Promise(function(resolve, reject) {
                        wait_data(resolve, url);                   
                    }).then((video_name) => { // wait가 끝나면 데이터 확인해서 user수 add 후 response.
                        add_mp4_user(url, video_name).then(check =>{
                            console.log('after add : ', check);
                            res.status(200).json(
                            {
                                "video_name" : video_name
                            }
                        )
                        }).catch(console.error);
                        
                    }).catch(console.error);
                }else{ // loading에 없으면 loading에 추가 후, 다운로드 시도.
                    mp4_table.add_loading_data(url);
                    // 2. child_process -> downloader.py이용해서 mp4 다운로드. (return 값은 video파일 이름(경로)) -- promise로 해야함.
                    download_video(url).then((video_name) =>{{// 다운로드 완료 후 data에 추가, loading에 삭제
                        console.log('download end');
                        add_mp4_user(url, video_name).then(check => {
                            console.log('after add : ', check);
                            mp4_table.del_loading_data(url);
                            res.status(200).json(
                            {
                                "video_name" : video_name
                            }
                        )
                        });
                    }}).catch(console.error);
                }
            }).catch(console.error);
        }else{ //data에 있으면 data video name return.
            mp4_table.return_video_name(url).then(video_name => {
                if( video_name === false){
                    res.status(404).json(
                        {
                        "video_name" : video_name
                        }
                    )
                }else{
                    add_mp4_user(url, video_name).then(check => {
                        console.log('after add : ', check);
                    res.status(200).json(
                        {
                        "video_name" : video_name
                        }
                    )
                    }).catch(console.error);
                }
            }).catch(console.error);
        }
    }).catch(console.error);
    // console.log(url);
    
    
  //3. response 로 video name 전송. (video name은 uuid로 고유이름을 만든다.) 서버에서 video 이름 저장 필요? -- 캡쳐 시 request body 에 video name 을 받을 예정.
    
});

function download_video(url){
    return new Promise(function(resolve, reject){
        const spawn = require('child_process').spawn;
        // console.log(url);
        //@@서버에선 python3
       
        const result = spawn('python3', ['./capture_module/downloader.py', url]);
        try{
            video_name = ""     // 비디오 이름 선언.
            result.stdout.on('data', function(data){
                console.log('test!!')
                console.log(data.toString());
                video_name = data.toString();
            });
            result.stderr.on('data', function(data) {
                console.log(data.toString(), '!!');
            });
            result.on('close', function () {
                console.log('end ::', video_name);

                resolve(video_name);
            });
        }catch (err){
            console.log('error')
            reject(err)
        }
    })
}

function add_mp4_user(url, video_name){ //user 수 check 후 data에 add. 
    // url 정리. 뒤에 &이후에 나오는 필요없는 정보를 제거
    check_mp4(url).then((count) => {
        if (count === -1){ //존재하지 않을 때는 처음으로 등록, 1은 처음 유저이므로
            return mp4_table.add_data(url, video_name, 1).then(input_data => {
                return input_data.user_count;
            });
        }else{ //존재할 때는 유저수 증가.
            return mp4_table.user_count_add(url);
        }
    })
}

// mp4_table에 mp4가 있는지 확인. 있으면 사용하고 있는 user_count, 없으면 -1
function check_mp4(url){
    return mp4_table.isVideo(url);
}


//받는 유튜브 주소에서 &이후에 나오는 필요없는 정보 제거.
function url_modify(url){
    index = url.indexOf("&" ,28);
    if (index === -1) return url;
    
    new_url = url.substring(0, index);
    return new_url;
}

module.exports = router;
