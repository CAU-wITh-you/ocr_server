let data = []
let loading_data = []

//mp4 다운로드를 위해 유지하는 테이블
//같은 url로 들어오는 request에 대해서 중복으로 mp4를 다운받는 경우를 방지한다.
//mp4다운로드 중에 request가 왔을 때, loading_data를 확인해서 현재 다운로드 중인지 확인하도록한다.


function isLoadingData(url){
    find_data = loading_data.find((loading_data) => loading_data.url === url);
    if (find_data === undefined){
        return false;
    }
    else{
        return true;
    }
}

function add_loading_data(url){
    input_data = { url : url };
    loading_data.push(input_data);
    return input_data;
}

function del_loading_data(url){
    find_data = loading_data.find((loading_data) => loading_data.url === url);
    const idx = loading_data.indexOf(find_data);
    if (idx > -1) loading_data.splice(idx, 1)
}

function add_data(url, video_name, user_count){
    input_data = { url : url, video_name : video_name, user_count : user_count};
    data.push(input_data);
    return input_data;
}

function user_count_add(url){
    find_data = data.find((data) => data.url === url);
    if (find_data !== undefined)
        find_data.user_count += 1;
    return find_data.user_count;
}
function user_count_minus(url){
    find_data = data.find((data) => data.url === url);
    if (find_data !== undefined)
        find_data.user_count -= 1;
    return find_data.user_count;
}
function delete_data(url){
    find_data = data.find((data) => data.url === url);
    if (find_data !== undefined){
        const idx = data.indexOf(find_data);
        if (idx > -1) data.splice(idx, 1)
    }
    
}

function return_video_name(url){
    find_data = data.find((data) => data.url === url);
    if (find_data !== undefined){
        return find_data.video_name;
    }else{
        return false;
    }
    

}

function IsVideo(url){
    find_data = data.find((data) => data.url === url);
    if (find_data === undefined){
        return -1;
    }
    else{
        return find_data.user_count;
    }
}

function IsVideo_byVideoName(video_name){
    find_data = data.find((data) => data.video_name === video_name);
    if (find_data === undefined){
        return { user_count : -1, url : 'not found'};
    }
    else{
        return {user_count : find_data.user_count, url : find_data.url};
    }
}

module.exports.data = data;
module.exports.add_data = add_data;
module.exports.isVideo = IsVideo;
module.exports.isVideo_byVideoName = IsVideo_byVideoName;
module.exports.user_count_add = user_count_add;
module.exports.user_count_minus = user_count_minus;
module.exports.delete_data = delete_data;
module.exports.return_video_name = return_video_name;
module.exports.loading_data = loading_data;
module.exports.del_loading_data = del_loading_data;
module.exports.add_loading_data = add_loading_data;
module.exports.isLoadingData = isLoadingData;