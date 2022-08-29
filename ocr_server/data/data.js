const {getMp4s} = require('../database/database');
const {getLoadingMp4s} = require('../database/database');
//mp4 다운로드를 위해 유지하는 테이블
//같은 url로 들어오는 request에 대해서 중복으로 mp4를 다운받는 경우를 방지한다.
//mp4다운로드 중에 request가 왔을 때, loading_data를 확인해서 현재 다운로드 중인지 확인하도록한다.


async function isLoadingData(url){
    return await getLoadingMp4s().findOne({url : url}).then((data) => {
        // console.log('isLoadingData!!\n', data);
        if (!data){
            return false;
        }
        else{
            return true;
        }
    });
}

async function add_loading_data(url){
    input_data = { url : url };
    return getLoadingMp4s().insertOne(input_data).then((data) => {
        // console.log('add_loading_data!!\n', data);
        return data;
    })
}

async function del_loading_data(url){
    const result = await getLoadingMp4s().deleteOne({url : url});
    if (result.deletedCount === 1) {
        console.log("Successfultty deleted one document -- loading_data");
    } else {
        console.log("No documents matched the query. Deleted 0 documents -- loading data");
    }
}

async function add_data(url, video_name, user_count){
    input_data = { url : url, video_name : video_name, user_count : user_count, latest_used : new Date()};
    return getMp4s().insertOne(input_data).then(() => {
        // console.log('add_data!!\n', data);
        return input_data;
    })
}

// user count add & latest used time update.
async function user_count_add(url){
    before_data = await getMp4s().findOne({url : url}).then((data) => {
        return data;
    });
    return getMp4s().findOneAndUpdate(
        { url : url },
        { $set : { 
            user_count : before_data.user_count + 1,
            latest_used : new Date()
        }},
        {returnDocument : 'after'}
    ).then((result) => {
        // console.log('after user_count_add!!\n', result.value);
        return result.value.user_count
    });
}

async function user_count_minus(url){
    before_data = await getMp4s().findOne({url : url}).then((data) => {
        return data;
    });
    return getMp4s().findOneAndUpdate(
        { url : url },
        { $set : { 
            user_count : before_data.user_count -1,
        }},
        {returnDocument : 'after'}
    ).then((result) => result.value.user_count);
}

// when remove mp4 file, in mongoDB mp4 table's user count set -1.(not delete)
async function user_count_reset(url){
    return getMp4s().findOneAndUpdate(
        { url : url },
        { $set : { 
            user_count : -1,
        }},
        {returnDocument : 'after'}
    ).then((result) => result.value.user_count);
}

async function delete_data(url){
    deleted = await getMp4s().deleteOne({url : url});
    // console.log('delete Document in mp4data!!\n', deleted);
}

async function return_video_name(url){
    return await getMp4s().findOne({url : url}).then((data) => {
        // console.log('return_video_name!!\n', data);
        if (data){
            return data.video_name;
        }else{
            return false;
        }
    }).catch(console.error);
}

async function IsVideo(url){
    find_data = await getMp4s().findOne({url : url}).then((data) => {
        // console.log('IsVideo!!\n', data);
        return data;
    });
    if (!find_data){
        // console.log("test.. is Video return -1");
        return -1;
    }
    else{
        // console.log('find_data in IsVideo', find_data.user_count);
        return find_data.user_count;
    }
}

async function IsVideo_byVideoName(video_name){
    find_data = await getMp4s().findOne({video_name : video_name}).then((data) => {
        // console.log('IsVideo_byVideoName!!\n', data);
        return data;
    });
    if (!find_data){
        return { user_count : -1, url : 'not found'};
    }
    else{
        return {user_count : find_data.user_count, url : find_data.url};
    }
}

async function video_use_check(){
    const query = { user_count : {$gt : 0}};
    const cursor = getMp4s().find(query);
    const now = new Date();
    if ((await cursor.count()) === 0) {
        console.log("No documents found!");
    }

    await cursor.forEach(document => {
        timeDiff = getDateDiff(now ,document.latest_used);
        if (timeDiff > 0.9){ // when mp4 latest used time is more than a day.
            console.log(document.url, 'is more than a day. delete mp4');
            // DB에 user count reset 후, mp4 삭제.
            user_count_reset(document.url).then(() =>{
                file = './Downloads/' + document.video_name + '.mp4';
                fs.unlink(file, function(err){
                    if(err) {
                    console.log("Error : ", err)
                    }
                })
            })
        }
        
    })
}

function getDateDiff(d1, d2){
    const diffDate = d1 - d2;
    return Math.abs(diffDate / (1000 * 60 * 60 * 24));
}

module.exports.add_data = add_data;
module.exports.isVideo = IsVideo;
module.exports.isVideo_byVideoName = IsVideo_byVideoName;
module.exports.user_count_add = user_count_add;
module.exports.user_count_minus = user_count_minus;
module.exports.user_count_reset = user_count_reset;
module.exports.delete_data = delete_data;
module.exports.return_video_name = return_video_name;
module.exports.del_loading_data = del_loading_data;
module.exports.add_loading_data = add_loading_data;
module.exports.isLoadingData = isLoadingData;
module.exports.video_use_check = video_use_check;