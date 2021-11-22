import os
import cv2
import uuid
import sys
from segment_finder import VideoSegmentFinder
video_segment_finder = VideoSegmentFinder()

import io

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

# Get the selected frames
# x,y,w,h좌표와 시작시작(start_time), 끝나는시간(end_time), video_name을 받아서 수행.
if __name__ == '__main__':
    # print('Getting selected frames')
    x = float(sys.argv[1])
    y = float(sys.argv[2])
    w = float(sys.argv[3])
    h = float(sys.argv[4])
    start_time = float(sys.argv[5])
    end_time = float(sys.argv[6])
    video_name = str(sys.argv[7]) #video_name은 .mp4없는 형태
    vidpath = os.path.join(os.getcwd(),'Downloads')
    video_file_path = os.path.join(vidpath, video_name + '.mp4')
    selected_frames_data = video_segment_finder.get_best_segment_frames(video_file_path, x,y,w,h,start_time, end_time) #인자로 video_file_path, x,y,w,h, start_time, end_time 주기.
    frame_nums = sorted(selected_frames_data.keys())
    selected_frames = [selected_frames_data[i]["frame"] for i in frame_nums]
    
    #print(selected_frames)
    # 폴더네임은 유니크하게. image_frames 폴더 안에 위치하게.
    
    foldername = uuid.uuid4().hex
    foldername = './image_frames/' + foldername
    if not os.path.exists(foldername):
        os.makedirs(foldername)

    for i in range(0, len(selected_frames)):
        frame = selected_frames[i]

        #assign a name for our files 
        name = foldername+'/frame' + str(i) + '.png'
        
        #assign our print statement
        cv2.imwrite(name, frame)
    print(foldername, end='')