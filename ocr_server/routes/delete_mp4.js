var express = require('express');
var router = express.Router();
const mp4_table = require('../data/data');
const fs = require('fs');
const e = require('express');

// 다운받은 mp4사용자가 있는지 확인하고 더 이상 없으면 mp4삭제.
// 다운로드 중 삭제 request(창 닫기 등..)가 들어 왔을 때를 생각해서, loading_data도 확인해야한다.

function wait_data(callback, url){
    setTimeout(()=>{
        if (check_mp4(url) !== -1){
            setTimeout(()=>{    // 삭제와 사용을 동시에 할 수 있으므로 삭제 시 timeout을 좀 더 넉넉히 잡아준다.
                callback(mp4_table.return_video_name(url));
            },1000)
            
        }else{
            wait_data(callback, url);
        }
    }, 500);
}

router.delete('/vid', function(req, res, next) {
    video_name = req.body.video_name;
    const {user_count, url} = check_user_count(video_name);
    console.log(user_count, url);
    if (user_count !== -1){ //data에 있을 때
        if (mp4_table.user_count_minus(url) === 0){ //사용자가 없어지면 mp4 삭제, table에서도 삭제.
            file = './Downloads/' + video_name + '.mp4';
            fs.unlink(file, function(err){
                if(err) {
                console.log("Error : ", err)
                }
            })
            mp4_table.delete_data(url);
            res.send('ok! delete!');
        }else{ // 사용자가 남아있으면 그냥 ok.
            res.send('ok!');
        }
    }else{// data에 없을 때
        if (mp4_table.isLoadingData(url)){
            new Promise(function(resolve, reject) {
                wait_data(resolve, url);                   
            }).then((video_name) => { // wait가 끝나면 데이터 확인해서 user수 minus 후 삭제 결정.
                const {user_count, url} = check_user_count(video_name); //data 확인해서 user_count, url가져오기
                if(user_count === -1) { res.send('already not exist!')}
                if (mp4_table.user_count_minus(url) === 0){ //사용자가 없어지면 mp4 삭제, table에서도 삭제.
                    file = './Downloads/' + video_name + '.mp4';
                    fs.unlink(file, function(err){
                        if(err) {
                        console.log("Error : ", err)
                        }
                    })
                    mp4_table.delete_data(url);
                    res.send('ok! delete!');
                }else{
                    res.send('ok!');
                }
            })
        }
        res.send('already not exist!');
    }
});

router.delete('/url', function(req, res, next) { // 다운로드 후 response 받기 전에 사용자가 삭제를 시도하면 (창을 닫으면)
    url = req.body.url; // url로 받는다. 
    url = url_modify(url);
    // loading 확인하고
    if (mp4_table.isLoadingData(url)){ // loading에 있으면
        new Promise(function(resolve, reject) { //data에 생기길 기다렸다가
            wait_data(resolve, url);                   
        }).then((video_name) => { // wait가 끝나면 데이터 확인해서 user수 minus 후 삭제 결정.
            const {user_count, url} = check_user_count(video_name); //data 확인해서 user_count, url가져오기
            if(user_count === -1) { res.send('already not exist!')}
            if (mp4_table.user_count_minus(url) === 0){ //사용자가 없어지면 mp4 삭제, table에서도 삭제.
                file = './Downloads/' + video_name + '.mp4';
                fs.unlink(file, function(err){
                    if(err) {
                    console.log("Error : ", err)
                    }
                })
                mp4_table.delete_data(url);
                res.send('ok! delete!');
            }else{
                res.send('ok!');
            }
        })
    }else{
        res.send('not download now');
    }


});

function check_user_count(video_name){
    const {user_count, url } = mp4_table.isVideo_byVideoName(video_name);
    console.log(user_count, url);
    return {user_count : user_count, url : url};

}
//받는 유튜브 주소에서 &이후에 나오는 필요없는 정보 제거.
function url_modify(url){
    index = url.indexOf("&" ,28);
    if (index === -1) return url;
    
    new_url = url.substring(0, index);
    return new_url;
}

function check_mp4(url){
    count = mp4_table.isVideo(url);
    return count;
}

module.exports = router;
