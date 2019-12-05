import cv2
import face_recognition as fr
import numpy as np
import os

#-----------Based on ageitgey/face_recognition demo-----------#

def main():
    #Start capture
    video_capture = cv2.VideoCapture(0)

    #----------Load Known values----------#
    known_encodings = []
    known_names = []

    for filename in os.listdir("./images"): 
        if filename.startswith("."): #ignore .ds_store and other hiddens
            continue
        image_file = fr.load_image_file("./images/" + filename)
        image_encodings = fr.face_encodings(image_file)[0]
        known_encodings.append(image_encodings)
        name = filename.split(".")[0] #better hope there are no periods in name
        known_names.append(name)


    face_locations, face_encodings, face_names = [], [], []
    process_frame = 0

    #----------Process Video----------#
    while True:
        ret, frame = video_capture.read()
        RESIZE = 2
        #resize for faster processing
        small_frame = cv2.resize(frame, (0,0), fx=1/RESIZE, fy=1/RESIZE)
        rgb_small = small_frame[:, :, ::-1]

        #process every few frames
        n = 3
        if process_frame % n == 0:
            face_locations = fr.face_locations(rgb_small)
            face_encodings = fr.face_encodings(rgb_small, face_locations)
            face_names = []

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
                face_names.append(name)
        process_frame += 1

        #display name results
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            #undo 1/RESIZE resize
            top *= RESIZE
            right *= RESIZE
            bottom *= RESIZE
            left *= RESIZE

            #draw box around face
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
            #draw a label with name
            cv2.rectangle(frame, (left, bottom -35), (right, bottom), (0, 0, 255), cv2.FILLED)
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        #display
        cv2.imshow('Video', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print(face_names[0])
            break
    video_capture.release()
    cv2.destroyAllWindows()
main()
