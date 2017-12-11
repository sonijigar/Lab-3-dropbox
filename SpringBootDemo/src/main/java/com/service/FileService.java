package com.service;

import com.entity.User;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;
import com.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import java.io.File;

import java.util.List;

@Service
public class FileService {
    @Autowired
    private FileRepository fileRepository;

    public HashMap<String, ArrayList> getFiles()
    {
        File folder=new File("./uploads");

		/*Get files*/
        File[] files=folder.listFiles();
        int j = 0;
        String arrFile[] = new String[10];
        String arrFolder[] = {};
        HashMap<String, ArrayList> hm = new HashMap<String, ArrayList>();
        ArrayList folderList = new ArrayList();
        ArrayList fileList = new ArrayList();
        for (File file : files) {
            if(file.isFile()){
                System.out.println("File : "+file.getName());
                fileList.add(file.getName());
            }else{
                System.out.println("Folder : "+file.getName());
                folderList.add(file.getName());
            }
        }
        hm.put("files",fileList);
        hm.put("folder", folderList);
        return hm;
    }

    public InputStreamResource fileDownload(String filename, String userId) throws IOException {

        //Path path = Paths.get(filename);
        String path = "/"+userId + "/"+filename;


        InputStreamResource resource = new InputStreamResource(new FileInputStream(path));

        return resource;
    }

    public String[] addToStar(String userId, String file){
        return fileRepository.save(userId, file);
    }

    public void unStar(User userId, String file){
        fileRepository.delete(userId);
    }

    public String[] shareFile(String userId, String file){
        return fileRepository.save(userId, file);
    }
//    public void addUser(User user){
//        userRepository.save(user);
//    }
//
//    public List<User> login(String email,String password){
//        return userRepository.findByEmailAndPassword(email,password);
//    }
}