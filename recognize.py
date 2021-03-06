import cv2
import face_recognition as fr
import numpy as np
import os
import image_to_numpy as im_np

#-----------Based on ageitgey/face_recognition demo-----------#

def main():

    #----------Load Known values----------#
    known_encodings = [] #arrays for encodings and associated names
    known_names = []

    for filename in os.listdir("./images"):  #loop through images folder for known names and images
        if filename.startswith("."): #ignore .ds_store and other hiddens
            continue
        image_file = fr.load_image_file("./images/" + filename)
        image_encodings = fr.face_encodings(image_file)[0]
        known_encodings.append(image_encodings)
        name = filename.split(".")[0] #better hope there are no periods in name
        known_names.append(name)


    face_locations, face_encodings, face_names = [], [], [] #arrays for processing sent frames
    process_frame = 0 #counter to allow processing every n frames
    n = 1

    #----------Process Captured Frames----------#
    for fname in os.listdir("./captured_frames"): #loop through frames stored in captured_frames folder
        if fname.startswith("."): #ignore .ds_store and other hiddens
            continue
        frame = im_np.load_image_file("./captured_frames/" + fname)
        RESIZE = 2
        #resize for faster processing
        small_frame = cv2.resize(frame, (0,0), fx=1/RESIZE, fy=1/RESIZE) 
        rgb_small = small_frame[:, :, ::-1]

        #process every few frames
        if process_frame % n == 0:
            face_locations = fr.face_locations(rgb_small)
            face_encodings = fr.face_encodings(rgb_small, face_locations)

            #check each set of encodings for a match
            for face_encoding in face_encodings:
                matches = fr.compare_faces(known_encodings, face_encoding)
                name = "Unknown"

                #get "closest" match
                face_distances = fr.face_distance(known_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_names[best_match_index]

                #append name to list
                if not (name in face_names):
                    face_names.append(name)
        process_frame += 1
    tot_names = len(face_names)
    if tot_names > 0: #append names to response string
        response = "I have found "
        c = 1
        for name in face_names:
            response += name
            if c < tot_names:
                response += " and "
            c += 1
        print(response)
    else:
        print("I have found no one")
        
main()
