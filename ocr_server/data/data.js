const {getMp4s} = require('../database/database');
const {getLoadingMp4s} = require('../database/database');
//mp4 다운로드를 위해 유지하는 테이블
//같은 url로 들어오는 request에 대해서 중복으로 mp4를 다운받는 경우를 방지한다.
//mp4다운로드 중에 request가 왔을 때, loading_data를 확인해서 현재 다운로드 중인지 확인하도록한다.


function isLoadingData(url){
    find_data = getLoadingMp4s().findOne({url : url}).then((data) => {
        console.log('isLoadingData!!\n', data);
        return data;
    });
    if (find_data === undefined){
        return false;
    }
    else{
        return true;
    }
}

function add_loading_data(url){
    input_data = { url : url };
    return getLoadingMp4s().insertOne(input_data).then((data) => {
        console.log('add_loading_data!!\n', data);
        return data;
    })
}

function del_loading_data(url){
    const result = getLoadingMp4s().deleteOne({url : url});
    if (result.deletedCount === 1) {
        console.log("Successfultty deleted one document -- loading_data");
    } else {
        console.log("No documents matched the query. Deleted 0 documents -- loading data");
    }
}

function add_data(url, video_name, user_count){
    input_data = { url : url, video_name : video_name, user_count : user_count, latest_used : new Date()};
    return getMp4s().insertOne(input_data).then((data) => {
        console.log('add_data!!\n', data);
        return data;
    })
}

// user count add & latest used time update.
function user_count_add(url){
    before_data = getMp4s().findOne({url : url}).then((data) => {
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
        console.log('after user_count_add!!\n', result.value);
        return result.value.user_count
    });
}

function user_count_minus(url){
    before_data = getMp4s().findOne({url : url}).then((data) => {
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

function delete_data(url){
    deleted = getMp4s().deleteOne({url : url});
    console.log('delete Document in mp4data!!\n', deleted);
}

function return_video_name(url){
    find_data = getMp4s().findOne({url : url});
    if (find_data !== undefined){
        return find_data.video_name;
    }else{
        return false;
    }
    

}

function IsVideo(url){
    find_data = getMp4s().findOne({url : url});
    if (find_data === undefined){
        return -1;
    }
    else{
        return find_data.user_count;
    }
}

function IsVideo_byVideoName(video_name){
    find_data = getMp4s().findOne({video_name : video_name});
    if (find_data === undefined){
        return { user_count : -1, url : 'not found'};
    }
    else{
        return {user_count : find_data.user_count, url : find_data.url};
    }
}

module.exports.add_data = add_data;
module.exports.isVideo = IsVideo;
module.exports.isVideo_byVideoName = IsVideo_byVideoName;
module.exports.user_count_add = user_count_add;
module.exports.user_count_minus = user_count_minus;
module.exports.delete_data = delete_data;
module.exports.return_video_name = return_video_name;
module.exports.del_loading_data = del_loading_data;
module.exports.add_loading_data = add_loading_data;
module.exports.isLoadingData = isLoadingData;