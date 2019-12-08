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

    var imagePicker: UIImagePickerController!
    
    @IBOutlet var imageView: UIImageView!
    @IBAction func photoCapture(_ sender: Any) {
        imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = .camera
        present(imagePicker, animated: true, completion: nil)
        
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        imagePicker.dismiss(animated: true, completion: nil)
        var photo = info[.originalImage] as? UIImage
        imageView.image = photo
        uploadImage(image: photo!)
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    func uploadImage(image: UIImage) {
        let url = "http://13.59.168.154:3000/recognize"
        let data = image.jpegData(compressionQuality: 0.2)
        
        AF.upload(multipartFormData: { multipartFormData in
            multipartFormData.append(data!, withName: "image", fileName: "image.jpg", mimeType: "image/jpg")
        }, to: url)
            .responseJSON { response in
                if let data = response.data, let utf8Text = String(data: data, encoding: .utf8) {
                    let text = AVSpeechUtterance(string: String(utf8Text))
                    text.voice = AVSpeechSynthesisVoice(language: "en-GB")
                    text.rate = 0.2
                    let voice = AVSpeechSynthesizer()
                    voice.speak(text)
                    
                }
            }
    }
}

