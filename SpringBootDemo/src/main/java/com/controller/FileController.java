package com.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.transaction.annotation.Transactional;
import com.entity.User;
import com.service.UserService;
import com.service.FileService;
import com.repository.UserRepository;
import com.repository.FileRepository;
import org.json.JSONObject;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.html.HTMLParagraphElement;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;

@Controller    // This means that this class is a Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="/files") // This means URL's start with /demo (after Application path)
public class FileController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private FileService fileService;

    @PostMapping(path="/fileupload",consumes=MediaType.APPLICATION_JSON_VALUE)
    private ResponseEntity<?> fileUpload(@RequestParam("file") MultipartFile file){

        fileRepository.store(file);

        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping(path="/filedownload", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> downloadFile(@RequestBody String file, @RequestBody String userId)
    {
        InputStreamResource resource = null;
        JSONObject jsonObject = new JSONObject(file);
        try {
            resource = fileService.fileDownload(file, userId);
        }
        catch(IOException e){
            e.printStackTrace();
        }
        return ResponseEntity.ok()
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }

    @PostMapping(path="/addtostar", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addToStar(@RequestBody String file, @RequestBody String userId)
    {
        HashMap<String,String> response= new HashMap<String, String>();
        fileService.addToStar(file, userId);
        response.put("Status", "success");
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PostMapping(path="/unstar", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> unStar(@RequestBody String file, @RequestBody User userId)
    {
        HashMap<String,String> response= new HashMap<String, String>();
        fileService.unStar(userId, file);
        response.put("Status", "success");
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PostMapping(path="/sharefile", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> shareFile(@RequestBody String file, @RequestBody String userId)
    {
        HashMap<String,String> response= new HashMap<String, String>();
        fileService.shareFile(userId, file);
        response.put("Status", "success");
        return new ResponseEntity(response, HttpStatus.OK);
    }
}