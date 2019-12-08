//
//  ViewController.swift
//  testtttt
//
//  Created by Matthew Karle on 12/5/19.
//  Copyright © 2019 Matthew Karle. All rights reserved.
//

import UIKit
import Alamofire
import MobileCoreServices
import AVFoundation

class ViewController: UIViewController, UINavigationControllerDelegate, UIImagePickerControllerDelegate {

    var imagePicker: UIImagePickerController! //controller to access camera
    
    @IBOutlet var imageView: UIImageView! //image view to display selected image
    
    /*
     IBAction function linked to "Take photo" button
     Opens camera and allows user to take picture
     */
    @IBAction func photoCapture(_ sender: Any) {
        imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = .camera
        present(imagePicker, animated: true, completion: nil)
        
    }
    
    /*
     Function defining image picker behavior
     Sets imageview to taken photo and uploads image to server
     */
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        imagePicker.dismiss(animated: true, completion: nil) //dismiss cameraview
        var photo = info[.originalImage] as? UIImage
        imageView.image = photo //set imageview to taken photo
        uploadImage(image: photo!) //call our request function to send photo to server
    }
    
    /*
     Override of viewdidload function to display view
     */
    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    /*
     Sends a post request with a taken image
     Speaks back server response
     */
    func uploadImage(image: UIImage) {
        let url = "http://13.59.168.154:3000/recognize" //set url to our EC2 instance
        let data = image.jpegData(compressionQuality: 0.2) //convert image to jpeg data
        
        
        //use alamofire module to upload multipart request containing image data
        AF.upload(multipartFormData: { multipartFormData in
            multipartFormData.append(data!, withName: "image", fileName: "image.jpg", mimeType: "image/jpg")
        }, to: url)
            .responseJSON { response in
                if let data = response.data, let utf8Text = String(data: data, encoding: .utf8) { //get server response
                    //produce text to speech for user interface
                    let text = AVSpeechUtterance(string: String(utf8Text))
                    text.voice = AVSpeechSynthesisVoice(language: "en-GB")
                    text.rate = 0.4
                    let voice = AVSpeechSynthesizer()
                    voice.speak(text)
                    
                }
            }
    }
}

